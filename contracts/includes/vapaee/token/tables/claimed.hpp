#include <vapaee/token/tables/_aux.hpp>

        // TABLE claimed (airdrop claimed mark) -----------
        // scope: owner
        // Every user has this table with 1 entry for each token symbol_code claimed
        TABLE claimed_table {
            symbol_code sym_code;
            uint64_t primary_key() const { return sym_code.raw(); }
        };
        typedef eosio::multi_index< "claimed"_n, claimed_table > claimed;
        // ------------------------------------
        