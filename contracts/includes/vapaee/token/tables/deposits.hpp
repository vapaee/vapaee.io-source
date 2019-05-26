#include <vapaee/token/tables/_aux.hpp>

        // TABLE deposits -----------
        // scope: owner
        TABLE deposits_table {
            asset amount;
            uint64_t primary_key() const { return amount.symbol.code().raw(); }
        };
        typedef eosio::multi_index< "deposits"_n, deposits_table > deposits;
        // ------------------------------------
        