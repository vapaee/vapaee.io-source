#include <vapaee/token/tables/_aux.hpp>

        
        // ------------------------------------
        // TABLE interfaces (registered Telos DEX UI) -----------
        // scope: contract
        TABLE interfaces_table {
            uint64_t id;
            name admin;    // whoever register or manage this UI
            name receiver; // where to send earnings from fees
            string params; // text to add in all transfers' memos (like an internal id when you deposit in an exchange)
            string title;
            string website;
            string brief;
            string banner;    // big wide image
            string thumbnail; // small image
            string state;  // this is for future use. We can ban, suspend, promote, reward, or whatever concept we (as a DAO) want to apply to each ui.
            time_point_sec date;
            uint64_t primary_key() const { return id; }
            uint64_t by_receiver_key() const { return receiver.value; }
        };

        typedef eosio::multi_index< "interfaces"_n, interfaces_table,
            indexed_by<"receiver"_n, const_mem_fun<interfaces_table, uint64_t, &interfaces_table::by_receiver_key>>
        > interfaces;
        // ------------------------------------
        