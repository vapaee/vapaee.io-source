#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE item_asset: Lista de todos los ITEMS definidos por alguien (los cuales tienen un TIPO de item)
            // scope: contract
            // row: representa un item, del cual existe una cantidad supply de unidades que no supera el max_supply
            TABLE item_asset {
                uint64_t              id;
                slug_asset        supply;
                slug_asset    max_supply;
                uint64_t            spec; // table item_spec
                uint64_t       publisher; // table vapaeeaouthor::authors.id
                uint64_t           block; 
                uint64_t primary_key() const { return id;  }
                uint128_t slug_key() const { return supply.symbol.code().raw().to128bits(); }
                uint64_t publisher_key() const { return publisher; }
                std::string to_string() const {
                    return std::to_string((int) id) + " - supply(" + 
                    supply.to_string() + ") - max(" +
                    max_supply.to_string() + ") - spec(" +
                    std::to_string((int) spec) + ") - publisher(" + 
                    std::to_string((int) publisher) + ") - block(" + 
                    std::to_string((int) block) + ")";
                };
            };
            typedef eosio::multi_index<"assets"_n, item_asset,
                indexed_by<"slug"_n, const_mem_fun<item_asset, uint128_t, &item_asset::slug_key>>,
                indexed_by<"publisher"_n, const_mem_fun<item_asset, uint64_t, &item_asset::publisher_key>>
            > item_assets;
        // ------------------------------------