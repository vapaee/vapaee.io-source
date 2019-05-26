#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE mastery_spec: lista de todas las maestrías definidas por una app
            // scope: contract
            TABLE mastery_spec {
                uint64_t          id;
                name            nick;
                uint64_t   container; // container_spec
                uint64_t         app; // table vapaeeaouthor::authors.id
                name           table; // table affected: "", "item_spec", "item_asset"
                uint64_t         row; // mastery_prop.id 
                    // "item_spec": esta maestría es para tunear un objeto de tipo descrito en la fila row
                    // "item_asset": esta maestría es para tunear un objeto identificado con un slug item_asset[row].supply.symbol.row()
                uint64_t primary_key() const { return id; }
                uint128_t secondary_key() const { return vapaee::utils::combine(app, nick); }
                uint64_t app_key() const { return app; }
                std::string to_string() const {
                    return std::to_string((int) id) + " - " + 
                    nick.to_string() + " - container(" +
                    std::to_string((int) container) + ") - app(" +
                    std::to_string((int) app) + ") - table(" + 
                    table.to_string() + ") - row(" + 
                    std::to_string((int) row) + ")";
                };
            };
            typedef eosio::multi_index<"mastery"_n, mastery_spec,
                indexed_by<"second"_n, const_mem_fun<mastery_spec, uint128_t, &mastery_spec::secondary_key>>,
                indexed_by<"app"_n, const_mem_fun<mastery_spec, uint64_t, &mastery_spec::app_key>>
            > mastery_specs;
        // ------------------------------------