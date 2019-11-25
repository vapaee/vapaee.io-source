#include <vapaee/token/tables/_aux.hpp>

        // TABLE stats (currency) -----------
        // scope: supply_code
        // STANDARD TABLE - DON'T CHANGE
        TABLE currency_stats {
            eosio::asset           supply;
            eosio::asset           max_supply;
            name                   issuer;
            uint64_t primary_key()const { return supply.symbol.code().raw(); }
        };
        typedef eosio::multi_index< "stat"_n, currency_stats > stats;
        // ------------------------------------
        