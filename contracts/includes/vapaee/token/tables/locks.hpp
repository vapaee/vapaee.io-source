#include <vapaee/token/tables/_aux.hpp>

        // TABLE locks -----------
        // scope: contract
        TABLE locks_table {
            uint64_t id;
            name owner;
            asset amount;
            uint64_t expire;
            name concept;
            uint64_t foreign;
            uint64_t scope;
            uint64_t primary_key() const { return id; }
            uint64_t by_expire_key() const { return expire; }
            uint64_t by_symbol_key() const { return amount.symbol.code().raw(); }
            uint64_t by_owner_key() const { return owner.value; }
            uint128_t by_reference_key() const { return vapaee::utils::combine(scope, foreign); }
        };
        typedef eosio::multi_index< "locks"_n, locks_table,
            indexed_by<"expire"_n, const_mem_fun<locks_table, uint64_t, &locks_table::by_expire_key>>,
            indexed_by<"symbol"_n, const_mem_fun<locks_table, uint64_t, &locks_table::by_symbol_key>>,
            indexed_by<"owner"_n, const_mem_fun<locks_table, uint64_t, &locks_table::by_owner_key>>,
            indexed_by<"reference"_n, const_mem_fun<locks_table, uint128_t, &locks_table::by_reference_key>>
        > locks;
        // ------------------------------------
        