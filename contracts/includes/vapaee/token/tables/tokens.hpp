#include <vapaee/token/tables/_aux.hpp>

        // TABLE tokens (registered currency) -----------
        // scope: contract
        TABLE reg_token_table {
            symbol_code symbol;
            uint8_t precision;
            name contract;
            string appname;
            string website;
            string logo;
            string logolg;
            bool verified;
            uint64_t primary_key() const { return symbol.raw(); }
            uint64_t by_contract_key() const { return contract.value; }
        };



        typedef eosio::multi_index< "tokens"_n, reg_token_table,
            indexed_by<"contract"_n, const_mem_fun<reg_token_table, uint64_t, &reg_token_table::by_contract_key>>
        > tokens;
        // ------------------------------------
        
        // TABLE tokennnns (registered currency) -----------
        // scope: contract
        TABLE reg_tokennnn_table {
            symbol_code symbol;
            uint8_t precision;
            name contract;
            string title;
            string website;
            string brief;
            string banner;
            string logo;
            string logolg;
            time_point_sec date;
            bool verified;
            uint64_t primary_key() const { return symbol.raw(); }
            uint64_t by_contract_key() const { return contract.value; }
        };

        typedef eosio::multi_index< "tokennnns"_n, reg_tokennnn_table,
            indexed_by<"contract"_n, const_mem_fun<reg_tokennnn_table, uint64_t, &reg_tokennnn_table::by_contract_key>>
        > tokennnns;
        // ------------------------------------
        