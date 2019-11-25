#include <vapaee/token/tables/_aux.hpp>

        // TABLE source (airdrop snapshot source) -----------
        // scope: supply_code
        // this will have only 1 row setted by calling action setsnapshot
        TABLE spanshot_source {
            name contract;
            uint64_t scope;
            int64_t cap;
            int64_t min;
            int64_t ratio;
            int64_t base;
            string memo;
            uint64_t primary_key() const { return contract.value; }
            uint64_t by_scope_key() const { return scope; }
        };
        typedef eosio::multi_index< "source"_n, spanshot_source,
            indexed_by<"scope"_n, const_mem_fun<spanshot_source, uint64_t, &spanshot_source::by_scope_key>>
        > source;
        // ------------------------------------
        