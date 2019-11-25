#include <vapaee/token/tables/_aux.hpp>

        // TABLE unstakes -----------
        // scope: owner
        TABLE user_unstakes_table {
            uint64_t id;
            asset quantity;
            uint64_t expire;
            uint64_t primary_key() const { return id; }
            uint64_t by_symbol_key() const { return quantity.symbol.code().raw(); }
            uint64_t by_expire_key() const { return expire; }
            uint64_t by_id_key() const { return id; }
        };
        typedef eosio::multi_index< "unstakes"_n, user_unstakes_table,
            indexed_by<"symbol"_n, const_mem_fun<user_unstakes_table, uint64_t, &user_unstakes_table::by_symbol_key>>,
            indexed_by<"expire"_n, const_mem_fun<user_unstakes_table, uint64_t, &user_unstakes_table::by_expire_key>>,
            indexed_by<"id"_n, const_mem_fun<user_unstakes_table, uint64_t, &user_unstakes_table::by_id_key>>
        > unstakes;
        // ------------------------------------
        