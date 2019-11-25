#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE aura_fx: las auras que tiene prendidas el usuario
            // scope: user
            // row: significa que el usuario tiene activa esta aura quantity veces
            TABLE aura_fx {
                uint64_t         id;
                uint64_t    mastery;   // mastery_spec
                uint64_t  container;   // container_instance
                // TODO: ver la posibilidad de implementar un cache aca
                uint64_t primary_key() const { return id;  }
                std::string to_string() const {
                    return std::to_string((int) id) + " - mastery(" +
                    std::to_string((int) mastery) + ") - container(" + 
                    std::to_string((int) container) + ")";
                };
            };
            typedef eosio::multi_index<"aurafxs"_n, aura_fx> aura_fxs;
        // ------------------------------------

