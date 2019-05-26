#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE user_reg: lista de todos los publishers (authors que no son apps))
            // scope: contract
            // row: representa un usuario
            TABLE profile {
                uint64_t  id;
                string username;
                uint16_t primary_key() const { return id;  }
                uint64_t by_username_key() const {
                    switch (username.length()) {
                        case 0:  return (uint16_t) (0);
                        case 1:  return (uint16_t) (username[0] * 65536);
                        case 2:  return (uint16_t) (username[0] * 65536 + username[1] * 256);
                        default: return (uint16_t) (username[0] * 65536 + username[1] * 256 + username[2]);
                    }
                }
                std::string to_string() const {
                    return std::to_string((int) id) + " - " + username ;
                };
            };
            typedef eosio::multi_index<"profiles"_n, profile,
                indexed_by<"username"_n, const_mem_fun<profile, uint64_t, &profile::by_username_key>>
            > profiles;            
        // ------------------------------------