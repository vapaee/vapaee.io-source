#include <vapaee/token/tables/_aux.hpp>

        // TABLE snapshots -----------
        // auxiliar structure to query the real snapshot table on other contract. Holds an amount of TLOS of each account.
        TABLE snapshot_table {
            name account;
            uint64_t amount;
            uint64_t primary_key() const { return account.value; }
        };
        typedef eosio::multi_index< "snapshots"_n, snapshot_table > snapshots;
        // ------------------------------------
        