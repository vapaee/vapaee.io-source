#include <vapaee/token/tables/_aux.hpp>

        // TABLE ordertables -----------
        // scope: contract
        TABLE ordertables_table {
            name table;
            symbol_code sell;
            symbol_code pay;
            asset total;            // <<--  esto va junto [booksummary]
            vector<asset> fees;     // <<--  esto se va..
            int orders;             // <<--  esto va junto [booksummary]
            int deals;
            int blocks;
            uint64_t primary_key() const { return table.value; }
        };
        typedef eosio::multi_index< "ordertables"_n, ordertables_table > ordertables;
        // ------------------------------------