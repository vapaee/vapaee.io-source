#include <vapaee/token/tables/_aux.hpp>

        // TABLE accounts (balances) -----------
        // scope: user
        TABLE account {
            eosio::asset balance;
            uint64_t primary_key()const { return balance.symbol.code().raw(); }
        };
        typedef eosio::multi_index< "accounts"_n, account > accounts;
        // ------------------------------------