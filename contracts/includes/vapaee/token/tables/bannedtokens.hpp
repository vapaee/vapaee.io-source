#include <vapaee/token/tables/_aux.hpp>
        
        // ------------------------------------
        // TABLE bannedtokens 
        // scope: contract
        TABLE bannedtokens_table {
            uint64_t id;
            symbol_code symbol;
            name contract;
            uint64_t primary_key() const { return id; }
            uint64_t by_symbol_key() const { return symbol.raw(); }
        };

        typedef eosio::multi_index< "bannedtokens"_n, bannedtokens_table,
            indexed_by<"symbol"_n, const_mem_fun<bannedtokens_table, uint64_t, &bannedtokens_table::by_symbol_key>>
        > bannedtokens;
        // ------------------------------------
        