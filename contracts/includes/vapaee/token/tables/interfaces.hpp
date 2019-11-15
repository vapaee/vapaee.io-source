#include <vapaee/token/tables/_aux.hpp>

        
        // ------------------------------------
        // TABLE interfaces (registered Telos DEX UI) -----------
        // scope: contract
        TABLE interfaces_table {
            uint64_t id;
            name receiver; // where to send earnings from fees
            name admin;    // whoever register this UI
            string title;
            string website;
            string brief;
            string banner;
            string bigbanner;
            time_point_sec date;
            uint64_t primary_key() const { return id; }
            uint64_t by_receiver_key() const { return receiver.value; }
        };

        typedef eosio::multi_index< "interfaces"_n, interfaces_table,
            indexed_by<"receiver"_n, const_mem_fun<interfaces_table, uint64_t, &interfaces_table::by_receiver_key>>
        > interfaces;
        // ------------------------------------
        