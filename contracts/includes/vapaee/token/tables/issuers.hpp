#include <vapaee/token/tables/_aux.hpp>

        // TABLE issuers (currency) -----------
        // scope: supply_code
        // STANDARD TABLE - DON'T CHANGE
        TABLE currency_issuers {
            name issuer;
            uint64_t primary_key() const { return issuer.value; }
        };
        typedef eosio::multi_index< "issuers"_n, currency_issuers > issuers;
        // ------------------------------------
        