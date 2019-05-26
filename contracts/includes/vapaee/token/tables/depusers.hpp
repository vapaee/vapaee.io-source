#include <vapaee/token/tables/_aux.hpp>

        // TABLE depusers -----------
        // scope: owner
        TABLE depusers_table {
            name account;
            uint64_t primary_key() const { return account.value; }
        };
        typedef eosio::multi_index< "depusers"_n, depusers_table > depusers;
        // ------------------------------------
        