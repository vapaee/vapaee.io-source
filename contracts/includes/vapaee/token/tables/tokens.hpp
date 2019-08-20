#include <vapaee/token/tables/_aux.hpp>

        // TABLE oldtokens (registered currency) -----------
        // scope: contract
        /*
        TABLE oldreg_token_table {
            symbol_code symbol;
            uint8_t precision;
            name contract;
            string appname;
            string website;
            string logo;
            string logolg;
            bool tradeable;
            uint64_t primary_key() const { return symbol.raw(); }
            uint64_t by_contract_key() const { return contract.value; }
        };

        typedef eosio::multi_index< "oldtokens"_n, oldreg_token_table,
            indexed_by<"contract"_n, const_mem_fun<oldreg_token_table, uint64_t, &oldreg_token_table::by_contract_key>>
        > oldtokens;
        */
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
            uint32_t data;
            uint64_t primary_key() const { return symbol.raw(); }
            uint64_t by_contract_key() const { return contract.value; }
        };

        typedef eosio::multi_index< "tokens"_n, reg_token_table,
            indexed_by<"contract"_n, const_mem_fun<reg_token_table, uint64_t, &reg_token_table::by_contract_key>>
        > tokens;
        // ------------------------------------
        