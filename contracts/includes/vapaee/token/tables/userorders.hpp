#include <vapaee/token/tables/_aux.hpp>

        // TABLE userorders -----------
        // scope: owner
        TABLE userorders_table {
            name table;
            vector<uint64_t> ids;
            uint64_t primary_key() const { return table.value; }
        };
        typedef eosio::multi_index< "userorders"_n, userorders_table > userorders;
        // ------------------------------------
        

        // TABLE userorders -----------
        // scope: owner
        TABLE userorders2_table {
            uint64_t market;
            string table;
            vector<uint64_t> ids;
            uint64_t primary_key() const { return market; }
        };
        typedef eosio::multi_index< "userorders2"_n, userorders2_table > userorders2;
        // ------------------------------------
        