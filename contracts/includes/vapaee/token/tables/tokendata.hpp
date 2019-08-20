#include <vapaee/token/tables/_aux.hpp>

        // TABLE sellorders (registered currency) -----------
        // scope: symbol_code
        TABLE tokendata_table {
            uint64_t id;
            name category;
            string text;
            string link;
            uint64_t primary_key() const { return id; }
            uint64_t by_category_key() const { return category.value; }
        };

        typedef eosio::multi_index< "tokendata"_n, tokendata_table,
            indexed_by<"category"_n, const_mem_fun<tokendata_table, uint64_t, &tokendata_table::by_category_key>>
        > tokendata;
        // ------------------------------------
        