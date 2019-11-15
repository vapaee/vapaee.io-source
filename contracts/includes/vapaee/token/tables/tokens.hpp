#include <vapaee/token/tables/_aux.hpp>

        
        // ------------------------------------
        
        // TABLE tokens (registered currency) -----------
        // scope: contract
        TABLE reg_token_table {
            symbol_code symbol;
            uint8_t precision;
            name contract;
            name owner;
            string title;
            string website;
            string brief;
            string banner;
            string logo;
            string logolg;
            time_point_sec date;
            bool tradeable;
            bool banned;
            bool currency;
            uint32_t data;
            uint64_t primary_key() const { return symbol.raw(); }
            uint64_t by_contract_key() const { return contract.value; }
        };

        typedef eosio::multi_index< "tokens"_n, reg_token_table,
            indexed_by<"contract"_n, const_mem_fun<reg_token_table, uint64_t, &reg_token_table::by_contract_key>>
        > tokens;
        // ------------------------------------
        
        
        // ------------------------------------
        
        // TABLE tokens (registered currency) -----------
        // scope: contract
        TABLE token2_table {
            symbol_code symbol;
            uint64_t group;       // this token may belong to a group of tokens
            uint8_t precision;
            name contract;
            name admin;
            string title;
            string website;
            string brief;
            string banner;
            string icon;
            string iconlg;
            time_point_sec date;
            bool tradeable;
            bool currency;
            uint32_t data;
            uint64_t primary_key() const { return symbol.raw(); }
            uint64_t by_contract_key() const { return contract.value; }
        };

        typedef eosio::multi_index< "tokens2"_n, token2_table,
            indexed_by<"contract"_n, const_mem_fun<token2_table, uint64_t, &token2_table::by_contract_key>>
        > tokens2;
        // ------------------------------------
        