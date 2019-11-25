#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE container_instance: Los contenedores que tiene un usuario
            // scope: user
            // row: representa un container para ese usuario que indica cuantos lugares libres tienen y que espacio total tiene
            TABLE container_instance {
                uint64_t      id;
                uint64_t   asset; // table container_assets.id
                int        empty;
                int        space;
                vector<uint64_t> slots;
                uint64_t primary_key() const { return id;  }
                uint64_t asset_key() const { return asset; }
                std::string to_string() const {
                    return std::to_string((int) id) + " - asset(" + 
                    std::to_string((int) asset) + ") - empty(" + 
                    std::to_string((int) empty) + ") - space(" + 
                    std::to_string((int) space) + ") has " + std::to_string((int) slots.size()) + " empty slots in memory";
                };
            };
            typedef eosio::multi_index<"containers"_n, container_instance,
                indexed_by<"asset"_n, const_mem_fun<container_instance, uint64_t, &container_instance::asset_key>>
            > containers;
        // ------------------------------------