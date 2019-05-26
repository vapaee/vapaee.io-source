#include <vapaee/token/tables/_aux.hpp>

        // TABLE stats (currency) -----------
        // scope: owner
        TABLE unstake_time_table {
            symbol_code sym_code;
            uint64_t min_time;
            uint64_t max_time;
            uint64_t auto_stake;
            uint64_t primary_key() const { return sym_code.raw(); }
        };
        typedef eosio::multi_index< "config"_n, unstake_time_table > config;
        // ------------------------------------
        