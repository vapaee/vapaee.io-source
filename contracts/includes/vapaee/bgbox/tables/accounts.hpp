#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE account (balances) -----------
            // scope: user
            // row: dice cuantas unidades tiene el usuario de determinado item identificado por un slug
            TABLE account { 
                uint64_t           id;
                uint64_t        asset; // item_asset.id
                slug_asset    balance; // cuantas unidades del item identificado por slug tiene el usuario
                uint64_t primary_key() const { return id;  }
                uint128_t slug_key() const { return balance.symbol.code().raw().to128bits(); }
                std::string to_string() const {
                    return std::to_string((int) id) + " - asset(" + std::to_string((int) asset) + ") - " + balance.to_string();
                };
            };
            typedef eosio::multi_index<"accounts"_n, account, 
                indexed_by<"slug"_n, const_mem_fun<account, uint128_t, &account::slug_key>>
            > accounts;
        // ------------------------------------