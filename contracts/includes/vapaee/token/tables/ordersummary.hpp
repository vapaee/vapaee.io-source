#include <vapaee/token/tables/_aux.hpp>


        struct booksummary {
            asset total;
            int orders;
            uint64_t ascurrency;
        };

        // TABLE ordersummary -----------
        // scope: contract
        TABLE ordersummary_table {
            uint64_t market;
            symbol_code sell;
            symbol_code pay;
            booksummary supply;
            booksummary demand;
            int deals;
            int blocks;
            uint64_t primary_key() const { return market; }
        };
        typedef eosio::multi_index< "ordersummary"_n, ordersummary_table > ordersummary;
        // ------------------------------------