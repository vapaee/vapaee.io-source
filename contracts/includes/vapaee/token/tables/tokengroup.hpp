#include <vapaee/token/tables/_aux.hpp>

        
        // ------------------------------------
        // TABLE tokengroup
        // scope: contract
        TABLE tokengroup_table {
            uint64_t id;
            name admin;    // whoever register this group
            string title;
            string website;
            string brief;
            string banner;
            string bigbanner;
            symbol_code currency;
            uint64_t primary_key() const { return id; }
        };

        typedef eosio::multi_index< "tokengroup"_n, tokengroup_table> tokengroup;
        // ------------------------------------
        