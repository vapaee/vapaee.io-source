#pragma once
#include <vapaee/token/common.hpp>
#include <math.h>

using namespace eosio;
namespace vapaee {
    namespace token {

    class airdrop {
        name _self;
    
    public:
        
        airdrop():_self(vapaee::token::contract){}

        inline name get_self()const { return vapaee::token::contract; }  


        void action_setsnapshot(name contract, uint64_t scope, const symbol_code& sym_code, int64_t cap, int64_t min, int64_t ratio, int64_t base, const std::string & memo) {
            PRINT("vapaee::token::airdrop::action_setsnapshot()\n");
            PRINT(" contract: ", contract.to_string(), "\n");
            PRINT(" scope: ", std::to_string((int) scope), "\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");
            PRINT(" cap: ", std::to_string((int) cap), "\n");
            PRINT(" min: ", std::to_string((int) min), "\n");
            PRINT(" ratio: ", std::to_string((int) ratio), "\n");
            PRINT(" base: ", std::to_string((int) base), "\n");
            PRINT(" memo: ", memo.c_str(), "\n");

            // check token existance
            stats statstable( _self, sym_code.raw() );
            auto existing = statstable.find( sym_code.raw() );
            eosio_assert( existing != statstable.end(), "token with symbol does not exist, create token before issue" );
            const auto& st = *existing;
            require_auth( st.issuer );

            source table( _self, sym_code.raw() );
            auto it = table.begin();
            eosio_assert(it == table.end(), "source table is not empty");

            table.emplace( st.issuer, [&]( auto& a ){
                a.contract = contract;
                a.scope = scope;
                a.min = min;
                a.cap = cap;
                a.ratio = ratio;
                a.base = base;
                a.memo = memo;
            });
            PRINT("vapaee::token::airdrop::action_setsnapshot() ...\n");
        }

        /*void action_nosnapshot(const symbol_code& sym_code) {
            PRINT("vapaee::token::airdrop::action_nosnapshot()\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");

            require_auth( _self );
            source table( _self, sym_code.raw() );
            auto it = table.begin();
            eosio_assert(it != table.end(), "source table is empty");

            table.erase(it);
            PRINT("vapaee::token::airdrop::action_nosnapshot() ...\n");
        }*/

        void action_claim(name owner, const symbol_code& sym_code, name ram_payer) {
            PRINT("vapaee::token::airdrop::action_claim()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");
            PRINT(" ram_payer: ", ram_payer.to_string(), "\n");

            require_auth( ram_payer );
            auto sym_code_raw = sym_code.raw();
        
            // check symbol exists
            stats statstable( _self, sym_code_raw );
            const auto& st = statstable.get( sym_code_raw, "symbol does not exist" );
            eosio::symbol symbol = st.supply.symbol;
            
            // get airdrop amount
            source table( _self, sym_code_raw );
            auto srcit = table.begin();
            eosio_assert(srcit != table.end(), "SOURCE table is EMPTY. execute action setsnapshot before.");

            snapshots snaptable( srcit->contract, srcit->scope );
            auto snapit = snaptable.find(owner.value);
            eosio_assert(snapit != snaptable.end(), "SNAPSHOTS table does not have an entry for owner");
            int64_t amount = snapit->amount;
            int64_t cap = srcit->cap;
            int64_t min = srcit->min;
            int64_t ratio = srcit->ratio;
            int64_t base = srcit->base;
            string message = srcit->memo;
            
            // filter
            if (cap > 0) if (amount > cap) {
                amount = cap;
            }    
            eosio_assert(amount >= min, (owner.to_string() + " account does NOT reach the minimun amount of " + asset(min, symbol).to_string()).c_str());
            
            // apply ratio
            uint64_t unit = pow(10.0, symbol.precision());
            if (ratio != unit) {
                if (ratio == 0) {
                    amount = 0;
                } else {
                    amount = (int64_t)(int128_t(amount) * ratio / unit);
                }
            }

            // add base amount
            amount += base;

            // check if already claimed
            claimed claimedtable( _self, owner.value );
            auto it = claimedtable.find( sym_code_raw );
            eosio_assert(it == claimedtable.end(), "You already claimed this token airdrop");

            // set calimed as true
            claimedtable.emplace(ram_payer, [&]( auto& a ){
                a.sym_code = sym_code;
            });

            // perform the airdrop
            asset quantity = asset{(int64_t)amount, symbol};

            action(
                permission_level{ram_payer,"active"_n},
                get_self(),
                "open"_n,
                std::make_tuple(owner, symbol, ram_payer)
            ).send();
        
            action(
                permission_level{st.issuer,"active"_n},
                get_self(),
                "issue"_n,
                std::make_tuple(owner, quantity, message)
            ).send();
            
            PRINT("vapaee::token::airdrop::action_claim() ...\n");
        }
        
    }; // class

}; // namespace

}; // namespace