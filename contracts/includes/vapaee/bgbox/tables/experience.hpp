#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE experience: Los contenedores que tiene un usuario
            // scope: user
            // row: representa un container para ese usuario que indica cuantos lugares libres tienen y que espacio total tiene
            TABLE experience {
                uint64_t         id;
                uint64_t    mastery; // mastery_spec
                uint64_t  container; // container_instance donde están los Mastery-Tokens
                name          table; // table affected: "", "itemunit", "itemasset"
                uint64_t        row; // row.id
                    // "itemunit": esta unidad está tuneada
                    // "itemasset": esta maestría es para tunear un objeto identificado con un slug item_asset[row].supply.symbol.row()
                // TODO: ver la posibilidad de implementar un cache aca
                uint64_t primary_key() const { return id; }
                uint64_t mastery_key() const { return mastery; }
                std::string to_string() const {
                    return std::to_string((int) id) + " - mastery(" + 
                    std::to_string((int) mastery) + ") - container(" +
                    std::to_string((int) container) + ") - table(" +
                    table.to_string() + ") - row(" + 
                    std::to_string((int) row) + ")";
                };
            };
            typedef eosio::multi_index<"experience"_n, experience,
                indexed_by<"mastery"_n, const_mem_fun<experience, uint64_t, &experience::mastery_key>>
            > experiences;
        // ------------------------------------