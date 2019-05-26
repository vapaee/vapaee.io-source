#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE app: lista de apps registradas -----------
            // scope: contract
            TABLE app {
                uint64_t        id;
                name      contract;
                string       title;
                uint64_t primary_key() const { return id;  }
                uint64_t by_contract_key() const { return contract.value;  }
                std::string to_string() const {
                    return std::to_string((int) id) + " - " + title + " - " + contract.to_string() ;
                };
            };
            
            typedef eosio::multi_index<"apps"_n, app,
                indexed_by<"contract"_n, const_mem_fun<app, uint64_t, &app::by_contract_key>>
            > apps;
        // ------------------------------------