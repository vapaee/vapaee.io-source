#include <vapaee/token/tables/_aux.hpp>

        
        // ------------------------------------
        // TABLE markets
        // scope: contract
        TABLE markets_table {
            uint64_t id;
            name name;     // xxx.zzz (do not asume it is unique)
            symbol_code commodity;
            symbol_code currency;
            uint64_t primary_key() const { return id; }
            uint64_t by_name_key() const { return name.value; }
        };

        typedef eosio::multi_index< "markets"_n, markets_table,
            indexed_by<"name"_n, const_mem_fun<markets_table, uint64_t, &markets_table::by_name_key>>
        > markets;
        // ------------------------------------
        