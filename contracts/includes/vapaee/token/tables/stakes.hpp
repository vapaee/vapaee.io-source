#include <vapaee/token/tables/_aux.hpp>

        // TABLE stakes -----------
        // scope: owner
        TABLE user_stakes_table {
            uint64_t id;
            name to;
            name concept;
            asset quantity;
            uint64_t since;
            uint64_t last;
            uint64_t lock;
            uint64_t primary_key() const { return id; }
            uint128_t secondary_key() const { return vapaee::utils::combine(by_symbol_key(), by_to_key()); }
            uint64_t by_to_key() const { return to.value; }
            uint64_t by_concept_key() const { return concept.value; }
            uint64_t by_symbol_key() const { return quantity.symbol.code().raw(); }
            uint64_t by_since_key() const { return since; }
            uint64_t by_last_key() const { return last; }
            uint64_t by_lock_key() const { return lock; }
        };
        typedef eosio::multi_index< "stakes"_n, user_stakes_table,
            indexed_by<"secondary"_n, const_mem_fun<user_stakes_table, uint128_t, &user_stakes_table::secondary_key>>,
            indexed_by<"to"_n, const_mem_fun<user_stakes_table, uint64_t, &user_stakes_table::by_to_key>>,
            indexed_by<"symbol"_n, const_mem_fun<user_stakes_table, uint64_t, &user_stakes_table::by_symbol_key>>,
            indexed_by<"concept"_n, const_mem_fun<user_stakes_table, uint64_t, &user_stakes_table::by_concept_key>>,
            indexed_by<"since"_n, const_mem_fun<user_stakes_table, uint64_t, &user_stakes_table::by_since_key>>,
            indexed_by<"last"_n, const_mem_fun<user_stakes_table, uint64_t, &user_stakes_table::by_last_key>>,
            indexed_by<"lock"_n, const_mem_fun<user_stakes_table, uint64_t, &user_stakes_table::by_lock_key>>
        > stakes;
        // ------------------------------------
        