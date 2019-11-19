#pragma once
#include <vapaee/token/common.hpp>

#include <ctype.h>
#include <stdlib.h>


#include <vapaee/token/tables/accounts.hpp>
#include <vapaee/token/tables/ordersummary.hpp>

using namespace eosio;
namespace vapaee {
    namespace token {

    class exchange {
        name _self;
        name _code;
        asset _asset;
        uint8_t internal_precision;
    
    public:
        
        exchange():_self(vapaee::token::contract),_code(vapaee::token::contract),_asset(asset(0, symbol(symbol_code("AUX"), 0))),internal_precision(8){}
        exchange(name code):_self(vapaee::token::contract),_code(code),_asset(asset(0, symbol(symbol_code("AUX"), 0))),internal_precision(8){}

        inline name get_self() const { return _self; }
        inline name get_code() const { return _code; }


        string create_error_id1(const char * text, const uint64_t id) {
            string result = string(text) + " [" + std::to_string((unsigned long) id ) + "]";
            return result;
        }

        string create_error_symcode1(const char * text, const symbol_code & sym1) {
            string result = string(text) + " [" + sym1.to_string() + "]";
            return result;
        }

        string create_error_symcode2(const char * text, const symbol_code & sym1, const symbol_code & sym2) {
            string result = string(text) + " [" + sym1.to_string() + "], [" + sym2.to_string()+"]";
            return result;
        }


        string create_error_symbol1(const char * text, const symbol & sym1) {
            string result = string(text) + " [" + sym1.code().to_string() + "]";
            return result;
        }

        string create_error_symbol2(const char * text, const symbol & sym1, const symbol & sym2) {
            string result = string(text) + " [" + sym1.code().to_string() + "], [" + sym2.code().to_string()+"]";
            return result;
        }

        string create_error_asset1(const char * text, const asset & token1) {
            string result = string(text) + " [" + token1.to_string() + "]";
            return result;
        }

        string create_error_asset2(const char * text, const asset & token1, const asset & token) {
            string result = string(text) + " [" + token1.to_string() + "], [" + token.to_string()+"]";
            return result;
        }

        string create_error_asset3(const char * text, const asset & token1, const asset & token, const asset & token3) {
            string result = string(text) + " [" + token1.to_string() + "], [" + token.to_string()+"], [" + token3.to_string()+"]";
            return result;
        }

        string create_error_asset4(const char * text, const asset & token1, const asset & token, const asset & token3, const asset & token4) {
            string result = string(text) + " [" + token1.to_string() + "], [" + token.to_string()+"], [" + token3.to_string()+"], [" + token4.to_string()+"]";
            return result;
        }

        string create_error_asset5(const char * text, const asset & token1, const asset & token, const asset & token3, const asset & token4, const asset & token5) {
            string result = string(text) + " [" + token1.to_string() + "], [" + token.to_string()+"], [" + token3.to_string()+"], [" + token4.to_string()+"], [" + token5.to_string()+"]";
            return result;
        }        

        string aux_to_lowercase(string str) {
            string result = str;
            for (int i=0; i<str.length(); i++) {
                result[i] = tolower(str[i]);
            }
            return result;
        }

        name aux_get_modify_payer(name owner) {
            return (has_auth(owner)) ? owner : same_payer; 
        }

        name aux_get_scope_for_tokens(const symbol_code & a, const symbol_code & b) {
            string a_sym_str = a.to_string();
            string b_sym_str = b.to_string();
            string scope_str = a_sym_str + "." + b_sym_str;
            scope_str = aux_to_lowercase(scope_str); 
            if (scope_str.size() > 12) {
                scope_str = scope_str.substr(0,12);
            }
            name scope(scope_str);
            return scope;
        }
        
        asset aux_extend_asset(const asset & quantity) {
            asset extended = quantity;
            uint64_t amount = quantity.amount;
            uint8_t precision = quantity.symbol.precision();
            symbol_code sym_code = quantity.symbol.code();
            
            // no extension
            if (internal_precision <= precision) return quantity;

            // extension
            uint8_t extension = internal_precision - precision;
            uint64_t multiplier = pow(10, extension);
            amount = amount * multiplier;

            extended.amount = amount;
            extended.symbol = symbol(sym_code, internal_precision);
            return extended;
        }
        
        asset aux_get_real_asset(const asset & quantity) {
            asset real = quantity;
            uint64_t amount = quantity.amount;
            uint8_t precision = quantity.symbol.precision();
            symbol_code sym_code = quantity.symbol.code();         

            tokens tokenstable(get_self(), get_self().value);
            auto tk_itr = tokenstable.find(quantity.symbol.code().raw());
            precision = tk_itr->precision;

            // no extension
            if (internal_precision <= precision) return quantity;

            // extension
            uint8_t extension = internal_precision - precision;
            uint64_t divider = pow(10, extension);
            amount = (uint64_t) ((double)amount / (double)divider);

            real.amount = amount;
            real.symbol = symbol(sym_code, precision);
            return real;
        }

        void aux_substract_deposits(name owner, const asset & amount, name ram_payer) {
            PRINT("vapaee::token::exchange::aux_substract_deposits()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" amount: ", amount.to_string(), "\n");

            deposits depositstable(get_self(), owner.value);
            auto itr = depositstable.find(amount.symbol.code().raw());
            eosio_assert(itr != depositstable.end(),
                        create_error_asset1(ERROR_ASD_1, amount).c_str());

            eosio_assert(itr->amount.symbol == amount.symbol,
                create_error_asset2(ERROR_ASD_2, itr->amount, amount).c_str());
            if (itr->amount == amount) {
                PRINT("  itr->amount == amount: ",  amount.to_string(), "\n");
                depositstable.erase(itr);
            } else {
                PRINT("  itr->amount > amount: ", itr->amount.to_string(), " > ", amount.to_string(),  "\n");
                eosio_assert(itr->amount > amount,
                        create_error_asset2(ERROR_ASD_3, amount, itr->amount).c_str());
                
                depositstable.modify(*itr, same_payer, [&](auto& a){
                    a.amount -= amount;
                });
            }
            PRINT("vapaee::token::exchange::aux_substract_deposits() ...\n");
        }

        void aux_add_deposits(name owner, const asset & amount, name ram_payer) {
            PRINT("vapaee::token::exchange::aux_add_deposits()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" amount: ", amount.to_string(), "\n");
            PRINT(" ram_payer: ", ram_payer.to_string(), "\n");

            if (has_auth(owner)) {
                PRINT(" -> owner has auth : ", owner.to_string(), "\n");
            }
            if (has_auth(get_self())) {
                PRINT(" -> owner has auth : ", owner.to_string(), "\n");
            }

            tokens tokenstable(get_self(), get_self().value);
            auto tk_itr = tokenstable.find(amount.symbol.code().raw());
            eosio_assert(tk_itr != tokenstable.end(), "The token is not registered");
            eosio_assert(tk_itr->tradeable, "The token is not setted as tradeable. Contact the token's responsible admin.");

            depusers depuserstable(get_self(), get_self().value);
            auto user_itr = depuserstable.find(owner.value);
            if (user_itr == depuserstable.end()) {
                PRINT(" -> depuserstable.emplace() : \n");
                // eosio_assert(has_auth(ram_payer), "ERROR: attempt to allocate RAM without authorization for depusers table");
                depuserstable.emplace( ram_payer, [&]( auto& a ){
                    a.account = owner;
                });
            } else {
                if (ram_payer != get_self()) {
                    // change from using contract RAM to user's RAM 
                    PRINT(" -> depuserstable.modify() : \n");
                    depuserstable.modify(*user_itr, same_payer, [&]( auto& a ){
                        a.account = owner;
                    });
                }
            }

            deposits depositstable(get_self(), owner.value);
            auto itr = depositstable.find(amount.symbol.code().raw());
            if (itr == depositstable.end()) {
                
                // eosio_assert(has_auth(ram_payer), "ERROR: attempt to allocate RAM without authorization for deposits table");
                depositstable.emplace( ram_payer, [&]( auto& a ){
                    a.amount = amount;
                });
            } else {
                depositstable.modify(*itr, same_payer , [&](auto& a){
                    eosio_assert(a.amount.symbol == amount.symbol,
                        create_error_asset2(ERROR_AAD_1, a.amount, amount).c_str()); 
                    a.amount += amount;
                });
            }

            PRINT("vapaee::token::exchange::aux_add_deposits() ...\n");
        }

        void aux_put_deposits_on_user_ram(name owner, const asset & amount) {
            PRINT("vapaee::token::exchange::aux_put_deposits_on_user_ram()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" amount: ", amount.to_string(), "\n");

            if (!has_auth(owner)) {
                PRINT(" user has no auth -> quitting\n");
                PRINT("vapaee::token::exchange::aux_put_deposits_on_user_ram()...\n");
                return;
            }

            depusers depuserstable(get_self(), get_self().value);
            auto user_itr = depuserstable.find(owner.value);
            if (user_itr != depuserstable.end()) {
                // change from using contract RAM to user's RAM 
                PRINT(" -> depuserstable.modify() : \n");
                depuserstable.modify(*user_itr, owner, [&]( auto& a ){
                    a.account = a.account; // dummie operation
                });
            }

            deposits depositstable(get_self(), owner.value);
            auto itr = depositstable.find(amount.symbol.code().raw());
            if (itr != depositstable.end()) {
                depositstable.modify(*itr, owner , [&](auto& a){
                    a.amount = a.amount; // dummie operation
                });
            }

            PRINT("vapaee::token::exchange::aux_put_deposits_on_user_ram() ...\n");
        }        

        void aux_add_earnings(const asset & quantity) {
            PRINT("vapaee::token::exchange::aux_add_earnings()\n");
            PRINT(" quantity: ", quantity.to_string(), "\n");

            earnings earningstable(get_self(), get_self().value);
            auto itr = earningstable.find(quantity.symbol.code().raw());
            if (itr == earningstable.end()) {
                earningstable.emplace( get_self(), [&]( auto& a ){
                    a.quantity = quantity;
                });
            } else {
                earningstable.modify(*itr, get_self(), [&](auto& a){
                    a.quantity += quantity;
                });
            }
            PRINT("vapaee::token::exchange::aux_add_earnings() ...\n");
        }        

        asset aux_which_one_is_tlos(const asset & amount_a, const asset & amount_b) {
            asset tlos;
            if (amount_a.symbol.code().to_string() == string("TLOS")) {
                tlos = amount_a;
            }
            if (amount_b.symbol.code().to_string() == string("TLOS")) {
                tlos = amount_b;
            }
            return tlos;
        }

        void aux_clone_user_deposits(name owner, vector<asset> & depos) {
            PRINT("vapaee::token::exchange::aux_clone_user_deposits()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            
            deposits depositstable(get_self(), owner.value);
            for (auto itr = depositstable.begin(); itr != depositstable.end(); itr++) {
                PRINT(" - deposit: ", itr->amount.to_string(), "\n");
                depos.push_back(itr->amount);            
            }

            PRINT(" deposits.size(): ", depos.size(), "\n");
            PRINT("vapaee::token::exchange::aux_clone_user_deposits() ...\n");
        }

        void aux_earn_micro_change(name owner, symbol orig, symbol extended, name ram_payer) {
            PRINT("vapaee::token::exchange::aux_earn_micro_change()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" orig: ", orig.code().to_string(), "\n");
            PRINT(" extended: ", extended.code().to_string(), "\n");
            PRINT(" ram_payer: ", ram_payer.to_string(), "\n");

            deposits depositstable(get_self(), owner.value);
            auto itr = depositstable.find(extended.code().raw());
            
            if (itr == depositstable.end()) return;
            // eosio_assert(itr != depositstable.end(),
            //             create_error_symbol1(ERROR_AEMC_1, extended).c_str());
            
            eosio_assert(orig.code().raw() == extended.code().raw(),
                        create_error_symbol2(ERROR_AEMC_2, orig, extended).c_str());

            asset lowest_real_value = asset(1, orig);
            asset lowest_extended_value = aux_extend_asset(lowest_real_value);
            PRINT("   lowest_real_value: ", lowest_real_value.to_string(), "\n");
            PRINT("   lowest_extended_value: ", lowest_extended_value.to_string(), "\n");
            PRINT("   itr->amount: ", itr->amount.to_string(), "\n");
            if (itr->amount < lowest_extended_value) {
                // transfer to contract fees on CNT
                action(
                    permission_level{get_self(),name("active")},
                    get_self(),
                    name("swapdeposit"),
                    std::make_tuple(owner, get_self(), itr->amount, true, string(" withdraw micro-change fees: ") + itr->amount.to_string())
                ).send();

                PRINT("     -- withdraw micro-change fees: ",  itr->amount.to_string(), " from ", owner.to_string(),"\n");
                // convert deposits to earnings
                action(
                    permission_level{get_self(),name("active")},
                    get_self(),
                    name("deps2earn"),
                    std::make_tuple(itr->amount)
                ).send();
                PRINT("     -- converting micro-chang fees ", itr->amount.to_string(), " to earnings\n");
            }

            PRINT("vapaee::token::exchange::aux_earn_micro_change() ...\n");
        }

        void aux_convert_deposits_to_earnings(asset quantity) {
            PRINT("vapaee::token::exchange::aux_convert_deposits_to_earnings()\n");
            PRINT(" quantity: ", quantity.to_string(), "\n");

            aux_substract_deposits(get_self(), quantity, get_self());
            aux_add_earnings(quantity);

            PRINT("vapaee::token::exchange::aux_convert_deposits_to_earnings() ...\n");
        }

        name aux_get_canonical_scope_for_symbols(const symbol_code & A, const symbol_code & B) {
            PRINT("vapaee::token::exchange::aux_get_canonical_scope_for_symbols()\n");
            PRINT(" A: ", A.to_string(), "\n");
            PRINT(" B: ", B.to_string(), "\n");
            name scope;

            // if TLOS is one of them is the base token
            if (B.to_string() == string("TLOS")) {
                scope = aux_get_scope_for_tokens(A, B);
            } else if (A.to_string() == string("TLOS")) {
                scope = aux_get_scope_for_tokens(B, A);
            } else {
                // if TLOS is NOT one of them, then alfabetic resolution
                if (A.to_string() < B.to_string()) {
                    scope = aux_get_scope_for_tokens(A, B);
                } else {
                    scope = aux_get_scope_for_tokens(B, A);
                }
            }

            PRINT(" ->scope: ", scope.to_string(), "\n");
            
            PRINT("vapaee::token::exchange::aux_get_canonical_scope_for_symbols() ...\n");
            return scope;
        }

        name aux_create_label_for_hour (int hh) {
            switch(hh) {
                case  0: return name("h.zero");
                case  1: return name("h.one");
                case  2: return name("h.two");
                case  3: return name("h.three");
                case  4: return name("h.four");
                case  5: return name("h.five");
                case  6: return name("h.six");
                case  7: return name("h.seven");
                case  8: return name("h.eight");
                case  9: return name("h.nine");
                case 10: return name("h.ten");
                case 11: return name("h.eleven");
                case 12: return name("h.twelve");
                case 13: return name("h.thirteen");
                case 14: return name("h.fourteen");
                case 15: return name("h.fifteen");
                case 16: return name("h.sixteen");
                case 17: return name("h.seventeen");
                case 18: return name("h.eighteen");
                case 19: return name("h.nineteen");
                case 20: return name("h.twenty");
                case 21: return name("h.twentyone");
                case 22: return name("h.twentytwo");
                case 23: return name("h.twentythree");
            }
            PRINT("    aux_create_label_for_hour(hh): ERROR:", std::to_string(hh), "\n");
            eosio_assert(false, "ERROR: bad hour: ");
            return name("error");
        }

        void aux_register_transaction_in_history(bool inverted, name buyer, name seller, asset price, asset inverse, asset payment, asset amount, asset buyfee, asset sellfee) {
            PRINT("vapaee::token::exchange::aux_register_transaction_in_history()\n");
            PRINT(" inverted: ", std::to_string(inverted), "\n");
            PRINT(" buyer: ", buyer.to_string(), "\n");
            PRINT(" seller: ", seller.to_string(), "\n");
            PRINT(" amount: ", amount.to_string(), "\n");   // 0.00047800 TLOS
            PRINT(" inverse: ", inverse.to_string(), "\n"); // 0.00047800 TLOS
            PRINT(" price: ", price.to_string(), "\n");     // 2092.05020920 EDNA
            PRINT(" payment: ", payment.to_string(), "\n"); // 1.00000000 EDNA
            PRINT(" buyfee: ", buyfee.to_string(), "\n");   // 0.00000047 TLOS
            PRINT(" sellfee: ", sellfee.to_string(), "\n"); // 0.00200000 EDNA
    
            time_point_sec date = time_point_sec(now());
            name tmp_name;
            asset tmp_asset;
            asset tmp_pay;
            name owner = seller;

            symbol_code currency = price.symbol.code();
            if (inverted) {
                currency = inverse.symbol.code();
            }
            
            symbol_code A = amount.symbol.code();
            symbol_code B = payment.symbol.code();
            name scope = aux_get_canonical_scope_for_symbols(A, B);

            
            bool is_buy = false;
            PRINT(" -> scope: ", scope.to_string(), "\n");

            if (scope == aux_get_scope_for_tokens(B, A)) {
                // swap buyer / seller names
                tmp_name = buyer;
                buyer = seller;
                seller = tmp_name;

                // swap fees
                tmp_asset = buyfee;
                buyfee = sellfee;
                buyfee = tmp_asset;

                // swap amount / payment
                tmp_asset = amount;
                amount = payment;
                payment = tmp_asset;
                
                // swap price / inverse
                tmp_pay = price;
                price = inverse;
                inverse = tmp_pay;

                // swap to "sell" type of transaction
                is_buy = true;

                inverted = !inverted;
                // PRINT(" -> buyer: ", buyer.to_string(), "\n");
                // PRINT(" -> seller: ", seller.to_string(), "\n");
                // PRINT(" -> amount: ", amount.to_string(), "\n");
                // PRINT(" -> price: ", price.to_string(), "\n");
                // PRINT(" -> buyfee: ", buyfee.to_string(), "\n");
                // PRINT(" -> sellfee: ", sellfee.to_string(), "\n");
                // PRINT(" -> payment: ", payment.to_string(), "\n");
            }

            uint64_t market = aux_get_market_id(A, B);
            // register event on history table
            history table(get_self(), market);
            uint64_t h_id = table.available_primary_key();
            table.emplace(get_self(), [&](auto & a){
                a.id = h_id;
                a.date = date;
                a.buyer = buyer;
                a.seller = seller;
                a.amount = amount;
                a.price = price;
                a.inverse = inverse;
                a.payment = payment;
                a.buyfee = buyfee;
                a.sellfee = sellfee;
                a.isbuy = is_buy;
            });

            // register event for activity log
            if (!inverted) {
                aux_register_event(owner, name("transaction"), scope.to_string() + "|" + buyer.to_string() + "|" + seller.to_string() + "|" + amount.to_string() + "|" + payment.to_string() + "|" + price.to_string() );
            } else {
                name actual_scope = aux_get_scope_for_tokens(A, B);
                if (scope == actual_scope) {
                    actual_scope = aux_get_scope_for_tokens(B, A);
                }
                aux_register_event(owner, name("transaction"), actual_scope.to_string() + "|" + buyer.to_string() + "|" + seller.to_string() + "|" + payment.to_string() + "|" + amount.to_string() + "|" + inverse.to_string() );
            }
            
            // aux_trigger_event(amount.symbol.code(),  name("deal"), seller, buyer,  amount,  payment, price);
            // aux_trigger_event(payment.symbol.code(), name("deal"), buyer,  seller, payment, amount,  inverse);

            // find out last price
            asset last_price = price;
            tablesummary summary(get_self(), market);
            auto ptr = summary.find(name("lastone").value);
            if (ptr != summary.end()) {
                last_price = ptr->price;
            }

            // calculate hour and label
            uint64_t ahora = current_time();
            uint64_t sec = ahora / 1000000;
            uint64_t hour = sec / 3600;
            int  hora = hour % 24;
            name label = aux_create_label_for_hour(hora);
            
            // save table summary (price & volume/h)
            ptr = summary.find(label.value);
            if (ptr == summary.end()) {
                summary.emplace(get_self(), [&](auto & a) {
                    a.label = label;
                    a.price = price;
                    a.inverse = inverse;
                    a.volume = payment;
                    a.amount = amount;
                    a.date = date;
                    a.hour = hour;
                    a.entrance = last_price;
                    a.min = price;
                    a.max = price;
                    if (last_price > a.max) a.max = last_price;
                    if (last_price < a.min) a.min = last_price;
                });
            } else {
                if (ptr->hour == hour) {
                    summary.modify(*ptr, get_self(), [&](auto & a){
                        a.price = price;
                        a.inverse = inverse;
                        a.volume += payment;
                        a.amount += amount;
                        a.date = date;
                        if (price > a.max) a.max = price;
                        if (price < a.min) a.min = price;
                    });
                } else {
                    eosio_assert(ptr->hour < hour, "ERROR: inconsistency in hour property");
                    summary.modify(*ptr, get_self(), [&](auto & a){
                        a.price = price;
                        a.inverse = inverse;
                        a.volume = payment;
                        a.amount = amount;
                        a.date = date;
                        a.hour = hour;
                        a.entrance = last_price;
                        a.min = price;
                        a.max = price;
                        if (last_price > a.max) a.max = last_price;
                        if (last_price < a.min) a.min = last_price;
                    });
                }
            }


            ptr = summary.find(label.value);
            asset volume = ptr->volume;
            asset total = ptr->amount;
            asset entrance = ptr->entrance;
            asset min = ptr->min;
            asset max = ptr->max;

            // save current block
            ptr = summary.find(name("lastone").value);
            if (ptr == summary.end()) {
                summary.emplace(get_self(), [&](auto & a) {
                    a.label = name("lastone");
                    a.price = price;
                    a.inverse = inverse;
                    a.volume = volume;
                    a.amount = total;
                    a.date = date;
                    a.hour = hour;
                    a.entrance = entrance;
                    a.min = min;
                    a.max = max;
                });
            } else {
                summary.modify(*ptr, get_self(), [&](auto & a){
                    a.price = price;
                    a.inverse = inverse;
                    a.volume = volume;
                    a.amount = total;
                    a.date = date;
                    a.hour = hour;
                    a.entrance = entrance;
                    a.min = min;
                    a.max = max;
                });
            }

            // save table summary (price & volume/h)
            blockhistory blocktable(get_self(), market);
            uint64_t bh_id = blocktable.available_primary_key();
            auto index = blocktable.template get_index<name("hour")>();
            auto bptr = index.find(hour);
            if (bptr == index.end()) {
                blocktable.emplace(get_self(), [&](auto & a) {
                    a.id = bh_id;
                    a.price = price;
                    a.inverse = inverse;
                    a.volume = payment;
                    a.amount = amount;
                    a.date = date;
                    a.hour = hour;
                    a.entrance = last_price;
                    a.min = price;
                    a.max = price;
                    if (last_price > a.max) a.max = last_price;
                    if (last_price < a.min) a.min = last_price;
                });
            } else {
                blocktable.modify(*bptr, get_self(), [&](auto & a){
                    a.price = price;
                    a.inverse = inverse;
                    a.volume += payment;
                    a.amount += amount;
                    a.date = date;
                    if (price > a.max) a.max = price;
                    if (price < a.min) a.min = price;
                });
            }


            // update deals (history table) & blocks (blockhistory table) count for scope table
            ordersummary o_summary(get_self(), get_self().value);
            auto orders_itr = o_summary.find(market);

            eosio_assert(orders_itr != o_summary.end(), (string("Why is this entry missing? ") + scope.to_string() + string(" market: ") + std::to_string((unsigned long)market)).c_str());
            o_summary.modify(*orders_itr, same_payer, [&](auto & a){
                a.deals = h_id+1;
                a.blocks = bh_id+1;

                if (currency == a.pay) {
                    a.demand.ascurrency += 1;
                } else {
                    a.supply.ascurrency += 1;
                }
            });

            PRINT("vapaee::token::exchange::aux_register_transaction_in_history() ...\n");
        }

        void aux_register_event(name user, name event, string params) {
            PRINT("vapaee::token::exchange::aux_register_event()\n");
            PRINT(" user: ", user.to_string(), "\n");
            PRINT(" event: ", event.to_string(), "\n");
            PRINT(" params: ", params.c_str(), "\n");
            time_point_sec date = time_point_sec(now());
            
            events table(get_self(), get_self().value);
            auto header = table.begin();
            if (header == table.end()) {
                table.emplace(get_self(), [&](auto & a){
                    a.id = table.available_primary_key();
                    a.user = get_self();
                    a.event = name("init");
                    a.params = string("1 event");
                    a.date = date;
                });
            } else {
                table.modify(*header, get_self(), [&](auto & a){
                    a.params = std::to_string((unsigned long) table.available_primary_key()) + string(" events");
                    a.date = date;
                });
            }

            table.emplace(get_self(), [&](auto & a){
                a.id = table.available_primary_key();
                a.user = user;
                a.event = event;
                a.params = params;
                a.date = date;
            });

            PRINT("vapaee::token::exchange::aux_register_event() ...\n");
        }

        void aux_generate_order(name owner, name type, asset total, asset price, name ram_payer, uint64_t ui) {
            PRINT("vapaee::token::exchange::aux_generate_order()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" type: ", type.to_string(), "\n");
            PRINT(" total: ", total.to_string(), "\n");
            PRINT(" price: ", price.to_string(), "\n");
            PRINT(" ui: ", std::to_string((long unsigned) ui), "\n");
            
            require_auth(owner);         

            // create scope for the orders table
            uint64_t market_buy = aux_get_market_id(total.symbol.code(), price.symbol.code());
            uint64_t market_sell = aux_get_market_id(price.symbol.code(), total.symbol.code());

            PRINT(" market_buy: ", std::to_string((long unsigned) market_buy), "\n");
            PRINT(" market_sell: ", std::to_string((long unsigned) market_sell), "\n");
            
            asset inverse = vapaee::utils::inverse(price, total.symbol);
            asset payment = vapaee::utils::payment(total, price);
            
            PRINT(" -> inverse: ", inverse.to_string(), "\n");
            PRINT(" -> payment: ", payment.to_string(), "\n");

            aux_register_event(owner, name(type.to_string() + ".order"), total.to_string() + "|" + price.to_string() );


            // // this code is useful to hot-debugging
            // eosio_assert(owner.value != name("viterbotelos").value,
            //     create_error_asset4("DEBUG IN PROGRESS. PLEASE WAIT",
            //     price, total, inverse, payment).c_str()); 

            if (type == name("sell")) {
                aux_generate_sell_order(false, owner, market_sell, market_buy, total, payment, price, inverse, ram_payer, ui);
            } else if (type == name("buy")) {
                aux_generate_sell_order(true, owner, market_buy, market_sell, payment, total, inverse, price, ram_payer, ui);
            } else {
                eosio_assert(false, (string("type must be 'sell' or 'buy' in lower case, got: ") + type.to_string()).c_str());
            }
            
            PRINT("vapaee::token::exchange::aux_generate_order() ...\n");
        }

        void aux_generate_sell_order(bool inverted, name owner, uint64_t market_buy, uint64_t market_sell, asset total, asset payment, asset price, asset inverse, name ram_payer, uint64_t ui) {
            PRINT("vapaee::token::exchange::aux_generate_sell_order()\n");
            PRINT(" inverted: ", std::to_string(inverted), "\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" market_buy: ", std::to_string((long unsigned) market_buy), "\n");
            PRINT(" market_sell: ", std::to_string((long unsigned) market_sell), "\n");
            PRINT(" total: ", total.to_string(), "\n");        // total: 1.00000000 TLOS
            PRINT(" payment: ", payment.to_string(), "\n");    // payment: 2.50000000 CNT
            PRINT(" price: ", price.to_string(), "\n");        // price: 2.50000000 CNT
            PRINT(" inverse: ", inverse.to_string(), "\n");    // inverse: 0.40000000 TLOS
            PRINT(" ram_payer: ", ram_payer.to_string(), "\n");
            PRINT(" ui: ", std::to_string((long unsigned) ui), "\n");
            

            double buyer_fee_percentage = 0.001;
            double seller_fee_percentage = 0.002;
            
            sellorders buytable(get_self(), market_buy);
            sellorders selltable(get_self(), market_sell);

            ordersummary o_summary(get_self(), get_self().value);
            symbol_code A = total.symbol.code();
            symbol_code B = payment.symbol.code();
            
            uint64_t can_market = aux_get_canonical_market(A, B);
            uint64_t inv_market = aux_get_inverted_market(A, B);
            uint64_t market = aux_get_market_id(A, B);
            auto orders_ptr = o_summary.find(can_market);
            bool reverse_scope = market != can_market;

            // sellorders selltable(get_self(), scope.value);
            auto buy_index = buytable.template get_index<name("price")>();
            // auto sell_index = selltable.template get_index<"price"_n>();
            auto sell_index = selltable.template get_index<name("price")>();
            asset remaining = total;
            asset remaining_payment = payment;
            asset current_price;
            asset current_inverse;
            asset current_total;
            asset current_payment = payment;
            name buyer;
            name seller = owner;
            // asset inverse = vapaee::utils::inverse(price, total.symbol);
            sell_order_table order;
            name buy_fees_receiver;
            name sell_fees_receiver;



            
            vector<asset> deposits;
            aux_put_deposits_on_user_ram(owner, payment);
            aux_clone_user_deposits(owner, deposits);

            tokens tokenstable(get_self(), get_self().value);
            auto atk_itr = tokenstable.find(total.symbol.code().raw());
            auto ptk_itr = tokenstable.find(price.symbol.code().raw());
            eosio_assert(atk_itr != tokenstable.end(), (string("Token ") + total.symbol.code().to_string() + " not registered").c_str());
            eosio_assert(ptk_itr != tokenstable.end(), (string("Token ") + price.symbol.code().to_string() + " not registered").c_str());
            // eosio_assert(atk_itr->precision == total.symbol.precision(), aux_error_1(total, atk_itr->precision).c_str());
            // eosio_assert(ptk_itr->precision == price.symbol.precision(), aux_error_1(price, ptk_itr->precision).c_str());
            eosio_assert(price.symbol != total.symbol, (string("price token symbol ") + price.symbol.code().to_string() + " MUST be different from total").c_str());
 
            uint64_t total_unit = pow(10.0, total.symbol.precision());
            uint64_t price_unit = pow(10.0, price.symbol.precision());

            // iterate over a list or buy order from the maximun price down
            for (auto b_ptr = buy_index.begin(); b_ptr != buy_index.end(); b_ptr = buy_index.begin()) {
                eosio_assert(b_ptr->price.symbol == inverse.symbol,
                    create_error_asset2(ERROR_AGSO_1, b_ptr->price, inverse).c_str());
                PRINT(" compare: (price<=inverse) ??  - (", b_ptr->price.to_string(), " <= ", inverse.to_string(), ") ??? \n");
                if (b_ptr->price.amount <= inverse.amount) { 
                    // transaction !!!
                    current_price = b_ptr->price;   // TLOS
                    PRINT("TRANSACTION!! price: ", current_price.to_string(),"\n");
                    buyer = b_ptr->owner;
                    PRINT("              buyer: ", buyer.to_string() ,"\n");
                    PRINT("      current_price: ", current_price.to_string() ,"\n");
                    PRINT("       b_ptr->total: ", b_ptr->total.to_string(), " > remaining: ", remaining.to_string()," ?\n");
 
                    eosio_assert(b_ptr->total.symbol == remaining.symbol,
                        create_error_asset2(ERROR_AGSO_2, b_ptr->total, remaining).c_str());

                    if (b_ptr->total > remaining) { // CNT
                        // buyer wants more that the user is selling -> reduces buyer order amount
                        current_total = remaining;  // CNT
                        current_payment.amount = vapaee::utils::multiply(remaining, b_ptr->inverse);

                        // // this code is useful to hot-debugging
                        // eosio_assert(owner.value != name("viterbotelos").value,
                        //     create_error_asset4("DEBUG IN PROGRESS. PLEASE WAIT",
                        //     current_payment, b_ptr->inverse, remaining, b_ptr->total).c_str());       

                        buytable.modify(*b_ptr, aux_get_modify_payer(ram_payer), [&](auto& a){
                            double percent = (double)remaining.amount / (double)a.total.amount;
                            eosio_assert(a.total.symbol == remaining.symbol,
                                create_error_asset2(ERROR_AGSO_3, a.total, remaining).c_str());
                            eosio_assert(a.selling.symbol == current_payment.symbol,
                                create_error_asset2(ERROR_AGSO_4, a.selling, current_payment).c_str());
                            a.total -= remaining;   // CNT
                            a.selling -= current_payment;    // TLOS
                        });
                        PRINT("    payment (1): ", current_payment.to_string(),"\n");

                        // decrese the total in registry for this incompleted order
                        eosio_assert(orders_ptr != o_summary.end(), "table MUST exist but it does not");
                        o_summary.modify(*orders_ptr, ram_payer, [&](auto & a){
                            PRINT("        a.total:  ", a.demand.total.to_string(),"\n");
                            PRINT("        payment:  ", current_payment.to_string(),"\n");
                            
                                // ERROR -----> [4.36500000 TLOS], [1250.00000000 CNT]
                            if (!reverse_scope) {
                                // we are consuming part of a buy-order so we decrement the demand
                                eosio_assert(a.demand.total.symbol == current_payment.symbol,
                                    create_error_asset2(ERROR_AGSO_5, a.demand.total, current_payment).c_str());             
                                a.demand.total -= current_payment;
                            } else {
                                // we are consuming part of a sell-order so we decrement the supply
                                eosio_assert(a.supply.total.symbol == current_payment.symbol,
                                    create_error_asset2(ERROR_AGSO_5, a.supply.total, current_payment).c_str());
                                a.supply.total -= current_payment;
                            }
                        });

                    } else {
                        // buyer gets all amount wanted -> destroy order

                        uint64_t buy_id = b_ptr->id;
                        current_total = b_ptr->total;
                        current_payment = b_ptr->selling;
                        buytable.erase(*b_ptr);
                        PRINT("    payment (2): ", current_payment.to_string(),"\n");

                        // register order in user personal order registry
                        userorders buyerorders(get_self(), buyer.value);     
                        auto buyer_itr = buyerorders.find(market_buy);
                        eosio_assert(buyer_itr != buyerorders.end(), "ERROR: cómo que no existe? No fue registrado antes? buyer? market_buy?");
                        eosio_assert(orders_ptr != o_summary.end(), "table MUST exist but it does not");

                        // take the order out of the buyer personal order registry
                        buyerorders.modify(*buyer_itr, ram_payer, [&](auto & a){
                            std::vector<uint64_t> newlist;
                            std::copy_if (a.ids.begin(), a.ids.end(), std::back_inserter(newlist), [&](uint64_t i){return i!=buy_id;} );
                            a.ids = newlist;
                        });
                        // if there's no orders left, erase the entire table entry
                        buyer_itr = buyerorders.find(market_buy);
                        if (buyer_itr != buyerorders.end() && buyer_itr->ids.size() == 0) {
                            buyerorders.erase(*buyer_itr);
                        }

                        if (!reverse_scope) {
                            // we are consuming a buy-order so we decrement the demand
                            o_summary.modify(*orders_ptr, ram_payer, [&](auto & a){
                                a.demand.orders--;
                                eosio_assert(a.demand.total.symbol == current_payment.symbol,
                                    create_error_asset2(ERROR_AGSO_6, a.demand.total, current_payment).c_str());
                                a.demand.total -= current_payment;
                            });
                        } else {
                            // we are consuming a sell-order so we decrement the supply
                            o_summary.modify(*orders_ptr, ram_payer, [&](auto & a){
                                a.supply.orders--;
                                eosio_assert(a.supply.total.symbol == current_payment.symbol,
                                    create_error_asset2(ERROR_AGSO_6, a.supply.total, current_payment).c_str());
                                a.supply.total -= current_payment;
                            });
                        }

                    }

                    eosio_assert(remaining.symbol == current_total.symbol,
                        create_error_asset2(ERROR_AGSO_7, remaining, current_total).c_str());
                    eosio_assert(remaining_payment.symbol == current_payment.symbol,
                        create_error_asset2(ERROR_AGSO_8, remaining_payment, current_payment).c_str());

                    remaining -= current_total;
                    remaining_payment -= current_payment;
                    asset seller_fee, buyer_fee, seller_gains, buyer_gains;
                    // calculate fees
                    buyer_fee = current_total;
                    buyer_fee.amount = current_total.amount * buyer_fee_percentage;
                    seller_gains = current_total - buyer_fee;
                    seller_fee = current_payment;
                    seller_fee.amount = current_payment.amount * seller_fee_percentage;

                    eosio_assert(seller_fee.symbol == current_payment.symbol,
                        create_error_asset2(ERROR_AGSO_9, seller_fee, current_payment).c_str());
                    buyer_gains = current_payment - seller_fee;

                    // transfer to buyer CNT
                    action(
                        permission_level{get_self(),name("active")},
                        get_self(),
                        name("swapdeposit"),
                        std::make_tuple(owner, buyer, seller_gains, true, string("exchange made for ") + buyer_gains.to_string())
                    ).send();
                    PRINT("     -- transfer ", seller_gains.to_string(), " to ", buyer.to_string(),"\n");
                        
                    // transfer to contract fees on CNT
                    action(
                        permission_level{get_self(),name("active")},
                        get_self(),
                        name("swapdeposit"),
                        std::make_tuple(owner, get_self(), buyer_fee, true, string("exchange made for ") + buyer_gains.to_string())
                    ).send();
                    PRINT("     -- charge fees ", buyer_fee.to_string(), " to ", buyer.to_string(),"\n");
                        
                    // transfer to seller TLOS
                    action(
                        permission_level{get_self(),name("active")},
                        get_self(),
                        name("swapdeposit"),
                        std::make_tuple(get_self(), owner, buyer_gains, true, string("exchange made for ") + seller_gains.to_string())
                    ).send();
                    PRINT("     -- transfer ", buyer_gains.to_string(), " to ", owner.to_string(),"\n");

                    // convert deposits to earnings
                    action(
                        permission_level{get_self(),name("active")},
                        get_self(),
                        name("deps2earn"),
                        std::make_tuple(buyer_fee)
                    ).send();
                    PRINT("     -- converting fee ", buyer_fee.to_string(), " to earnings\n");

                    action(
                        permission_level{get_self(),name("active")},
                        get_self(),
                        name("deps2earn"),
                        std::make_tuple(seller_fee)
                    ).send();
                    PRINT("     -- converting fee ", seller_fee.to_string(), " to earnings\n");

                    // saving the transaction in history
                    current_inverse = vapaee::utils::inverse(current_price, current_payment.symbol);
                    // PRINT("   - current_payment: ", current_payment.to_string(), "\n");  // 1.00000000 EDNA
                    // PRINT("   - inverse:         ", inverse.to_string(), "\n");
                    // PRINT("   - current_price:   ", current_price.to_string(), "\n");    // 0.00047800 TLOS
                    // PRINT("   - current_inverse: ", current_inverse.to_string(), "\n");
                    aux_register_transaction_in_history(inverted, buyer, seller, current_inverse, current_price, current_payment, current_total, buyer_fee, seller_fee);
                    
                } else {
                    break;
                }

                PRINT("  remaining:", remaining.to_string(),"\n");
                if (remaining.amount <= 0) break;
            }

            if (remaining.amount > 0 && remaining_payment.amount > 0) {
                PRINT("-- final remaining: ", remaining.to_string(), " --\n");
                // insert sell order
                
                payment.amount = remaining_payment.amount;

                // transfer payment deposits to contract
                action(
                    permission_level{get_self(),name("active")},
                    get_self(),
                    name("swapdeposit"),
                    std::make_tuple(owner, get_self(), remaining, false, string("future payment for order"))
                ).send();

                aux_trigger_event(remaining.symbol.code(), name("order"), owner, _self, remaining, payment, price);

                PRINT("   remaining: ", remaining.to_string(), "\n");
                PRINT("   payment: ", payment.to_string(), "\n");
                PRINT("   price: ", price.to_string(), "\n");
                PRINT("   inverse: ", inverse.to_string(), "\n");

                // create order entry
                // inverse = vapaee::utils::inverse(price, remaining.symbol);
                uint64_t id = selltable.available_primary_key();
                PRINT("   selltable.emplace() id:", std::to_string((unsigned long) id),"\n"); 
                selltable.emplace( ram_payer, [&]( auto& a ) {
                    a.id = id;
                    a.owner = owner;
                    a.price = price;
                    a.inverse = inverse;
                    a.total = payment;
                    a.selling = remaining;
                    a.ui = ui;
                });

                // register new order in the orders table
                if (orders_ptr == o_summary.end()) {
                    o_summary.emplace( ram_payer, [&]( auto& a ) {
                        if (!reverse_scope) {
                            PRINT("   o_summary.emplace() can_market:", std::to_string((unsigned long)can_market),"\n"); 
                            a.market = can_market;
                            a.sell = remaining.symbol.code();
                            a.pay = payment.symbol.code();            
                            a.supply.orders = 1;
                            a.supply.total = remaining;
                            a.demand.orders = 0;
                            a.demand.total = asset(0, payment.symbol);
                        } else {
                            PRINT("   o_summary.emplace() can_market:", std::to_string((unsigned long)can_market)," INVERSED\n"); 
                            a.market = can_market;
                            a.sell = payment.symbol.code();
                            a.pay = remaining.symbol.code();
                            a.supply.orders = 0;
                            a.supply.total = asset(0, payment.symbol);
                            a.demand.orders = 1;
                            a.demand.total = remaining;
                        }                       
                    });
                } else {
                    o_summary.modify(*orders_ptr, ram_payer, [&](auto & a){
                        if (!reverse_scope) {
                            a.supply.orders++;
                            a.supply.total += remaining;
                        } else {
                            a.demand.orders++;
                            a.demand.total += remaining;
                        }
                    });
                }

                // register order in user personal order registry
                userorders userorders_table(get_self(), owner.value);
                auto user_itr = userorders_table.find(market_sell);
                if (user_itr == userorders_table.end()) {
                    PRINT("   userorders_table.emplace id:", std::to_string((unsigned long)market_sell),"\n"); 
                    userorders_table.emplace( ram_payer, [&]( auto& a ) {
                        a.table = aux_get_table_from_market(market_sell).to_string();
                        a.market = market_sell;
                        a.ids.push_back(id);
                    });
                } else {
                    userorders_table.modify(*user_itr, ram_payer, [&](auto & a){
                        a.ids.push_back(id);
                    });
                }

                PRINT("  sellorders.emplace(): ", std::to_string((unsigned long long) id), "\n");
            }
            
            PRINT("vapaee::token::exchange::aux_generate_sell_order() ...\n");
        }
        
        void action_convert_deposits_to_earnings(const asset & quantity) {
            PRINT("vapaee::token::exchange::action_convert_deposits_to_earnings()\n");
            PRINT(" quantity: ", quantity.to_string(), "\n");
            
            require_auth(get_self());

            aux_convert_deposits_to_earnings(quantity);
            PRINT("vapaee::token::exchange::action_convert_deposits_to_earnings() ...\n");
        }

        void action_order(name owner, name type, const asset & total, const asset & price, uint64_t ui) {
            PRINT("vapaee::token::exchange::action_order()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" type: ", type.to_string(), "\n");      
            PRINT(" total: ", total.to_string(), "\n");      
            PRINT(" price: ", price.to_string(), "\n");      
            PRINT(" ui: ", std::to_string((long unsigned) ui), "\n");
            require_auth(owner);

            aux_generate_order(owner, type, total, price, owner, ui);

            PRINT("vapaee::token::exchange::action_order() ...\n");      
        }

        void action_withdraw(name owner, const asset & quantity) {
            PRINT("vapaee::token::exchange::action_withdraw()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" quantity: ", quantity.to_string(), "\n");

            // substract or remove deposit entry
            require_auth(owner);
            asset extended = aux_extend_asset(quantity);
            aux_substract_deposits(owner, extended, owner);

            aux_earn_micro_change(owner, quantity.symbol, extended.symbol, owner);

            // send tokens
            tokens tokenstable(get_self(), get_self().value);
            auto ptk_itr = tokenstable.find(quantity.symbol.code().raw());
            eosio_assert(ptk_itr != tokenstable.end(), (string("Token ") + quantity.symbol.code().to_string() + " not registered").c_str());

            action(
                permission_level{get_self(),name("active")},
                ptk_itr->contract,
                name("transfer"),
                std::make_tuple(get_self(), owner, quantity, string("withdraw deposits: ") + quantity.to_string())
            ).send();
            PRINT("   transfer ", quantity.to_string(), " to ", owner.to_string(),"\n");

            aux_register_event(owner, name("withdraw"), quantity.to_string());

            aux_trigger_event(quantity.symbol.code(), name("withdraw"), owner, _self, quantity, _asset, _asset);

            PRINT("vapaee::token::exchange::action_withdraw() ...\n");
        }
        
        void action_add_token(name contract, const symbol_code & sym_code, uint8_t precision, name admin) {
            PRINT("vapaee::token::exchange::action_add_token()\n");
            PRINT(" contract: ", contract.to_string(), "\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");
            PRINT(" precision: ", std::to_string((unsigned) precision), "\n");
            PRINT(" admin: ", admin.to_string(), "\n");

            require_auth(admin);

            stats statstable( contract, sym_code.raw() );
            auto token_itr = statstable.find( sym_code.raw() );
            eosio_assert( token_itr != statstable.end(), "token with symbol not exists" );
            
            eosio_assert(has_auth(contract) || has_auth(token_itr->issuer), "only token contract or issuer can add this token to DEX" );


            tokens tokenstable(get_self(), get_self().value);
            auto itr = tokenstable.find(sym_code.raw());
            eosio_assert(itr == tokenstable.end(), "Token already registered");
            tokenstable.emplace( admin, [&]( auto& a ){
                a.contract  = contract;
                a.symbol    = sym_code;
                a.precision = precision;
                a.admin     = admin;
                a.title     = "";
                a.website   = "";
                a.brief     = "";
                a.banner    = "";
                a.icon      = "";
                a.iconlg    = "";
                a.tradeable = false;
                a.data      = 0;
            });



            PRINT("vapaee::token::exchange::action_add_token() ...\n");
        }

        void action_update_token_info(const symbol_code & sym_code, string title, string website, string brief, string banner, string icon, string iconlg, bool tradeable) {
            PRINT("vapaee::token::exchange::action_update_token_info()\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");
            PRINT(" title: ", title.c_str(), "\n");
            PRINT(" website: ", website.c_str(), "\n");
            PRINT(" brief: ", brief.c_str(), "\n");
            PRINT(" banner: ", banner.c_str(), "\n");
            PRINT(" icon: ", icon.c_str(), "\n");
            PRINT(" iconlg: ", iconlg.c_str(), "\n");
            PRINT(" tradeable: ", std::to_string(tradeable), "\n");

            tokens tokenstable(get_self(), get_self().value);
            auto itr = tokenstable.find(sym_code.raw());
            eosio_assert(itr != tokenstable.end(), "Token not registered. You must register it first calling addtoken action");
            name admin = itr->admin;
            eosio_assert(has_auth(get_self()) || has_auth(admin), "only admin or token's admin can modify the token main info");

            tokenstable.modify( *itr, same_payer, [&]( auto& a ){
                a.title     = title;
                a.website   = website;
                a.brief     = brief;
                a.banner    = banner;
                a.icon      = icon;
                a.iconlg    = iconlg;
                a.tradeable = tradeable;
            });

            PRINT("vapaee::token::exchange::action_update_token_info() ...\n");
        }
        

        void action_set_token_admin (const symbol_code & sym_code, name newadmin) {
            PRINT("vapaee::token::exchange::action_set_token_admin()\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");
            PRINT(" newadmin: ", newadmin.to_string(), "\n");

            tokens tokenstable(get_self(), get_self().value);
            auto itr = tokenstable.find(sym_code.raw());
            eosio_assert(itr != tokenstable.end(), "Token not registered. You must register it first calling addtoken action");

            eosio_assert( is_account( newadmin ), "newadmin account does not exist");
            eosio_assert(has_auth(get_self()) || has_auth(itr->admin), "only DAO or token's admin can change token admin");

            tokenstable.modify( *itr, same_payer, [&]( auto& a ){
                a.admin = newadmin;
            });

            PRINT("vapaee::token::exchange::action_set_token_admin() ...\n");
        }
        

        void action_set_token_as_currency (const symbol_code & sym_code, bool is_currency) {
            PRINT("vapaee::token::exchange::action_set_token_as_currency()\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");
            PRINT(" is_currency: ", std::to_string(is_currency), "\n");

            tokens tokenstable(get_self(), get_self().value);
            auto itr = tokenstable.find(sym_code.raw());
            eosio_assert(itr != tokenstable.end(), "Token not registered. You must register it first calling addtoken action");
            
            eosio_assert(has_auth(get_self()), "only admin can modify the token.currency status");

            tokenstable.modify( *itr, same_payer, [&]( auto& a ){
                a.currency = is_currency;
            });

            PRINT("vapaee::token::exchange::action_set_token_as_currency() ...\n");
        }

        void action_set_token_data (const symbol_code & sym_code, uint64_t id, name action, name category, string text, string link) {
            PRINT("vapaee::token::exchange::action_set_token_data()\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");
            PRINT(" id: ", std::to_string((unsigned long) id), "\n");
            PRINT(" action: ", action.to_string(), "\n");
            PRINT(" category: ", category.to_string(), "\n");
            PRINT(" text: ", text.c_str(), "\n");
            PRINT(" link: ", link.c_str(), "\n"); 

            tokens tokenstable(get_self(), get_self().value);
            auto tkitr = tokenstable.find(sym_code.raw());
            eosio_assert(tkitr != tokenstable.end(), "Token not registered. You must register it first calling addtoken action");
            name admin = tkitr->admin;
            eosio_assert(has_auth(get_self()) || has_auth(admin), "only admin or token's admin can modify the token data");
            name ram_payer = admin;
            if (has_auth(get_self())) {
                ram_payer = get_self();
            }

            require_auth( ram_payer );

            tokendata tokendatatable(get_self(), sym_code.raw());
            auto itr = tokendatatable.find(id);
            if (action == name("add")) {
                tokendatatable.emplace( ram_payer, [&]( auto& a ){
                    a.id        = tokendatatable.available_primary_key();
                    a.category  = category;
                    a.text      = text;
                    a.link      = link;
                    a.date      = time_point_sec(now());
                });
                tokenstable.modify(*tkitr, same_payer, [&]( auto& a){
                    a.data++;
                });
            } else {
                eosio_assert(itr != tokendatatable.end(), "No action can be performed on entry with this id because it does not exist");
                if (action == name("remove")) {
                    tokendatatable.erase(*itr);
                    tokenstable.modify(*tkitr, same_payer, [&]( auto& a){
                        a.data--;
                        eosio_assert(a.data >= 0, "Data inconsistency");
                    });
                } else {
                    tokendatatable.modify(*itr, same_payer, [&](auto& a){
                        a.category  = category;
                        a.text      = text;
                        a.link      = link;
                        a.date      = time_point_sec(now());
                    });
                }
            }
            
            PRINT("vapaee::token::exchange::action_set_token_data() ...\n");            
        }

        void action_edit_token_event(const symbol_code & sym_code, name event, name action, name receptor) {
            PRINT("vapaee::token::exchange::action_edit_token_event()\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");
            PRINT(" event: ", event.to_string(), "\n");
            PRINT(" action: ", action.to_string(), "\n");
            PRINT(" receptor: ", receptor.to_string(), "\n");


            bool event_ok = false;
            if (!event_ok && event == name("withdraw"))     event_ok = true;
            if (!event_ok && event == name("deposit"))      event_ok = true;
            if (!event_ok && event == name("swapdeposit"))  event_ok = true;
            if (!event_ok && event == name("order"))        event_ok = true;
            if (!event_ok && event == name("cancel"))       event_ok = true;
            if (!event_ok && event == name("deal"))         event_ok = true;

            if (!event_ok) {
                string error = string("'") + event.to_string() + "' is not a valid event ('withdraw', 'deposit', 'swapdeposit', 'order', 'cancel', 'deal')";
                eosio_assert(event_ok, error.c_str());
            }
            
            tokens tokenstable(get_self(), get_self().value);
            auto tkitr = tokenstable.find(sym_code.raw());
            eosio_assert(tkitr != tokenstable.end(), "Token not registered. You must register it first calling addtoken action");
            name admin = tkitr->admin;
            eosio_assert(has_auth(get_self()) || has_auth(admin), "only admin or token's admin can modify the token data");
            name ram_payer = admin;
            if (has_auth(get_self())) {
                ram_payer = get_self();
            }

            require_auth( ram_payer );

            tokenevents tokeneventstable(get_self(), sym_code.raw());
            auto itr = tokeneventstable.find(event.value);
            if (action == name("add")) {
                eosio_assert(itr == tokeneventstable.end(), "The event is already registered. User action 'modify' instead of 'add'");
                tokeneventstable.emplace( ram_payer, [&]( auto& a ){
                    a.event     = event;
                    a.receptor  = receptor;
                });
            } else {
                eosio_assert(itr != tokeneventstable.end(), "No action can be performed on entry with this id because it does not exist");
                if (action == name("remove")) {
                    tokeneventstable.erase(*itr);
                } else {
                    tokeneventstable.modify(*itr, same_payer, [&](auto& a){
                        a.receptor  = receptor;
                    });
                }
            }

            PRINT("vapaee::token::exchange::action_edit_token_event()...\n");
        }

        void action_swapdeposit(name from, name to, const asset & quantity, bool trigger_event, string memo) {
            PRINT("vapaee::token::exchange::action_swapdeposit()\n");
            PRINT(" from: ", from.to_string(), "\n");
            PRINT(" to: ", to.to_string(), "\n");
            PRINT(" quantity: ", quantity.to_string(), "\n");
            PRINT(" trigger_event: ", std::to_string(trigger_event), "\n");
            PRINT(" memo: ", memo.c_str(), "\n");
            
            eosio_assert( from != to, "cannot swap deposits to self" );

            // if is not an internal inline action then the user "from" must have beed signed this transaction
            if ( !has_auth( get_self() )) {
                require_auth( from );
            }
            
            eosio_assert( is_account( to ), "to account does not exist");
            auto sym = quantity.symbol.code();
            tokens tokenstable(get_self(), get_self().value);
            const auto& st = tokenstable.get( sym.raw() );

            require_recipient( from );
            require_recipient( to );

            eosio_assert( quantity.is_valid(), "invalid quantity" );
            eosio_assert( quantity.amount > 0, "must transfer positive quantity" );
            eosio_assert( quantity.symbol.precision() == internal_precision, "symbol precision mismatch" );
            eosio_assert( memo.size() <= 256, "memo has more than 256 bytes" );
            
            name ram_payer;
            if ( has_auth( to ) ) {
                ram_payer = to;
            } else if (has_auth( from )) {
                ram_payer = from;
            } else {
                ram_payer = get_self();
            }
            PRINT("   -> ram_payer: ", ram_payer.to_string(), "\n");
            aux_substract_deposits(from, quantity, ram_payer);
            aux_add_deposits(to, quantity, ram_payer);

            if (from != _self && to != _self) {
                trigger_event = true;
                PRINT(" -> trigger_event: ", std::to_string(trigger_event), "\n");
            }

            if (trigger_event) {
                aux_trigger_event(quantity.symbol.code(), name("swapdeposit"), from, to, quantity, _asset, _asset);
            }
            
            PRINT("vapaee::token::exchange::action_swapdeposit() ...\n"); 
        }        

        void handler_transfer(name from, name to, asset quantity, string memo) {
            // skipp handling outcoming transfers from this contract to outside
            asset _quantity;
            if (to != get_self()) {
                print(from.to_string(), " to ", to.to_string(), ": ", quantity.to_string(), " vapaee::token::exchange::handler_transfer() skip...\n");
                return;
            }            
            
            PRINT("vapaee::token::exchange::handler_transfer()\n");
            PRINT(" from: ", from.to_string(), "\n");
            PRINT(" to: ", to.to_string(), "\n");
            PRINT(" quantity: ", quantity.to_string(), "\n");
            PRINT(" memo: ", memo.c_str(), "\n");
            PRINT(" code: ", get_code(), "\n");
            
            
            vector<string> strings = {""};
            name ram_payer = get_self();
            PRINT(" strings.size(): ", std::to_string(strings.size()), "\n");
            int i,j,s;

            for (i=0,j=0,s=0; i<memo.size(); i++,j++) {
                if (memo[i] == '|') {
                    s++;
                    j=0;
                    strings.push_back(string(""));
                    continue;
                } else {
                    strings[s] += memo[i];
                }
            }
            
            if (strings[0] == string("deposit")) {
                name receiver;
                if (strings.size() == 1) {
                    receiver = from;
                } else if (strings.size() == 2) {
                    receiver = name(strings[1]);
                }
                PRINT(" receiver: ", receiver.to_string(), "\n");
                eosio_assert(is_account(receiver), "receiver is not a valid account");
                PRINT(" ram_payer: ", ram_payer.to_string(), "\n");
                _quantity = aux_extend_asset(quantity);
                PRINT(" _quantity extended: ", _quantity.to_string(), "\n");
                aux_add_deposits(receiver, _quantity, get_self());
                aux_register_event(from, name("deposit"), receiver.to_string() + "|" + _quantity.to_string());
                aux_trigger_event(_quantity.symbol.code(), name("deposit"), from, receiver, _quantity, _asset, _asset);
            }

            PRINT("vapaee::token::exchange::handler_transfer() ...\n");
        }

        void aux_trigger_event(const symbol_code & sym_code, name event, name user, name peer, const asset & quantity, const asset & payment, const asset & price) {
            PRINT("vapaee::token::exchange::aux_trigger_event()\n");
            PRINT(" sym_code: ",  sym_code.to_string(), "\n");
            PRINT(" event: ",  event.to_string(), "\n");
            PRINT(" user: ",  user.to_string(), "\n");
            PRINT(" peer: ",  peer.to_string(), "\n");
            PRINT(" quantity: ",  quantity.to_string(), "\n");
            PRINT(" payment: ",  payment.to_string(), "\n");
            PRINT(" price: ",  price.to_string(), "\n");

            tokenevents tokeneventstable(get_self(), sym_code.raw());
            auto itr = tokeneventstable.find(event.value);
            if (itr != tokeneventstable.end()) {
                name receptor = itr->receptor;
                PRINT(" -> receptor: ",  receptor.to_string(), "\n");
                PRINT(" -> carbon copy sent to:: ",  receptor.to_string(), "\n");
                require_recipient (receptor);

                action(
                    permission_level{get_self(),name("active")},
                    receptor,
                    name("dexevent"),
                    std::make_tuple(
                        event,
                        user,
                        peer,
                        quantity,
                        payment,
                        price)
                ).send();
            }

            PRINT("vapaee::token::exchange::aux_trigger_event()... \n");
        }

        void action_cancel(name owner, name type, const symbol_code & token_a, const symbol_code & token_p, const std::vector<uint64_t> & orders) {
            // viterbotelos, sell, ACORN, TELOSD, [1]
            PRINT("vapaee::token::exchange::action_cancel()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" type: ", type.to_string(), "\n");
            PRINT(" token_a: ",  token_a.to_string(), "\n");
            PRINT(" token_p: ",  token_p.to_string(), "\n");
            PRINT(" orders.size(): ", std::to_string((int) orders.size()), "\n");

            require_auth(owner);

            // create scope for the orders table
            uint64_t buy_market = aux_get_market_id(token_a, token_p);
            uint64_t sell_market = aux_get_market_id(token_p, token_a);
            uint64_t can_market = aux_get_canonical_market(token_a, token_p);

            if (type == name("sell")) {
                aux_cancel_sell_order(owner, can_market, buy_market, orders);
            }

            if (type == name("buy")) {
                aux_cancel_sell_order(owner, can_market, sell_market, orders);
            }

            PRINT("vapaee::token::exchange::action_cancel() ...\n");
        }

        void aux_cancel_sell_order(name owner, uint64_t can_market, uint64_t market, const std::vector<uint64_t> & orders) {
            // viterbotelos, acorn.telosd, acorn.telosd, [1]
            PRINT("vapaee::token::exchange::aux_cancel_sell_order()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" can_market: ", std::to_string((unsigned long) can_market), "\n");
            PRINT(" market: ", std::to_string((unsigned long) market), "\n");
            PRINT(" orders.size(): ", orders.size(), "\n");

            sellorders selltable(get_self(), market);
            asset return_amount;
            name table = aux_get_table_from_market(market);
            
            ordersummary o_summary(get_self(), get_self().value);
            auto orders_ptr = o_summary.find(can_market);
            bool reverse_scope = can_market != market;

            // Register event
            aux_register_event(owner, name("cancel.order"), table.to_string() + "|" + std::to_string(orders.size()));

            for (int i=0; i<orders.size(); i++) {
                uint64_t order_id = orders[i];
                auto itr = selltable.find(order_id);
                eosio_assert(itr != selltable.end(), "buy order not found");
                eosio_assert(itr->owner == owner, "attemp to delete someone elses buy order");
                return_amount = itr->selling;
                PRINT("  return_amount: ", return_amount.to_string(), "\n");
                selltable.erase(*itr);

                // ake out the order from the user personal order registry
                userorders buyerorders(get_self(), owner.value);
                auto buyer_itr = buyerorders.find(market);
                
                eosio_assert(buyer_itr != buyerorders.end(), "ERROR: cómo que no existe? No fue registrado antes?");
                // take the order out of the buyer personal order registry
                buyerorders.modify(*buyer_itr, same_payer, [&](auto & a){
                    std::vector<uint64_t> newlist;
                    std::copy_if (a.ids.begin(), a.ids.end(), std::back_inserter(newlist), [&](uint64_t i){return i!=order_id;} );
                    a.ids = newlist;
                });
                // if there's no orders left, erase the entire table entry
                buyer_itr = buyerorders.find(market);
                if (buyer_itr != buyerorders.end() && buyer_itr->ids.size() == 0) {
                    buyerorders.erase(*buyer_itr);
                }

                // take out the registry for this canceled order
                eosio_assert(orders_ptr != o_summary.end(), "ordertable does not exist for that scope");
                if (!reverse_scope) {
                    // we are canceling a sell-order so we decrement the supply
                    o_summary.modify(*orders_ptr, same_payer, [&](auto & a){
                        a.supply.orders--;
                        eosio_assert(a.supply.total.symbol == return_amount.symbol,
                            create_error_asset2(ERROR_AGSO_6, a.supply.total, return_amount).c_str());
                        a.supply.total -= return_amount;
                    });
                } else {
                    // we are consuming a sell-order so we decrement the demand
                    o_summary.modify(*orders_ptr, same_payer, [&](auto & a){
                        a.demand.orders--;
                        eosio_assert(a.demand.total.symbol == return_amount.symbol,
                            create_error_asset2(ERROR_AGSO_6, a.demand.total, return_amount).c_str());
                        a.demand.total -= return_amount;
                    });
                }

                action(
                    permission_level{get_self(),name("active")},
                    get_self(),
                    name("swapdeposit"),
                    std::make_tuple(get_self(), owner, return_amount, false, string("order canceled, payment returned"))
                ).send();

                aux_trigger_event(return_amount.symbol.code(), name("cancel"), owner, get_self(), return_amount, _asset, _asset);
            }

            userorders buyerorders(get_self(), owner.value);
            auto buyer_itr = buyerorders.find(market);
            if (buyer_itr != buyerorders.end() && buyer_itr->ids.size() == 0) {
                buyerorders.erase(*buyer_itr);
            }
        }


        /* uint64_t aux_get_makert_from_table(name table) {
            PRINT("vapaee::token::exchange::aux_get_makert_from_table()\n");
            uint64_t market = 0;
            markets mktable(get_self(), get_self().value);
            auto index = mktable.template get_index<name("name")>();
            
            for (auto itr = index.lower_bound(table.value); itr != index.end(); itr++) {
                PRINT("  -- itr->name: ", itr->name.to_string(), "\n");
                if (itr->name == table) {
                    if (itr->name) {
                        market = itr->id;
                        break;
                        // if (itr->commodity == commodity && itr->commodity == currency) {
                        //     market = itr->id;
                        //     break;
                        // }
                    }
                } else {
                    eosio_assert(false, "ERROR!!!"); 
                }
            }

            PRINT("vapaee::token::exchange::aux_get_makert_from_table()...\n");
            return market;
        } */

        uint64_t aux_get_canonical_market(const symbol_code & A, const symbol_code & B) {
            name scope_a = aux_get_canonical_scope_for_symbols(A, B);
            name scope_b = aux_get_scope_for_tokens(A, B);
            if (scope_a == scope_b) return aux_get_market_id(A, B);
            if (scope_a != scope_b) return aux_get_market_id(B, A);
            return 0;
        }

        uint64_t aux_get_inverted_market(const symbol_code & A, const symbol_code & B) {
            name scope_a = aux_get_canonical_scope_for_symbols(A, B);
            name scope_b = aux_get_scope_for_tokens(A, B);
            if (scope_a != scope_b) return aux_get_market_id(A, B);
            if (scope_a == scope_b) return aux_get_market_id(B, A);
            return 0;
        }

        name aux_get_table_from_market(uint64_t market_id) {
            PRINT("vapaee::token::exchange::aux_get_table_from_market()\n");
            PRINT(" market_id: ", std::to_string((unsigned long) market_id), "\n");
            markets mktable(get_self(), get_self().value);
            auto market = mktable.get(market_id,  create_error_id1(ERROR_AGTFM_1, market_id).c_str());
            PRINT("vapaee::token::exchange::aux_get_table_from_market()...\n");
            return market.name;
        }

        bool aux_is_it_allowed_to_cerate_this_market(const symbol_code & A, const symbol_code & B) {
            PRINT("vapaee::token::exchange::aux_is_it_allowed_to_cerate_this_market()\n");
            PRINT(" A: ", A.to_string(), "\n");
            PRINT(" B: ", B.to_string(), "\n");

            tokens tokenstable(get_self(), get_self().value);
            auto atk_itr = tokenstable.find(A.raw());
            auto btk_itr = tokenstable.find(B.raw());
            
            eosio_assert(atk_itr != tokenstable.end(), create_error_symcode1(ERROR_AIIATCTM_1, A).c_str());
            eosio_assert(btk_itr != tokenstable.end(), create_error_symcode1(ERROR_AIIATCTM_2, B).c_str());
            eosio_assert(atk_itr != btk_itr,           create_error_symcode1(ERROR_AIIATCTM_3, A).c_str());

            bool allowed = false;
            if (atk_itr->currency) {
                allowed = true;
            }
            if (btk_itr->currency) {
                allowed = true;
            }
            if (atk_itr->group > 0 && atk_itr->group == btk_itr->group) {
                allowed = true;
            }

            PRINT("vapaee::token::exchange::aux_is_it_allowed_to_cerate_this_market()...\n");
            return allowed;
        }

        uint64_t aux_get_market_id(const symbol_code& A, const symbol_code& B) {
            PRINT("vapaee::token::exchange::aux_get_market_id()\n");
            PRINT(" A: ", A.to_string(), "\n");
            PRINT(" B: ", B.to_string(), "\n");
            uint64_t market = 0;
            markets mktable(get_self(), get_self().value);
            auto index = mktable.template get_index<name("name")>();
            

            name scope_canonical = aux_get_canonical_scope_for_symbols(A, B);
            name scope_b = aux_get_scope_for_tokens(A, B);
            
            for (auto itr = index.lower_bound(scope_b.value); itr != index.end(); itr++) {
                if (itr->name == scope_b) {
                    if (itr->commodity == A && itr->currency == B) {
                        return itr->id;
                    }
                } else {
                    break;
                }
            }

            // Is it allowed to create this market?
            if (!aux_is_it_allowed_to_cerate_this_market(A,B)) {
                eosio_assert(false, create_error_symcode2(ERROR_AGMI_1, A,B).c_str());
            }
            

           
            symbol_code commodity = A;
            symbol_code currency = B;
            uint64_t id = mktable.available_primary_key();
            market = id;
            if (scope_canonical != scope_b) {
                commodity = B;
                currency = A;
                market++;
            }
            PRINT("  mktable.emplace() id\n", std::to_string((unsigned) id), scope_canonical.to_string(), "\n");
            mktable.emplace(get_self(), [&](auto & a){
                a.id = id;
                a.name = scope_canonical;
                a.commodity = commodity;
                a.currency = currency;
            });
            name scope_inv = aux_get_scope_for_tokens(currency, commodity);
            PRINT("  mktable.emplace() id+1\n", std::to_string((unsigned) id+1), scope_canonical.to_string(), "\n");
            mktable.emplace(get_self(), [&](auto & a){
                a.id = id+1;
                a.name = scope_inv;
                a.commodity = currency;
                a.currency = commodity;
            });

            PRINT("vapaee::token::exchange::aux_get_market_id()...\n");
            return market;
        }

        void action_hotfix(int num, name account, asset quantity) {
            PRINT("vapaee::token::exchange::action_poblate_user_orders_table()\n");
            require_auth(get_self());
            int count = 1;
            uint64_t market = 0;
            uint64_t market_inv = 0;
            name scope;
            name scope_inv;



            
            PRINT("vapaee::token::exchange::action_poblate_user_orders_table() ...\n");
        }

        string aux_error_1(const asset & amount, uint8_t precision) {
            return string("Token ") +
                amount.symbol.code().to_string() +
                " has not the same precision(" +
                std::to_string(amount.symbol.precision()) +
                ") as registered(" +
                std::to_string(precision) + 
                ")";
        }
             



    }; // class

}; // namespace

}; // namespace