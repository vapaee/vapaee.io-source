#include <vapaee/token/tables/_aux.hpp>


        // TABLE tokenevents -----------
        // scope: token_symbol
        TABLE tokenevents_table {
            name event;
            name receptor;
            uint64_t primary_key() const { return event.value; }
        };
        typedef eosio::multi_index< "tokenevents"_n, tokenevents_table > tokenevents;
        // ------------------------------------

