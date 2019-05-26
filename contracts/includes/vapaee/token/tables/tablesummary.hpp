#include <vapaee/token/tables/_aux.hpp>

        // TABLE tablesummary -----------
        // scope: xxx.tlos
        TABLE tablesummary_table {
            name label;
            asset price;    // current price for this hour (and last)
            asset entrance; // first price for this hour
            asset max;      // max price for this hour
            asset min;      // min price for this hour            
            asset volume;
            uint64_t hour;
            time_point_sec date;
            // uint64_t history;
            uint64_t primary_key() const { return label.value; }
        };
        typedef eosio::multi_index< "tablesummary"_n, tablesummary_table > tablesummary;
        // ------------------------------------