#pragma once
#include <vapaee/token/common.hpp>


using namespace eosio;
namespace vapaee {
    namespace token {

    class stake {
        name _self;
    
    public:
        
        stake():_self(vapaee::token::contract){}

        inline name get_self()const { return vapaee::token::contract; }

        void action_stake (name owner, const asset & quantity, name to, name concept) {
            PRINT("vapaee::token::stake::action_stake()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" quantity: ", quantity.to_string(), "\n");
            PRINT(" to: ", to.to_string(), "\n");
            PRINT(" concept: ", concept.to_string(), "\n");
            PRINT(" current_time(): ", std::to_string((unsigned long long) current_time() ), "\n");

            require_auth(owner);
            eosio_assert( is_account( to ), "to account does not exist");

            // entry on stakes table
            uint64_t id = aux_create_stake_entry(owner, quantity, to, concept);            

            tokens tokens_table(get_self(), get_self().value);
            auto tkn = tokens_table.find(quantity.symbol.code().raw());
            eosio_assert(tkn != tokens_table.end(), "token not registered");            

            // transfer that quantity to _self
            action(
                permission_level{owner,"active"_n},
                tkn->contract,
                "transfer"_n,
                std::make_tuple(owner, get_self(), quantity, std::to_string((unsigned long long)id) + " - staking " + quantity.to_string() + " to " + to.to_string())
            ).send();

            PRINT("vapaee::token::stake::action_stake() ...\n");
        }

        void action_unstake (name owner, const asset & quantity, name from, name concept) {
            PRINT("vapaee::token::stake::action_unstake()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" quantity: ", quantity.to_string(), "\n");
            PRINT(" from: ", from.to_string(), "\n");
            PRINT(" concept: ", concept.to_string(), "\n");
            PRINT(" current_time(): ", std::to_string((unsigned long long) current_time() ), "\n");

            require_auth(owner);

            // entry on stakes table
            stakes stakes_table( get_self(), owner.value );
            auto stakes_index = stakes_table.template get_index<"secondary"_n>();
            auto stakes_itr = stakes_index.find(vapaee::utils::combine(quantity.symbol.code().raw(), from.value));

            // we verify that there is a stake in the name of "from"
            bool found = false;
            for (; stakes_itr != stakes_index.end(); stakes_itr++) {
                if (stakes_itr->to != from) break;
                if (stakes_itr->quantity.symbol != quantity.symbol) break;
                if (stakes_itr->concept == concept) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                string error1 = string("owner '") + owner.to_string() +
                    "' does not have " +quantity.symbol.code().to_string() +
                    " tokens staked for '" + from.to_string() +
                    "' in concept of " + concept.to_string();
                eosio_assert(false, error1.c_str() );
            }


            // We verify that this stake has the same or more funds that are requested to unstake
            if (stakes_itr->quantity.amount < quantity.amount) {
                string error2 = string("owner '") + owner.to_string() + 
                    "' has not enough " + quantity.symbol.code().to_string() + " tokens staked for '" + from.to_string() + "'";
                eosio_assert(false, error2.c_str() );
            }

            // we calculate de expire time
            uint64_t expires = aux_calculate_expire_time(owner, quantity, stakes_itr->quantity.amount);

            unstakes unstakes_table( get_self(), owner.value );
            uint64_t id = unstakes_table.available_primary_key();
            uint64_t transaction_id = owner.value + id;
            PRINT(" unstakes.emplace() ", std::to_string((unsigned long long) id), " - ", quantity.to_string(),"\n");
            unstakes_table.emplace( owner, [&]( auto& a ){
                a.id = id;
                a.quantity = quantity;
                a.expire = current_time() + expires;
            });

            transaction out{};
            out.actions.emplace_back(
                permission_level{get_self(), "active"_n},
                get_self(),
                "unstakeback"_n,
                std::make_tuple(owner)
            );
            out.delay_sec = (uint64_t) (expires / 1000000);
            PRINT(" transaction (", std::to_string((unsigned long long) transaction_id), ") --> ", std::to_string((unsigned long long) expires),"\n");
            out.send(transaction_id, get_self());

            // if it has the same amount, you have to delete the entry from the table
            if (stakes_itr->quantity.amount == quantity.amount) {
                PRINT(" stakes.erase() ", std::to_string((unsigned long long) stakes_itr->id), " - ", quantity.to_string(),"\n");
                stakes_table.erase( *stakes_itr );
                
            } else {
                // If it have less quantity, we have to subtract it from the existing entry
                PRINT(" stakes.modify() ", std::to_string((unsigned long long) stakes_itr->id), " - ", quantity.to_string(),"\n");
                stakes_table.modify( *stakes_itr, same_payer, [&]( auto& a ) {
                    eosio_assert(a.quantity.amount > quantity.amount, "a.quantity.amount < quantity.amount");
                    a.quantity.amount -= quantity.amount;
                    a.last = current_time();
                });
            }            

            PRINT("vapaee::token::stake::action_unstake() ...\n");
        }

        void action_restake (name owner, uint64_t unstake_id, name to, name concept) {
            PRINT("vapaee::token::stake::action_restake()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" unstake_id: ", std::to_string((unsigned long long) unstake_id), "\n");
            PRINT(" to: ", to.to_string(), "\n");
            PRINT(" concept: ", concept.to_string(), "\n");
            PRINT(" current_time(): ", std::to_string((unsigned long long) current_time() ), "\n");

            require_auth(owner);
            eosio_assert( is_account( to ), "to account does not exist");

            // remove the unstake entry
            unstakes unstakes_table( get_self(), owner.value );
            auto unstake_itr = unstakes_table.find(unstake_id);
            eosio_assert(unstake_itr != unstakes_table.end(), "unstake_id does not represent a valid unstakes entry");
            asset quantity = unstake_itr->quantity;
            unstakes_table.erase(unstake_itr);

            // entry on stakes table
            uint64_t id = aux_create_stake_entry(owner, quantity, to, concept);

            PRINT("vapaee::token::stake::action_restake() ...\n");
        }

        void action_unstakeback (name owner) {
            PRINT("vapaee::token::stake::action_unstakeback()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" current_time(): ", std::to_string((unsigned long long) current_time() ), "\n");
            tokens tokens_table(get_self(), get_self().value);
            unstakes table( get_self(), owner.value );
            auto index = table.template get_index<"expire"_n>();
            uint64_t now = current_time();

            int counter = 5;
            for (auto itr = index.begin(); itr != index.end(); itr = index.begin()) {
                if (counter-- == 0) {
                    PRINT(" no more than 5 unstakes per action");
                    break;
                }

                if (itr->expire <= now) {
                    PRINT(" unstake: ", std::to_string((unsigned long long)itr->id), " - ", itr->quantity.to_string(), " - ", std::to_string((unsigned long long)itr->expire) ,"\n");
                    asset quantity = itr->quantity;
                    table.erase(*itr);

                    auto tkn = tokens_table.find(quantity.symbol.code().raw());
                    eosio_assert(tkn != tokens_table.end(), "token not registered");

                    // return fouds to the owner
                    action(
                        permission_level{get_self(),"active"_n},
                        tkn->contract,
                        "transfer"_n,
                        std::make_tuple(get_self(), owner, quantity, string("unstaking ") + quantity.to_string())
                    ).send();
                }
            }            
            
            PRINT("vapaee::token::stake::action_unstakeback() ...\n");
        }

        void action_unstaketime (name owner, const symbol_code & sym_code, uint64_t min_time, uint64_t max_time, uint64_t auto_stake) {
            PRINT("vapaee::token::stake::action_unstaketime()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");
            PRINT(" min_time: ", std::to_string((unsigned long long) min_time), "\n");
            PRINT(" max_time: ", std::to_string((unsigned long long) max_time), "\n");
            PRINT(" auto_stake: ", std::to_string((unsigned long long) auto_stake), "\n");

            eosio_assert(max_time >= min_time, "max_time MUST be grather or equals to min_time");
            require_auth(owner);

            config table( get_self(), owner.value );
            auto itr = table.find( sym_code.raw() );
            if( itr == table.end() ) {
                table.emplace( owner, [&]( auto& a ){
                    a.sym_code = sym_code;
                    a.min_time = min_time;
                    a.max_time = max_time;
                    a.auto_stake = auto_stake;
                });
            } else {
                table.modify( *itr, same_payer, [&]( auto& a ) {
                    a.min_time = min_time;
                    a.max_time = max_time;
                    a.auto_stake = auto_stake;
                });
            }
            PRINT("vapaee::token::stake::action_unstaketime() ...\n");
        }

        uint64_t aux_create_stake_entry(name owner, const asset & quantity, name to, name concept) {
            PRINT("vapaee::token::stake::aux_create_stake_entry()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" quantity: ", quantity.to_string(), "\n");
            PRINT(" to: ", to.to_string(), "\n");
            PRINT(" concept: ", concept.to_string(), "\n");

            stakes stakes_table( get_self(), owner.value );
            auto stakes_index = stakes_table.template get_index<"secondary"_n>();
            auto stakes_itr = stakes_index.find(vapaee::utils::combine(quantity.symbol.code().raw(), to.value));
            uint64_t id = stakes_table.available_primary_key();
            bool create = false;
            if (stakes_itr == stakes_index.end()) {
                create = true;
            } else {
                create = true;
                for ( ; stakes_itr != stakes_index.end(); stakes_itr++ ) {
                    if (stakes_itr->to != to) break;
                    if (stakes_itr->quantity.symbol != quantity.symbol) break;
                    if (stakes_itr->concept == concept) {
                        create = false;
                        stakes_table.modify( *stakes_itr, same_payer, [&]( auto& a ) {
                            a.quantity.amount += quantity.amount;
                            a.last = current_time();
                            id = a.id;
                        });
                    }
                }
            }

            if (create) {
                stakes_table.emplace( owner, [&]( auto& a ){
                    a.id = id;
                    a.to = to;
                    a.concept = concept;
                    a.quantity = quantity;
                    a.since = current_time();
                    a.last = a.since;
                });
            }

            PRINT("vapaee::token::stake::aux_create_stake_entry() ...\n");
            return id;            
        }

        uint64_t aux_calculate_expire_time(name owner, const asset & quantity, uint64_t total) {
            config table( get_self(), owner.value );
            auto itr = table.find( quantity.symbol.code().raw() );
            // default unstake time 3 days
            uint64_t expires = (uint64_t) 3 * (uint64_t) 24 * (uint64_t) 60 * (uint64_t) 60 * (uint64_t) 1000000;
            expires = 60000000; // temporalmente para debuguear
            if( itr != table.end() ) {
                if (total == quantity.amount) {
                    expires = itr->max_time;
                } else {
                    double percent = (double) quantity.amount / (double) total;
                    expires = (uint64_t) (percent * itr->max_time);
                    PRINT(" percent ", std::to_string(percent), " expires:", std::to_string((unsigned long long) expires),"\n");
                    if (expires < itr->min_time) {
                        expires = itr->min_time;
                    }
                }
            }
            return expires;
        }

               
        
    }; // class

}; // namespace

}; // namespace