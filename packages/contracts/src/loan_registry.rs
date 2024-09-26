// use crate::events;
use crate::enums::LoanStatus;
use crate::nfts::{LoanBorrowerNFT, LoanLenderNFT};
use crate::tokens;
use scrypto::prelude::*;

#[blueprint]
// #[events(
//     events::NFTMintedEvent,
// )]
mod loan_registry {
    enable_method_auth! {
        roles {
            package => updatable_by: [];
        },
        methods {
            increment_loans_requested_count => restrict_to: [package];
            increment_loans_issued_count => restrict_to: [package];
            increment_loans_repaid_count => restrict_to: [package];
            increment_loans_defaulted_count => restrict_to: [package];
            get_loan_borrower_nft_resource_manager => PUBLIC;
            get_loan_lender_nft_resource_manager => PUBLIC;
            debug => PUBLIC;
            debug_nfts => PUBLIC;
            test => PUBLIC;
        }
    }

    struct LoanRegistry {
        loan_borrower_nft_resource_manager: ResourceManager,
        loan_lender_nft_resource_manager: ResourceManager,

        loans_requested_count: u64,
        loans_issued_count: u64,
        loans_repaid_count: u64,
        loans_defaulted_count: u64,

        test_var: u64,
    }

    impl LoanRegistry {
        // Implement the functions and methods which will manage those resources and data

        // This is a function, and can be called directly on the blueprint once deployed
        pub fn instantiate_loan_registry() -> Global<LoanRegistry> {
            let (address_reservation, _component_address) =
                Runtime::allocate_component_address(Self::blueprint_id());

            let package_rule: AccessRule = rule!(
                require(package_of_direct_caller(Runtime::package_address()))
            );

            // let access_rule: AccessRule = rule!(
            //     require(package_of_direct_caller(Runtime::package_address()))
            //     || require(global_caller(component_address))
            // );

            let loan_borrower_nft_resource_manager: ResourceManager = tokens::provision_nft_resource_manager::<LoanBorrowerNFT>(
                package_rule.clone(),
                "BORROWER".to_string(),
                "Borrower".to_string(),
                "Loan Borrower NFTs".to_string(),
                "https://assets-global.website-files.com/6053f7fca5bf627283b582c2/6266da31549a9386481173ed_Scrypto-Icon-Round%403x.png".to_string()
            );

            let loan_lender_nft_resource_manager: ResourceManager = tokens::provision_nft_resource_manager::<LoanLenderNFT>(
                package_rule.clone(),
                "LENDER".to_string(),
                "Lender".to_string(),
                "Loan Lender NFTs".to_string(),
                "https://assets-global.website-files.com/6053f7fca5bf627283b582c2/6266da31549a9386481173ed_Scrypto-Icon-Round%403x.png".to_string()
            );

            // Instantiate a Hello component, populating its vault with our supply of 1000 HelloToken
            Self {
                // sample_vault: Vault::with_bucket(my_bucket),
                loan_borrower_nft_resource_manager,
                loan_lender_nft_resource_manager,
                loans_requested_count: 0,
                loans_issued_count: 0,
                loans_repaid_count: 0,
                loans_defaulted_count: 0,
                test_var: 0,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .roles(roles!(
                package => package_rule.clone();
            ))
            .with_address(address_reservation)
            .globalize()
        }

        pub fn increment_loans_requested_count(&mut self) -> u64 {
            self.loans_requested_count += 1;

            return self.loans_requested_count;
        }

        pub fn increment_loans_issued_count(&mut self) -> u64 {
            self.loans_issued_count += 1;

            return self.loans_issued_count;
        }

        pub fn increment_loans_repaid_count(&mut self) -> u64 {
            self.loans_repaid_count += 1;

            return self.loans_repaid_count;
        }

        pub fn increment_loans_defaulted_count(&mut self) -> u64 {
            self.loans_defaulted_count += 1;

            return self.loans_defaulted_count;
        }

        pub fn get_loan_borrower_nft_resource_manager(&mut self) -> ResourceManager {
            return self.loan_borrower_nft_resource_manager;
        }

        pub fn get_loan_lender_nft_resource_manager(&mut self) -> ResourceManager {
            return self.loan_lender_nft_resource_manager;
        }

        pub fn test(&mut self) {
            self.test_var += 1;
        }

        pub fn debug(&self) {
            // info!("-- DEBUG ------------------------------------------------------------");
            info!("loans_requested_count: {}", self.loans_requested_count);
            info!("loans_issued_count: {}", self.loans_issued_count);
            info!("loans_repaid_count: {}", self.loans_repaid_count);
            info!("loans_defaulted_count: {:?}", self.loans_defaulted_count);
        }
        
        pub fn debug_nfts(&self) {
            for n in 1..self.loans_requested_count+1 {
                let nft_id = NonFungibleLocalId::Integer(IntegerNonFungibleLocalId::from(n));
                self.log_borrower_nft(&nft_id);
            }
            info!("-- LENDERS --");
            for n in 1..self.loans_issued_count+1 {
                let nft_id = NonFungibleLocalId::Integer(IntegerNonFungibleLocalId::from(n));
                self.log_lender_nft(&nft_id);
            }
        }

        fn log_borrower_nft(&self, id: &NonFungibleLocalId) {
            let data: LoanBorrowerNFT = self.loan_borrower_nft_resource_manager.get_non_fungible_data(id);

            info!(
                "LoanBorrowerNFT {} [{}] \t amount: {} \t total_amount: {} \t duration: {} \t  apr: {} \t matures: {:?} \t  closed: {:?}",
                id,
                Self::format_status(&data.status),
                data.amount,
                data.total_amount,
                data.duration,
                data.apr,
                data.maturity_date,
                data.closed_date
            );
            // info!("---------------------------------------------------------------------------------------------------------------------");
        }

        fn log_lender_nft(&self, id: &NonFungibleLocalId) {
            let data: LoanLenderNFT = self.loan_lender_nft_resource_manager.get_non_fungible_data(id);

            info!(
                // "LoanLenderNFT   {} [{}] \t component: {:?}",
                "LoanLenderNFT   {} [{}]",
                id,
                Self::format_status(&data.status)
            );
            // info!("---------------------------------------------------------------------------------------------------------------------");
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

    }
}
