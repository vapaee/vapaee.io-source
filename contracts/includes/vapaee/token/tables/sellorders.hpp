#include <vapaee/token/tables/_aux.hpp>

        // TABLE sellorders (registered currency) -----------
        // scope: symbol_code_A.symbol_code_P
        TABLE sell_order_table {
            uint64_t id;
            name owner;
            asset price; // symbol_code_P - how much P per A unit
            asset inverse; // symbol_code_A - inverse price 
            asset total; // symbol_code_P - how much P you want
            asset selling; // symbol_code_A - how much A you are selling
            uint64_t primary_key() const { return id; }
            uint64_t by_price_key() const { return price.amount; }
            // uint64_t by_inverse_key() const { return inverse.amount; } 
            uint64_t by_owner_key() const { return owner.value; }
            uint64_t by_total_key() const { return total.amount; }
        };

        typedef eosio::multi_index< "sellorders"_n, sell_order_table,
            indexed_by<"price"_n, const_mem_fun<sell_order_table, uint64_t, &sell_order_table::by_price_key>>
            // ,
            // indexed_by<"inverse"_n, const_mem_fun<sell_order_table, uint64_t, &sell_order_table::by_inverse_key>>
            // indexed_by<"owner"_n, const_mem_fun<sell_order_table, uint64_t, &sell_order_table::by_owner_key>>,
            // indexed_by<"amount"_n, const_mem_fun<sell_order_table, uint64_t, &sell_order_table::by_amount_key>>
        > sellorders;
        // ------------------------------------
        

        // TABLE sellorders -----------
        // scope: market-id
        TABLE sell_order_table2 {
            uint64_t id;
            name owner;
            asset price;     // symbol_code_P - how much P per A unit
            asset inverse;   // symbol_code_A - inverse price 
            asset total;     // symbol_code_P - how much P you want
            asset selling;   // symbol_code_A - how much A you are selling
            uint64_t ui;     // id of the interfaces the owner is using
            uint64_t primary_key() const { return id; }
            uint64_t by_price_key() const { return price.amount; }
            uint64_t by_owner_key() const { return owner.value; }
            uint64_t by_total_key() const { return total.amount; }
        };

        typedef eosio::multi_index< "sellorders2"_n, sell_order_table2,
            indexed_by<"price"_n, const_mem_fun<sell_order_table2, uint64_t, &sell_order_table2::by_price_key>>
        > sellorders2;
        // ------------------------------------
        