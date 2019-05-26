#include <vapaee/token/tables/_aux.hpp>

        // TABLE blockhistory -----------
        // scope: xxx.tlos
        TABLE blockhistory_table {
            uint64_t id;
            uint64_t hour;
            asset price;    // current price for this hour (and last)
            asset entrance; // first price for this hour
            asset max;      // max price for this hour
            asset min;      // min price for this hour            
            asset volume;
            time_point_sec date;
            uint64_t primary_key() const { return id; }
            uint64_t by_hour_key() const { return hour; }
        };
        typedef eosio::multi_index< "blockhistory"_n, blockhistory_table,
            indexed_by<"hour"_n, const_mem_fun<blockhistory_table, uint64_t, &blockhistory_table::by_hour_key>>
        > blockhistory;
        // ------------------------------------