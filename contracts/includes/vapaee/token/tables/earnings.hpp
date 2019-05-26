#include <vapaee/token/tables/_aux.hpp>

        // TABLE earnings (singleton table) -----------
        // scope: owner (only contract)
        TABLE earnings_table {
            asset quantity;
            uint64_t primary_key() const { return quantity.symbol.code().raw(); }
        };
        typedef eosio::multi_index< "earnings"_n, earnings_table > earnings;
        // ------------------------------------
        