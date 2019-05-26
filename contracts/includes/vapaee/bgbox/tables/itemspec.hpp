#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE item_spec: Lista de todos los TIPOS de items que existen. Cada App define varios tipos de items
            // scope: contract
            // row: representa un tipo de item definido por una aplicación app con el nombre nick
            TABLE item_spec { 
                uint64_t          id;
                name            nick; 
                uint64_t         app; // table vapaeeaouthor::authors.id
                int         maxgroup; // MAX (max quantity in same slot), 1 (no agroup), 0 (no limit)
                uint64_t primary_key() const { return id;  }
                uint128_t secondary_key() const { return vapaee::utils::combine(app, nick); }
                uint64_t app_key() const { return app; }
                std::string to_string() const {
                    return std::to_string((int) id) + " - " + nick.to_string() + " - app(" + 
                    std::to_string((int) app) + ") - maxgroup(" + 
                    std::to_string((int) maxgroup) + ")";
                };
            };
            typedef eosio::multi_index<"itemspec"_n, item_spec,
                indexed_by<"second"_n, const_mem_fun<item_spec, uint128_t, &item_spec::secondary_key>>,
                indexed_by<"app"_n, const_mem_fun<item_spec, uint64_t, &item_spec::app_key>>
            > item_specs;
        // ------------------------------------