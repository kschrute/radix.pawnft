use crate::enums::LoanStatus;
use crate::loan_registry::loan_registry::LoanRegistry;
use crate::nfts::{LoanBorrowerNFT, LoanLenderNFT};
use std::ops::Add;
use scrypto::prelude::*;

// This component holds a state that tracks a lifecycle of a loan. There's a new component per each loan requested. 

#[blueprint]
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
            withdraw_payment => restrict_to: [lender];
            take_collateral => restrict_to: [lender];
            issue_loan => PUBLIC;
            check_maturity => PUBLIC;
            debug => PUBLIC;
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
        // Intantiates a new loan request with the decired loan parameters
        pub fn instantiate_loan_request(
            // reference to the `LoanRegistry` component so we can call its methods
            loan_registry_address: ComponentAddress,
            // stores nfts passed in as collateral
            non_fungible_tokens: Vec<NonFungibleBucket>,
            // accepted loan payment resource address
            accepted_payment_token: ResourceAddress,
            // desired loan amount
            loan_amount: Decimal,
            // desired loan APR
            loan_apr: Decimal,
            // desired loan duration
            loan_duration: i64,
            // account to receive loan amount when loan request accepted
            loan_receiver: ComponentAddress,
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
            loan_registry.increment_loans_requested_count();
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
            self.loan_registry.increment_loans_issued_count();
            let loans_issued_count = match self.loan_registry.get_loan_lender_nft_resource_manager().total_supply() {
                Some(v) => v.add(1),
                None => Decimal::from(1),
            };
            let loans_issued_count_int: u64 = loans_issued_count.try_into().unwrap();
            let nft_id = NonFungibleLocalId::Integer(IntegerNonFungibleLocalId::from(loans_issued_count_int));
            let data = Self::new_loan_lender_nft();
            let loan_lender_nft = self.loan_registry.get_loan_lender_nft_resource_manager().mint_non_fungible(&nft_id, data);
            let loan_lender_nft_global_id = NonFungibleGlobalId::new(
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

            self.loan_registry.increment_loans_repaid_count();
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


        pub fn cancel_request(&mut self, loan_borrower_nft: Proof) -> Vec<NonFungibleBucket> {
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
            self.update_borrower_nft(&nft.local_id(), LoanStatus::Cancelled, None, None);

            self.loan_status = LoanStatus::Cancelled;

            let nfts = self.return_nfts();

            return nfts;
        }

        pub fn withdraw_payment(&mut self) -> Bucket {
            assert!(
                matches!(
                    self.loan_status,
                    LoanStatus::Repaid
                ),
                "[repay_loan]: Only issued loans can be repaid."
            );

            return self.payment_vault.take_all();
        }

        pub fn take_collateral(&mut self) -> Vec<NonFungibleBucket> {
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

            self.loan_registry.increment_loans_defaulted_count();
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
        
        fn get_total_loan_amount(loan_amount: Decimal, loan_apr: Decimal, loan_duration: i64) -> Decimal {
            let total_interest = loan_amount * loan_apr * loan_duration / 365;

            return loan_amount.add(total_interest);
        }

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

        fn update_borrower_nft(
            &self, 
            id: &NonFungibleLocalId,
            status: LoanStatus,
            maturity_date: Option<UtcDateTime>,
            closed_date: Option<UtcDateTime>,
        ) {
            self.loan_registry.get_loan_borrower_nft_resource_manager().update_non_fungible_data(
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
        }

        fn update_lender_nft(
            &self, 
            id: &NonFungibleLocalId,
            status: LoanStatus,
        ) {
            self.loan_registry.get_loan_lender_nft_resource_manager().update_non_fungible_data(
                id,
                "status",
                status,
            );
        }

        




        // ---------------------------------------------------------------------------------------------------
        // Local debug stuff
        // ---------------------------------------------------------------------------------------------------

        fn format_status(v: &LoanStatus) -> String {
            match v {
                LoanStatus::Requested => return String::from("Requested"),
                LoanStatus::Cancelled => return String::from("Cancelled"),
                LoanStatus::Issued => return String::from("Issued"),
                LoanStatus::Repaid => return String::from("Repaid"),
                LoanStatus::Defaulted => return String::from("Defaulted"),
            }
        }

        pub fn debug(&self) {
            let now = UtcDateTime::from_instant(&Clock::current_time_rounded_to_seconds()).ok().unwrap();

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
        }
    }
}
