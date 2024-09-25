// use crate::events;
use crate::enums::LoanStatus;
use crate::loan_registry::loan_registry::LoanRegistry;
use crate::nfts::{LoanBorrowerNFT, LoanLenderNFT};
use std::ops::Add;
use scrypto::prelude::*;

#[blueprint]
// #[events(
//     events::NFTMintedEvent,
// )]
mod loan_request {
    enable_method_auth! {
        roles {
            owner => updatable_by: [];
            borrower => updatable_by: [];
            lender => updatable_by: [SELF];
        },
        methods {
            cancel_request => restrict_to: [borrower];
            repay_loan => restrict_to: [borrower];
            take_collateral => restrict_to: [lender];
            issue_loan => PUBLIC;
            check_maturity => PUBLIC;
            debug => PUBLIC;
            debug2 => PUBLIC;
        }
    }

    struct LoanRequest {
        loan_registry: Global<LoanRegistry>,

        nft_vaults: HashMap<ResourceAddress, NonFungibleVault>,

        payment_vault: Vault,

        accepted_payment_token: ResourceAddress,

        loan_status: LoanStatus,

        loan_amount: Decimal,
        
        loan_amount_total: Decimal,

        loan_duration: i64,

        loan_apr: Decimal,

        loan_receiver: ComponentAddress,

        loan_maturity_date: Option<UtcDateTime>,
        
        loan_closed_date: Option<UtcDateTime>,

        borrower_nft_id: Option<NonFungibleLocalId>,

        lender_nft_id: Option<NonFungibleLocalId>,
    }

    impl LoanRequest {
        // Implement the functions and methods which will manage those resources and data

        // This is a function, and can be called directly on the blueprint once deployed
        pub fn instantiate_loan_request(
            loan_registry_address: ComponentAddress,
            non_fungible_tokens: Vec<NonFungibleBucket>,
            accepted_payment_token: ResourceAddress,
            loan_amount: Decimal,
            loan_apr: Decimal,
            loan_duration: i64,
            loan_receiver: ComponentAddress,
            // loan_borrower_nft_global_id: NonFungibleGlobalId,
        ) -> (Global<LoanRequest>, Bucket) {
            assert!(
                !matches!(
                    ResourceManager::from_address(accepted_payment_token).resource_type(),
                    ResourceType::NonFungible { id_type: _ }
                ),
                "[Instantiation]: Only payments of fungible resources are accepted."
            );
            assert!(
                loan_amount >= Decimal::zero(),
                "[Instantiation]: The tokens can not be sold for a negative amount."
            );

            let (address_reservation, component_address) =
                Runtime::allocate_component_address(Self::blueprint_id());

            let loan_registry: Global<LoanRegistry> = loan_registry_address.into();

            // Create a new HashMap of vaults and aggregate all of the tokens in the buckets into the vaults of this
            // HashMap. This means that if somebody passes multiple buckets of the same resource, then they would end
            // up in the same vault.
            let mut nft_vaults: HashMap<ResourceAddress, NonFungibleVault> = HashMap::new();
            for bucket in non_fungible_tokens.into_iter() {
                nft_vaults
                    .entry(bucket.resource_address())
                    .or_insert(NonFungibleVault::new(bucket.resource_address()))
                    .put(bucket)
            }

            let loan_amount_total = Self::get_total_loan_amount(loan_amount, loan_apr, loan_duration);

            // Mint LoanBorrower NFT
            let _loans_requested_count = loan_registry.increment_loans_requested_count();
            let loans_requested_count = match loan_registry.get_loan_borrower_nft_resource_manager().total_supply() {
                Some(v) => v.add(1),
                None => Decimal::from(1),
            };
            let loans_requested_count_int: u64 = loans_requested_count.try_into().unwrap();
            // let nft_id = NonFungibleLocalId::Integer(loans_issued_count.into());
            let nft_id = NonFungibleLocalId::Integer(IntegerNonFungibleLocalId::from(loans_requested_count_int));
            let data = Self::new_loan_borrower_nft(
                component_address,
                loan_receiver,
                loan_amount,
                loan_amount_total,
                loan_duration,
                loan_apr,
            );
            let loan_borrower_nft = loan_registry.get_loan_borrower_nft_resource_manager().mint_non_fungible(&nft_id, data);
            let loan_borrower_nft_global_id: NonFungibleGlobalId = NonFungibleGlobalId::new(
                loan_borrower_nft.resource_address(),
                nft_id.clone()
            );

            // Runtime::emit_event(events::NFTMintedEvent {
            //     nft_id: nft_id.clone(),
            //     // name,
            // });

            // define access rules for the roles
            let owner_rule = rule!(require(global_caller(loan_registry_address)));
            let borrower_rule = rule!(require(loan_borrower_nft_global_id.clone()));

            // Instantiate component with loan params
            let loan_request = Self {
                loan_registry,
                nft_vaults,
                payment_vault: Vault::new(accepted_payment_token),
                accepted_payment_token,
                loan_status: LoanStatus::Requested,
                loan_amount,
                loan_amount_total,
                loan_duration,
                loan_apr,
                loan_receiver,
                borrower_nft_id: Some(nft_id),
                lender_nft_id: None,
                loan_maturity_date: None,
                loan_closed_date: None,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::Fixed(owner_rule.clone()))
            .roles(roles!(
                owner => owner_rule.clone();
                borrower => borrower_rule;
                lender => owner_rule.clone();
            ))
            .with_address(address_reservation)
            .globalize();

            return (loan_request, loan_borrower_nft);
        }

        // This method takes a payment in the amount specified in the request
        pub fn issue_loan(
            &mut self,
            mut payment: Bucket
        ) -> (Bucket, Bucket) {
            assert!(
                matches!(
                    self.loan_status,
                    LoanStatus::Requested
                ),
                "[issue_loan]: Only pending loans can be issued."
            );
            // Checking if the appropriate amount of the payment token was provided before approving the token sale
            assert_eq!(
                payment.resource_address(),
                self.accepted_payment_token,
                "[issue_loan]: Invalid tokens were provided as payment. Payment are only allowed in {:?}",
                self.accepted_payment_token
            );
            assert!(
                payment.amount() >= self.loan_amount,
                "[issue_loan]: Invalid quantity was provided. This sale can only go through when {} tokens are provided.",
                self.loan_amount
            );

            // Set loan maturity date
            info!("XXX: {:?}", Clock::current_time_rounded_to_seconds());

            let current_time = Clock::current_time_rounded_to_seconds();
            let loan_maturity_date = UtcDateTime::from_instant(&current_time.add_seconds(self.loan_duration).unwrap()).ok().unwrap();
            self.loan_maturity_date = Some(loan_maturity_date);

            // Update loan status
            self.loan_status = LoanStatus::Issued;

            match &self.borrower_nft_id {
                None => {},
                Some(borrower_nft_id) => {
                    self.update_borrower_nft(&borrower_nft_id, LoanStatus::Issued, Some(loan_maturity_date), None);
                },
            }

            // Mint LoanLender NFT
            let _loans_issued_count = self.loan_registry.increment_loans_issued_count();
            let loans_issued_count = match self.loan_registry.get_loan_lender_nft_resource_manager().total_supply() {
                Some(v) => v.add(1),
                None => Decimal::from(1),
            };
            let loans_issued_count_int: u64 = loans_issued_count.try_into().unwrap();
            // let nft_id = NonFungibleLocalId::Integer(loans_issued_count.into());
            let nft_id = NonFungibleLocalId::Integer(IntegerNonFungibleLocalId::from(loans_issued_count_int));
            let data = Self::new_loan_lender_nft();
            let loan_lender_nft = self.loan_registry.get_loan_lender_nft_resource_manager().mint_non_fungible(&nft_id, data);
            let loan_lender_nft_global_id = NonFungibleGlobalId::new(
                // self.loan_lender_nft_resource_manager.address(),
                loan_lender_nft.resource_address(),
                nft_id.clone()
            );
            self.lender_nft_id = Some(nft_id);

            // Update lender role
            Runtime::global_component().set_role("lender", rule!(require(loan_lender_nft_global_id.clone())));

            // Deposit the loan into the loan receiver account
            let mut account_component: Global<Account> = self.loan_receiver.into();
            account_component.try_deposit_or_abort(payment.take(self.loan_amount), None);

            return (payment, loan_lender_nft);
        }

        // pub fn repay_loan(&mut self) { todo!() }
        pub fn repay_loan(&mut self, mut payment: Bucket, loan_borrower_nft: Proof) -> (Bucket, Vec<NonFungibleBucket>) {
            assert!(
                matches!(
                    self.loan_status,
                    LoanStatus::Issued
                ),
                "[repay_loan]: Only issued loans can be repaid."
            );
            // Checking if the appropriate amount of the payment token was provided before approving the token sale
            assert_eq!(
                payment.resource_address(),
                self.accepted_payment_token,
                "[repay_loan]: Invalid tokens were provided as payment. Payment are only allowed in {:?}",
                self.accepted_payment_token
            );
            assert!(
                payment.amount() >= self.loan_amount_total,
                "[repay_loan]: Invalid quantity was provided. This sale can only go through when {} tokens are provided.",
                self.loan_amount_total
            );

            let _loans_repaid_count = self.loan_registry.increment_loans_repaid_count();
            let closed_date = UtcDateTime::from_instant(&Clock::current_time_rounded_to_seconds()).ok().unwrap();

            let loan_borrower_nft = loan_borrower_nft.check(
                self.loan_registry.get_loan_borrower_nft_resource_manager().address()
            );

            let nft: NonFungible<LoanBorrowerNFT> = loan_borrower_nft
                .as_non_fungible()
                .non_fungible();

            self.update_borrower_nft(&nft.local_id(), LoanStatus::Repaid, None, Some(closed_date));

            match &self.lender_nft_id {
                None => {},
                Some(lender_nft_id) => {
                    self.update_lender_nft(&lender_nft_id, LoanStatus::Repaid);
                },
            }

            self.payment_vault.put(payment.take(self.loan_amount_total));

            self.loan_closed_date = Some(closed_date);
            self.loan_status = LoanStatus::Repaid;

            let nfts = Self::return_nfts(self);

            return (payment, nfts);
        }


        // pub fn cancel_request(&mut self) { todo!() }
        pub fn cancel_request(&mut self, loan_borrower_nft: Proof) -> Vec<NonFungibleBucket> {
            info!("[!!!] LOAN STATUS: {}", Self::format_status(&self.loan_status));

            assert!(
                matches!(
                    self.loan_status,
                    LoanStatus::Requested
                ),
                "[issue_loan]: Only pending loans can be cancelled."
            );

            let loan_borrower_nft = loan_borrower_nft.check(
                self.loan_registry.get_loan_borrower_nft_resource_manager().address()
            );

            let nft: NonFungible<LoanBorrowerNFT> = loan_borrower_nft
                .as_non_fungible()
                .non_fungible();

            info!("[!!!] NFT ID: {}", nft.local_id());

            // assert_eq!(self.borrower_nft_id.as_ref().unwrap(), nft.local_id(), "You are not the borrower");

            self.update_borrower_nft(&nft.local_id(), LoanStatus::Cancelled, None, None);

            self.loan_status = LoanStatus::Cancelled;

            let nfts = self.return_nfts();

            return nfts;
        }

        pub fn take_collateral(&mut self, loan_lender_nft: Proof) -> Vec<NonFungibleBucket> {
            assert!(
                matches!(
                    self.loan_status,
                    LoanStatus::Issued
                ),
                "[take_collateral]: Only issued loans can be used to take collateral."
            );
            assert_eq!(
                self.check_maturity(), 
                true, 
                "[take_collateral]: The loan has not reached its maturity!"
            );

            let _loans_defaulted_count = self.loan_registry.increment_loans_defaulted_count();
            let closed_date = UtcDateTime::from_instant(&Clock::current_time_rounded_to_seconds()).ok().unwrap();

            self.loan_status = LoanStatus::Defaulted;
            self.loan_closed_date = Some(closed_date);

            match &self.borrower_nft_id {
                None => {},
                Some(borrower_nft_id) => {
                    self.update_borrower_nft(&borrower_nft_id, LoanStatus::Defaulted, None, Some(closed_date));
                },
            }

            match &self.lender_nft_id {
                None => {},
                Some(lender_nft_id) => {
                    self.update_lender_nft(&lender_nft_id, LoanStatus::Defaulted);
                },
            }

            // self.update_borrower_nft(&nft, LoanStatus::Cancelled, None);

            // let nfts = Self::return_nfts(self);
            let nfts = self.return_nfts();

            return nfts;
        }

        // Checks whether loan maturity date has been reached
        pub fn check_maturity(&self) -> bool {
            match self.loan_maturity_date {
                None => return false,
                Some(date) => {
                    return Clock::current_time_comparison(
                        date.to_instant(),
                        TimePrecision::Second,
                        TimeComparisonOperator::Gte
                    );
                },
            }
        }
        
        // ------------------------------------------------------------------------------

        // Creating a vector of buckets of all of the NFTs that the component has, then adding to it the remaining
        // tokens from the payment
        fn return_nfts(&mut self) -> Vec<NonFungibleBucket> {
            let resource_addresses: Vec<ResourceAddress> =
                self.nft_vaults.keys().cloned().collect();
            let mut tokens: Vec<NonFungibleBucket> = Vec::new();
            for resource_address in resource_addresses.into_iter() {
                tokens.push(
                    self.nft_vaults
                        .get_mut(&resource_address)
                        .unwrap()
                        .take_all(),
                )
            }

            return tokens;
        }

        fn new_loan_borrower_nft(
            component_address: ComponentAddress,
            receiver_address: ComponentAddress,
            amount: Decimal,
            total_amount: Decimal,
            duration: i64,
            apr: Decimal,
        ) -> LoanBorrowerNFT {
            LoanBorrowerNFT {
                component: component_address,
                receiver: receiver_address,
                amount,
                total_amount,
                duration,
                apr,
                status: LoanStatus::Requested,
                maturity_date: None,
                closed_date: None,
            }
        }

        fn new_loan_lender_nft() -> LoanLenderNFT {
            LoanLenderNFT {
                component: Runtime::global_address(),
                status: LoanStatus::Issued,
            }
        }

        fn format_status(v: &LoanStatus) -> String {
            match v {
                LoanStatus::Requested => return String::from("Requested"),
                LoanStatus::Cancelled => return String::from("Cancelled"),
                LoanStatus::Issued => return String::from("Issued"),
                LoanStatus::Repaid => return String::from("Repaid"),
                LoanStatus::Defaulted => return String::from("Defaulted"),
            }
        }

        fn get_total_loan_amount(loan_amount: Decimal, loan_apr: Decimal, loan_duration: i64) -> Decimal {
            let total_interest = loan_amount * loan_apr * loan_duration / 365;

            return loan_amount.add(total_interest);
        }

        // TODO: Pull NFT id from the state to simplify?
        fn update_borrower_nft(
            &self, 
            id: &NonFungibleLocalId,
            // nft: &NonFungible<LoanBorrowerNFT>,
            status: LoanStatus,
            maturity_date: Option<UtcDateTime>,
            closed_date: Option<UtcDateTime>,
        ) {
            // self.log_borrower_nft(&nft.local_id());

            self.loan_registry.get_loan_borrower_nft_resource_manager().update_non_fungible_data(
                // &nft.local_id(),
                id,
                "status",
                status,
            );

            match maturity_date {
                None => {},
                Some(date) => {
                    self.loan_registry.get_loan_borrower_nft_resource_manager().update_non_fungible_data(
                        id,
                        "maturity_date",
                        Some(date),
                    );
                },
            }

            match closed_date {
                None => {},
                Some(date) => {
                    self.loan_registry.get_loan_borrower_nft_resource_manager().update_non_fungible_data(
                        id,
                        "closed_date",
                        Some(date),
                    );
                },
            }

            // self.log_borrower_nft(&nft.local_id());
        }

        fn update_lender_nft(
            &self, 
            id: &NonFungibleLocalId,
            // nft: &NonFungible<LoanLenderNFT>,
            status: LoanStatus,
        ) {
            self.loan_registry.get_loan_lender_nft_resource_manager().update_non_fungible_data(
                // &nft.local_id(),
                id,
                "status",
                status,
            );
        }

        // fn log_borrower_nft(&self, id: &NonFungibleLocalId, data: &LoanBorrowerNFT) {
        // fn log_borrower_nft(&self, id: &NonFungibleLocalId) {
        //     let data: LoanBorrowerNFT = self.loan_registry.get_loan_borrower_nft_resource_manager().get_non_fungible_data(id);

        //     // let date = Some(data.maturity_date);
        //     // let fmt = date.format("%Y-%m-%d][%H:%M:%S");
        //     // let fmt = Some("boom");

        //     // match data.maturity_date {
        //     //     None => info!("No date"),
        //     //     Some(date) => {
        //     //         info!("{:?}", date);
        //     //     }
        //     // };

        //     info!("-- BORROWER NFT {} --------------------------------------------------------------------------------------------------", id);
        //     // info!("{:?}", Some(data.maturity_date));

        //     info!(
        //         "id: {} \t amount: {} \t total_amount: {} \t duration: {} \t  apr: {} \t matures: {:?} \t  closed: {:?} \t status: {}",
        //         id,
        //         data.amount,
        //         data.total_amount,
        //         data.duration,
        //         data.apr,
        //         data.maturity_date,
        //         data.closed_date,
        //         Self::format_status(&data.status)
        //         // Some(data.maturity_date).format("%Y-%m-%d][%H:%M:%S"),
        //         // data.maturity_date.format("%Y-%m-%d][%H:%M:%S"),
        //         // data.closed_date
        //     );
        //     info!("---------------------------------------------------------------------------------------------------------------------");
        // }

        pub fn debug(&self) {
            let now = UtcDateTime::from_instant(&Clock::current_time_rounded_to_seconds()).ok().unwrap();

            // info!("-- DEBUG ------------------------------------------------------------");
            info!("loan_status: {}", Self::format_status(&self.loan_status));
            info!("matured: {}", self.check_maturity());
            info!("Current Time: {:?}", now);
            info!("loan_maturity_date: {:?}", self.loan_maturity_date);
            info!("loan_closed_date: {:?}", self.loan_closed_date);
            info!("loan_amount: {}", self.loan_amount);
            info!("loan_amount_total: {}", self.loan_amount_total);
            info!("loan_duration: {}", self.loan_duration);
            info!("loan_apr: {:?}", self.loan_apr);
            info!("borrower_nft_id: {:?}", self.borrower_nft_id);
            info!("lender_nft_id: {:?}", self.lender_nft_id);
            info!("loan_receiver: {:?}", self.loan_receiver);
            // info!("---------------------------------------------------------------------");
        }

        pub fn debug2(&mut self, mut payment: Bucket) -> Bucket {
            // info!("-- DEBUG ------------------------------------------------------------");
            info!("loan_amount: {}", self.loan_amount);
            info!("loan_duration: {}", self.loan_duration);
            info!("loan_apr: {}", self.loan_apr);
            info!("loan_receiver: {:?}", self.loan_receiver);

            self.payment_vault.put(payment.take(self.loan_amount));

            return payment;
        }

    }
}
