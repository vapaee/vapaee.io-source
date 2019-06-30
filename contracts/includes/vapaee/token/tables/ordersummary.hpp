#include <vapaee/token/tables/_aux.hpp>


        struct booksummary {
            asset total;
            int orders;
        }

        // TABLE ordersummary -----------
        // scope: contract
        TABLE ordersummary_table {
            name table;
            symbol_code sell;
            symbol_code pay;
            booksummary offer;
            booksummary demand;
            int deals;
            int blocks;
            uint64_t primary_key() const { return table.value; }
        };
        typedef eosio::multi_index< "ordersummary"_n, ordersummary_table > ordersummary;
        // ------------------------------------



        