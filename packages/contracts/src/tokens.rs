use scrypto::prelude::*;

// Provisions an nft resource manager with an ability to mint and update nft data based on the `access_rule`
pub fn provision_nft_resource_manager<D: NonFungibleData>(
    access_rule: AccessRule,
    symbol: String,
    name: String,
    description: String,
    icon_url: String,
) -> ResourceManager {
    let resource_manger = ResourceBuilder::new_integer_non_fungible::<D>(OwnerRole::None)
        .metadata(metadata!(
            roles {
                metadata_setter => access_rule.clone();
                metadata_setter_updater => access_rule.clone();
                metadata_locker => access_rule.clone();
                metadata_locker_updater => access_rule.clone();
            },
            init {
                "symbol" => symbol, locked;
                "name" => name, updatable;
                "description" => description, updatable;
                "icon_url" => Url::of(icon_url), updatable;
            }
        ))
        .mint_roles(mint_roles! {
            minter => access_rule.clone();
            minter_updater => access_rule.clone();
        })
        .non_fungible_data_update_roles(non_fungible_data_update_roles!(
            non_fungible_data_updater => access_rule.clone();
            non_fungible_data_updater_updater => access_rule.clone();
        ))
        .create_with_no_initial_supply();

    resource_manger
}
