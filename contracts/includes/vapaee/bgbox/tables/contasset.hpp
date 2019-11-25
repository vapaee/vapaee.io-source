#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE container_asset: Lista de todos los CONTAINERS definidos por alguien (los cuales tienen un TIPO de container)
            // scope: contract
            // row: representa un item, del cual existe una cantidad supply de unidades que no supera el max_supply
            TABLE container_asset {
                uint64_t              id;
                slug_asset        supply;
                uint64_t            spec; // table container_spec
                uint64_t       publisher; // table vapaeeaouthor::authors.id
                uint64_t           block;
                int                space; // espacio base que tendrá el container cuando se lo instancie para un usuario. 0 para infinito.
                uint64_t primary_key() const { return id;  }
                uint128_t slug_key() const { return supply.symbol.code().raw().to128bits(); }
                uint64_t publisher_key() const { return publisher; }
                std::string to_string() const {
                    return std::to_string((int) id) + " - supply(" + 
                    supply.to_string() + ") - spec(" + 
                    std::to_string((int) spec) + ") - publisher(" + 
                    std::to_string((int) publisher) + ") - block(" + 
                    std::to_string((int) block) + ") - space(" + 
                    std::to_string((int) space) + ")";
                };
            };
            typedef eosio::multi_index<"contasset"_n, container_asset,
                indexed_by<"slug"_n, const_mem_fun<container_asset, uint128_t, &container_asset::slug_key>>,
                indexed_by<"publisher"_n, const_mem_fun<container_asset, uint64_t, &container_asset::publisher_key>>
            > container_assets;
        // ------------------------------------  