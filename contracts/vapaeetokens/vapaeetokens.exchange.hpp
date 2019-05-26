#pragma once
#include <vapaee/token/common.hpp>

#include <ctype.h>
#include <stdlib.h>


using namespace eosio;
namespace vapaee {
    namespace token {

    class exchange {
        name _self;
        name _code;
        uint8_t internal_precision;
    
    public:
        
        exchange():_self(vapaee::token::contract),_code(vapaee::token::contract),internal_precision(8){}
        exchange(name code):_self(vapaee::token::contract),_code(code),internal_precision(8){}

        inline name get_self() const { return _self; }
        inline name get_code() const { return _code; }

        string aux_to_lowercase(string str) {
            string result = str;
            for (int i=0; i<str.length(); i++) {
                result[i] = tolower(str[i]);
            }
            return result;
        }

        name aux_get_modify_payer(name ram_payer) {
            return (ram_payer == get_self()) ? same_payer : ram_payer;
        }

        name aux_get_scope_for_tokens(const symbol_code & a, const symbol_code & b) {
            string a_sym_str = a.to_string();
            string b_sym_str = b.to_string();
            string scope_str = a_sym_str + "." + b_sym_str;
            scope_str = aux_to_lowercase(scope_str); 
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
                depositstable.modify(*itr, aux_get_modify_payer(ram_payer), [&](auto& a){
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

            tokens tokenstable(get_self(), get_self().value);
            auto tk_itr = tokenstable.find(amount.symbol.code().raw());
            eosio_assert(tk_itr != tokenstable.end(), "The token is not registered");
            eosio_assert(tk_itr->verified, "The token is not verified");

            depusers depuserstable(get_self(), get_self().value);
            auto user_itr = depuserstable.find(owner.value);
            if (user_itr == depuserstable.end()) {
                depuserstable.emplace( ram_payer, [&]( auto& a ){
                    a.account = owner;
                });
            }

            deposits depositstable(get_self(), owner.value);
            auto itr = depositstable.find(amount.symbol.code().raw());
            if (itr == depositstable.end()) {
                depositstable.emplace( ram_payer, [&]( auto& a ){
                    a.amount = amount;
                });
            } else {
                depositstable.modify(*itr, aux_get_modify_payer(ram_payer), [&](auto& a){
                    eosio_assert(a.amount.symbol == amount.symbol,
                        create_error_asset2(ERROR_AAD_1, a.amount, amount).c_str());                    
                    a.amount += amount;
                });
            }
            PRINT("vapaee::token::exchange::aux_add_deposits() ...\n");
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

        void aux_load_lock(uint64_t id, locks_table & lock) {
            locks lockstable(get_self(), get_self().value);
            auto itr = lockstable.find(id);
            eosio_assert(itr != lockstable.end(), "no lock with this id was found");
            lock.id = itr->id;
            lock.owner = itr->owner;
            lock.amount = itr->amount;
            lock.expire = itr->expire;
            lock.concept = itr->concept;
            lock.foreign = itr->foreign;
            lock.scope = itr->scope;
        }

        uint64_t aux_create_lock(name owner, const asset & amount, uint64_t expire, name concept, uint64_t foreign, uint64_t scope, name ram_payer) {
            PRINT("vapaee::token::exchange::aux_create_lock()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" amount: ", amount.to_string(), "\n");
            PRINT(" expire: ", std::to_string((unsigned) expire), "\n");
            PRINT(" concept: ", concept.to_string(), "\n");
            PRINT(" foreign: ", std::to_string((unsigned) foreign), "\n");
            PRINT(" scope: ", std::to_string((unsigned) scope), "\n");
            PRINT(" ram_payer: ", ram_payer.to_string(), "\n");

            aux_substract_deposits(owner, amount, ram_payer);
            locks lockstable(get_self(), get_self().value);
            uint64_t id = lockstable.available_primary_key();

            PRINT("  lockstable.emplace(): ", std::to_string((unsigned long long) id), "\n");
            lockstable.emplace( ram_payer, [&]( auto& a ){
                a.id = id;
                a.owner = owner;
                a.amount = amount;
                a.expire = expire;
                a.concept = concept;
                a.foreign = foreign;
                a.scope = scope;
            });
            

            PRINT("vapaee::token::exchange::aux_create_lock() ...\n");
            return id;
        }

        void aux_cancel_lock(uint64_t id, name owner, name ram_payer) {
            /*
            PRINT("vapaee::token::exchange::aux_cancel_lock()\n");
            PRINT(" id: ", std::to_string((unsigned) id), "\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" ram_payer: ", ram_payer.to_string(), "\n");

            locks lockstable(get_self(), get_self().value);
            auto itr = lockstable.find(id);
            eosio_assert(itr != lockstable.end(), "no lock with this id was found");
            eosio_assert(owner != itr->owner, "lock owner is different from caller owner");

            // load lock data (amount)
            locks_table lock;
            aux_load_lock(id, lock);

            // erase lock entry
            lockstable.erase(*itr);
            
            // deposit back the users tokens
            aux_add_deposits(owner, lock.amount, ram_payer);

            PRINT("vapaee::token::exchange::aux_cancel_lock() ...\n");
            */
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
        /* 
        void aux_calculate_total_fee(name owner, const asset & amount_a, const asset & amount_b, asset & total_fee, asset & tlos, vector<asset> & depos) {
            PRINT("vapaee::token::exchange::aux_calculate_total_fee()\n");
            // PRINT(" owner: ", owner.to_string(), "\n");
            // PRINT(" amount_a: ", amount_a.to_string(), "\n");
            // PRINT(" amount_b: ", amount_b.to_string(), "\n");

            feeconfig feetable(get_self(), get_self().value);
            tlos = aux_which_one_is_tlos(amount_a, amount_b);

            auto itr = feetable.begin();
            bool success = false;
            int i=0;
            // PRINT("  tlos: ", tlos.to_string(), "\n");
            if (tlos.amount > 0) {
                for (itr = feetable.begin(); itr != feetable.end(); itr++) {
                    asset deposit;
                    bool found = false;
                    for (i=0; i<depos.size(); i++) {
                        // PRINT("    candidato: ", depos[i].to_string(), "\n");
                        if (depos[i].symbol.code().raw() == itr->fee.symbol.code().raw()) {
                            deposit = depos[i];
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        // PRINT("    no tiene: ", itr->fee.to_string(), "  probamos con otro...\n");
                        continue;
                    }
                    // PRINT("- fee: ", itr->fee.to_string(), "\n");
                    // PRINT("  deposit: ", deposit.to_string(), "\n");
                    total_fee = itr->fee;
                    total_fee.amount = tlos.amount * ((double)itr->fee.amount / (double)pow(10.0, itr->fee.symbol.precision()));
                    // PRINT("  total_fee: ", total_fee.to_string(), "\n");
                    if (deposit > total_fee) {
                        // user has enough fee-token to pay the fee -> we lock them up
                        depos[i] -= total_fee;
                        success = true;
                        // PRINT("  success !! \n");
                        break;
                    }
                }
            } else {
                // no fees because no tlos involved
                success = true;
            }

            eosio_assert(success, "user don't have enough deposists to pay the order fee");

            PRINT(" ",owner.to_string(), " -> fee: ", total_fee.to_string(), "(",  amount_a.to_string(),", ", amount_b.to_string(), "\n");
            PRINT("vapaee::token::exchange::aux_calculate_total_fee() ...\n");
        }
        */
        void aux_try_to_unlock(name ram_payer) {
            PRINT("vapaee::token::exchange::aux_try_to_unlock()\n");
            PRINT(" ram_payer: ", ram_payer.to_string(), "\n");

            int max = 5;           
            uint64_t now = current_time();
            PRINT(" now: ", std::to_string((unsigned long long) now), "\n");

            locks lockstable(get_self(), get_self().value);
            auto index = lockstable.template get_index<name("expire")>();
            auto itr = index.lower_bound(now);

            for (int count = max; itr != index.end() && count > 0; count--, itr = index.lower_bound(now)) {
                PRINT("  -- itr->expire: ", std::to_string((unsigned long long) itr->expire), "\n");
                if (itr->expire < now) {
                    aux_cancel_lock(itr->id, itr->owner, ram_payer);
                } else {
                    break;
                }
            }

            PRINT("vapaee::token::exchange::aux_try_to_unlock() ...\n");
        }

        void aux_convert_deposits_to_earnings(asset quantity) {
            PRINT("vapaee::token::exchange::aux_convert_deposits_to_earnings()\n");
            PRINT(" quantity: ", quantity.to_string(), "\n");

            aux_substract_deposits(get_self(), quantity, get_self());
            aux_add_earnings(quantity);

            PRINT("vapaee::token::exchange::aux_convert_deposits_to_earnings() ...\n");
        }

        name aux_get_history_scope_for_symbols(const symbol_code & A, const symbol_code & B) {
            PRINT("vapaee::token::exchange::aux_get_history_scope_for_symbols()\n");
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
            
            PRINT("vapaee::token::exchange::aux_get_history_scope_for_symbols() ...\n");
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

        void aux_register_transaction_in_history(name buyer, name seller, asset amount, asset price, asset payment, asset buyfee, asset sellfee) {
            PRINT("vapaee::token::exchange::aux_register_transaction_in_history()\n");
            PRINT(" buyer: ", buyer.to_string(), "\n");
            PRINT(" seller: ", seller.to_string(), "\n");
            PRINT(" amount: ", amount.to_string(), "\n");   // 0.00047800 TLOS
            PRINT(" price: ", price.to_string(), "\n");     // 2092.05020920 EDNA
            PRINT(" payment: ", payment.to_string(), "\n"); // 1.00000000 EDNA
            PRINT(" buyfee: ", buyfee.to_string(), "\n");   // 0.00000047 TLOS
            PRINT(" sellfee: ", sellfee.to_string(), "\n"); // 0.00200000 EDNA
    
            time_point_sec date = time_point_sec(now());
            name tmp_name;
            asset tmp_asset;
            asset tmp_pay;
            
            symbol_code A = amount.symbol.code();
            symbol_code B = payment.symbol.code();
            name scope = aux_get_history_scope_for_symbols(A, B);
            
            bool is_buy = false;
            PRINT(" -> scope: ", scope.to_string(), "\n");
            if (scope == aux_get_scope_for_tokens(B, A)) {
                // swap names
                tmp_name = buyer; buyer = seller; seller = tmp_name;

                // swap fees
                tmp_asset = buyfee; buyfee = sellfee; buyfee = tmp_asset;

                // swap amount / payment
                tmp_asset = amount;
                tmp_pay = price;
                tmp_pay.amount = amount.amount * ((double)price.amount / (double) pow(10.0, price.symbol.precision()));

                // DEBUGGING --> pasa por acá sin problemas
                // amount: 0.00047800 TLOS
                // payment: 1.00000000 EDNA
                // tmp_asset: 0.00047800 TLOS
                amount = payment;
                payment = tmp_asset;
                
                // sell transaction
                is_buy = true;

                // swap price / inverse
                price = vapaee::utils::inverse(price, tmp_asset.symbol);

                // PRINT(" -> buyer: ", buyer.to_string(), "\n");
                // PRINT(" -> seller: ", seller.to_string(), "\n");
                // PRINT(" -> amount: ", amount.to_string(), "\n");
                // PRINT(" -> price: ", price.to_string(), "\n");
                // PRINT(" -> buyfee: ", buyfee.to_string(), "\n");
                // PRINT(" -> sellfee: ", sellfee.to_string(), "\n");
                // PRINT(" -> payment: ", payment.to_string(), "\n");
            }

            history table(get_self(), scope.value);
            table.emplace(get_self(), [&](auto & a){
                a.id = table.available_primary_key();
                a.date = date;
                a.buyer = buyer;
                a.seller = seller;
                a.amount = amount;
                a.price = price;
                a.payment = payment;
                a.buyfee = buyfee;
                a.sellfee = sellfee;
                a.isbuy = is_buy;
            });

            // update deals count for scope table
            ordertables orderstables(get_self(), get_self().value);
            auto orders_itr = orderstables.find(scope.value);

            if (orders_itr == orderstables.end()) {
                orderstables.emplace( get_self(), [&]( auto& a ) {
                    a.table = scope;
                    a.sell = amount.symbol.code();
                    a.pay = payment.symbol.code();
                    a.orders = 0;
                    a.deals = 1;
                    a.blocks = 1;
                    a.total = asset(0, amount.symbol);
                });
                orders_itr = orderstables.find(scope.value);           
            } else {
                orderstables.modify(*orders_itr, same_payer, [&](auto & a){
                    a.deals += 1;
                    a.sell = amount.symbol.code();
                    a.pay = payment.symbol.code();
                    a.total = asset(a.total.amount, amount.symbol);
                });
            }
            /*
            // DEBUGGING CODE (ini) -------------------------------------------------
            if (payment.symbol.code().to_string() == string("EDNA") || amount.symbol.code().to_string() == string("EDNA")) {
                eosio_assert(false,
                    create_error_asset4("MESSAGE FROM VITER to debug EDNA token trading. line 448",
                    amount, payment, price, last_price).c_str());
            }
            // DEBUGGING CODE (end) -------------------------------------------------
            */
            // DEBUGGING CODE ---> PASA
            // amount: 1.00000000 EDNA
            // payment: 0.00047800 TLOS
            // price: 0.00047800 TLOS
            // last_price: 2092.05020920 EDNA

            // find out last price
            asset last_price = price;
            tablesummary summary(get_self(), scope.value);
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
                    a.volume = payment;
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
                        a.volume += payment;
                        a.date = date;
                        if (price > a.max) a.max = price;
                        if (price < a.min) a.min = price;
                    });
                } else {
                    eosio_assert(ptr->hour < hour, "ERROR: inconsistency in hour property");
                    summary.modify(*ptr, get_self(), [&](auto & a){
                        a.price = price;
                        a.volume = payment;
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
            asset entrance = ptr->entrance;
            asset min = ptr->min;
            asset max = ptr->max;

            // save current block
            ptr = summary.find(name("lastone").value);
            if (ptr == summary.end()) {
                summary.emplace(get_self(), [&](auto & a) {
                    a.label = name("lastone");
                    a.price = price;
                    a.volume = volume;
                    a.date = date;
                    a.hour = hour;
                    a.entrance = entrance;
                    a.min = min;
                    a.max = max;
                });
            } else {
                summary.modify(*ptr, get_self(), [&](auto & a){
                    a.price = price;
                    a.volume = volume;
                    a.date = date;
                    a.hour = hour;
                    a.entrance = entrance;
                    a.min = min;
                    a.max = max;
                });
            }

            // save table summary (price & volume/h)
            blockhistory blocktable(get_self(), scope.value);
            uint64_t id = blocktable.available_primary_key();
            auto index = blocktable.template get_index<name("hour")>();
            auto bptr = index.find(hour);
            if (bptr == index.end()) {
                blocktable.emplace(get_self(), [&](auto & a) {
                    a.id = id;
                    a.price = price;
                    a.volume = payment;
                    a.date = date;
                    a.hour = hour;
                    a.entrance = last_price;
                    a.min = price;
                    a.max = price;
                    if (last_price > a.max) a.max = last_price;
                    if (last_price < a.min) a.min = last_price;
                });
         
                // update how many blocks do we have
                orderstables.modify(*orders_itr, same_payer, [&](auto & a){
                    a.blocks += 1;
                });
            } else {
                blocktable.modify(*bptr, get_self(), [&](auto & a){
                    a.price = price;
                    a.volume += payment;
                    a.date = date;
                    if (price > a.max) a.max = price;
                    if (price < a.min) a.min = price;
                });
            }
      
            PRINT("vapaee::token::exchange::aux_register_transaction_in_history() ...\n");
        }

        void aux_generate_order(name owner, name type, asset total, asset price, name ram_payer) {
            PRINT("vapaee::token::exchange::aux_generate_order()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" type: ", type.to_string(), "\n");
            PRINT(" total: ", total.to_string(), "\n");
            PRINT(" price: ", price.to_string(), "\n");

            require_auth(owner);            

            // create scope for the orders table
            name scope_buy = aux_get_scope_for_tokens(total.symbol.code(), price.symbol.code());
            name scope_sell = aux_get_scope_for_tokens(price.symbol.code(), total.symbol.code());            

            PRINT(" scope_buy: ", scope_buy.to_string(), "\n");
            PRINT(" scope_sell: ", scope_sell.to_string(), "\n");
            
            asset inverse = vapaee::utils::inverse(price, total.symbol);
            asset payment = vapaee::utils::payment(total, price);
            if (type == name("sell")) {
                aux_generate_sell_order(owner, scope_sell, scope_buy, total, payment, price, inverse, ram_payer);
            } else if (type == name("buy")) {
                aux_generate_sell_order(owner, scope_buy, scope_sell, payment, total, inverse, price, ram_payer);
            } else {
                eosio_assert(false, (string("type must be 'sell' or 'buy' in lower case, got: ") + type.to_string()).c_str());
            }
            
            PRINT("vapaee::token::exchange::aux_generate_order() ...\n");
        }

        string create_error_asset1(const char * text, const asset & token1) {
            string result = string(text) + " [" + token1.to_string() + "]";
            return result;
        }

        string create_error_asset2(const char * text, const asset & token1, const asset & token2) {
            string result = string(text) + " [" + token1.to_string() + "], [" + token2.to_string()+"]";
            return result;
        }

        string create_error_asset3(const char * text, const asset & token1, const asset & token2, const asset & token3) {
            string result = string(text) + " [" + token1.to_string() + "], [" + token2.to_string()+"], [" + token3.to_string()+"]";
            return result;
        }

        string create_error_asset4(const char * text, const asset & token1, const asset & token2, const asset & token3, const asset & token4) {
            string result = string(text) + " [" + token1.to_string() + "], [" + token2.to_string()+"], [" + token3.to_string()+"], [" + token4.to_string()+"]";
            return result;
        }

        string create_error_asset5(const char * text, const asset & token1, const asset & token2, const asset & token3, const asset & token4, const asset & token5) {
            string result = string(text) + " [" + token1.to_string() + "], [" + token2.to_string()+"], [" + token3.to_string()+"], [" + token4.to_string()+"], [" + token5.to_string()+"]";
            return result;
        }

        void aux_generate_sell_order(name owner, name scope_buy, name scope_sell, asset total, asset payment, asset price, asset inverse, name ram_payer) {
            PRINT("vapaee::token::exchange::aux_generate_sell_order()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" scope_buy: ", scope_buy.to_string(), "\n");
            PRINT(" scope_sell: ", scope_sell.to_string(), "\n");
            PRINT(" total: ", total.to_string(), "\n");        // total: 1.00000000 TLOS
            PRINT(" payment: ", payment.to_string(), "\n");    // payment: 2.50000000 CNT
            PRINT(" price: ", price.to_string(), "\n");        // price: 2.50000000 CNT
            PRINT(" inverse: ", inverse.to_string(), "\n");    // inverse: 0.40000000 TLOS
            double buyer_fee_percentage = 0.001;
            double seller_fee_percentage = 0.002;
            
            sellorders buytable(get_self(), scope_buy.value);
            sellorders selltable(get_self(), scope_sell.value);

            ordertables orderstables(get_self(), get_self().value);
            auto sell_itr = orderstables.find(scope_sell.value);
            auto buy_itr = orderstables.find(scope_buy.value);

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

            
            vector<asset> deposits;
            aux_clone_user_deposits(owner, deposits);

            locks lockstable(get_self(), get_self().value);
            tokens tokenstable(get_self(), get_self().value);
            auto atk_itr = tokenstable.find(total.symbol.code().raw());
            auto ptk_itr = tokenstable.find(price.symbol.code().raw());
            eosio_assert(atk_itr != tokenstable.end(), (string("Token ") + total.symbol.code().to_string() + " not registered registered").c_str());
            eosio_assert(ptk_itr != tokenstable.end(), (string("Token ") + price.symbol.code().to_string() + " not registered registered").c_str());
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
                        current_payment.amount = (int64_t)( (double)(remaining.amount * b_ptr->selling.amount) / (double)b_ptr->total.amount);
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
                        eosio_assert(buy_itr != orderstables.end(), "table MUST exist but it does not");
                        orderstables.modify(*buy_itr, ram_payer, [&](auto & a){
                            PRINT("        a.total:  ", a.total.to_string(),"\n");
                            PRINT("        payment:  ", current_payment.to_string(),"\n");
                            eosio_assert(a.total.symbol == current_payment.symbol,
                                create_error_asset2(ERROR_AGSO_5, a.total, current_payment).c_str());
                            a.total -= current_payment;
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
                        // for (auto pp = buyerorders.begin(); pp != buyerorders.end(); pp++) {
                        //     PRINT("    pp->table: ", pp->table, scope_buy == pp->table ? " (yes) " : " (no) "," pp->orders: ", pp->orders.size(),"\n");
                        // }
                        auto buyer_itr = buyerorders.find(scope_buy.value);
                        // PRINT("    buyer: ", buyer.to_string(),"\n");
                        // PRINT("    scope_buy: ", scope_buy.to_string(),"\n");
                        eosio_assert(buyer_itr != buyerorders.end(), "ERROR: cómo que no existe? No fue registrado antes? buyer? scope_buy?");

                        // take out the registry for this completed order
                        eosio_assert(buy_itr != orderstables.end(), "table MUST exist but it does not");
                        if (buy_itr->orders > 1) {
                            buyerorders.modify(*buyer_itr, ram_payer, [&](auto & a){
                                std::vector<uint64_t> newlist;
                                std::copy_if (a.ids.begin(), a.ids.end(), std::back_inserter(newlist), [&](uint64_t i){return i!=buy_id;} );
                                a.ids = newlist;
                            });
                            orderstables.modify(*buy_itr, ram_payer, [&](auto & a){
                                a.orders--;
                                eosio_assert(a.total.symbol == current_payment.symbol,
                                    create_error_asset2(ERROR_AGSO_6, a.total, current_payment).c_str());
                                a.total -= current_payment;
                                PRINT("     orderstables.modify() a.orders--; a.total: ", a.total.to_string(),"\n");
                            });
                        } else {
                            orderstables.erase(*buy_itr);
                            buyerorders.erase(*buyer_itr);
                            PRINT("     orderstables.erase()\n");
                        }

                        buyer_itr = buyerorders.find(scope_buy.value);
                        if (buyer_itr != buyerorders.end() && buyer_itr->ids.size() == 0) {
                            buyerorders.erase(*buyer_itr);
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
                        permission_level{owner,name("active")},
                        get_self(),
                        name("swapdeposit"),
                        std::make_tuple(owner, buyer, seller_gains, string("exchange made for ") + buyer_gains.to_string())
                    ).send();
                    PRINT("     -- transfer ", seller_gains.to_string(), " to ", buyer.to_string(),"\n");
                        
                    // transfer to contractg fees on CNT
                    action(
                        permission_level{owner,name("active")},
                        get_self(),
                        name("swapdeposit"),
                        std::make_tuple(owner, get_self(), buyer_fee, string("exchange made for ") + buyer_gains.to_string())
                    ).send();
                    PRINT("     -- charge fees ", buyer_fee.to_string(), " to ", buyer.to_string(),"\n");
                        
                    // transfer to seller TLOS
                    action(
                        permission_level{get_self(),name("active")},
                        get_self(),
                        name("swapdeposit"),
                        std::make_tuple(get_self(), owner, buyer_gains, string("exchange made for ") + seller_gains.to_string())
                    ).send();
                    PRINT("     -- transfer ", buyer_gains.to_string(), " to ", owner.to_string(),"\n");

                    // charge fee to buyer
                    /*
                    action(
                        permission_level{owner,name("active")},
                        get_self(),
                        name("swapdeposit"),
                        std::make_tuple(owner, get_self(), seller_fee, string("charging order fee for ") + tlos.to_string())
                    ).send();
                    PRINT("     -- charging fee ", seller_fee.to_string(), " to ", owner.to_string(),"\n");
                    */

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
                    aux_register_transaction_in_history(buyer, seller, current_total, current_inverse, current_payment, buyer_fee, seller_fee);
                    
                } else {
                    break;
                }

                PRINT("  remaining:", remaining.to_string(),"\n");
                if (remaining.amount <= 0) break;
            }

            if (remaining.amount > 0 && remaining_payment.amount > 0) {
                PRINT("-- final remaining: ", remaining.to_string(), " --\n");
                // insert sell order
                uint64_t id = selltable.available_primary_key();
                //uint64_t next_lock = lockstable.available_primary_key();
                //PRINT("  next_lock: ", std::to_string((unsigned long long) next_lock), "\n");
                // inverse = vapaee::utils::inverse(price, amount.symbol);
                // payment.amount = (int64_t)((double)(remaining.amount * price.amount) / (double)total_unit);
                payment.amount = remaining_payment.amount;

                // transfer payment deposits to contract
                action(
                    permission_level{owner,name("active")},
                    get_self(),
                    name("swapdeposit"),
                    std::make_tuple(owner, get_self(), remaining, string("future payment for order"))
                ).send();

                PRINT("   remaining: ", remaining.to_string(), "\n");
                PRINT("   payment: ", payment.to_string(), "\n");
                PRINT("   price: ", price.to_string(), "\n");
                PRINT("   inverse: ", inverse.to_string(), "\n");

                // create order entry
                // inverse = vapaee::utils::inverse(price, remaining.symbol);
                selltable.emplace( ram_payer, [&]( auto& a ) {
                    a.id = id;
                    a.owner = owner;
                    a.price = price;
                    a.inverse = inverse;
                    a.total = payment;
                    a.selling = remaining;
                });

                // register new order in the orders table
                if (sell_itr == orderstables.end()) {
                    orderstables.emplace( ram_payer, [&]( auto& a ) {
                        a.table = scope_sell;
                        a.sell = remaining.symbol.code();
                        a.pay = payment.symbol.code();
                        a.orders = 1;
                        a.total = remaining;
                    });
                } else {
                    orderstables.modify(*sell_itr, ram_payer, [&](auto & a){
                        a.orders++;
                        a.total += remaining;
                    });
                }

                // register order in user personal order registry
                userorders userorders_table(get_self(), owner.value);
                auto user_itr = userorders_table.find(scope_sell.value);
                if (user_itr == userorders_table.end()) {
                    userorders_table.emplace( ram_payer, [&]( auto& a ) {
                        a.table = scope_sell;
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

        void action_order(name owner, name type, const asset & total, const asset & price) {
            PRINT("vapaee::token::exchange::action_order()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" type: ", type.to_string(), "\n");      
            PRINT(" total: ", total.to_string(), "\n");      
            PRINT(" price: ", price.to_string(), "\n");      
            require_auth(owner);

            aux_generate_order(owner, type, total, price, owner);

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

            // send tokens
            tokens tokenstable(get_self(), get_self().value);
            auto ptk_itr = tokenstable.find(quantity.symbol.code().raw());
            eosio_assert(ptk_itr != tokenstable.end(), (string("Token ") + quantity.symbol.code().to_string() + " not registered registered").c_str());

            action(
                permission_level{get_self(),name("active")},
                ptk_itr->contract,
                name("transfer"),
                std::make_tuple(get_self(), owner, quantity, string("withdraw deposits: ") + quantity.to_string())
            ).send();
            PRINT("   transfer ", quantity.to_string(), " to ", owner.to_string(),"\n");

            PRINT("vapaee::token::exchange::action_withdraw() ...\n");
        }
        
        void action_add_token(name contract, const symbol_code & sym_code, uint8_t precision, name ram_payer) {
            PRINT("vapaee::token::exchange::action_add_token()\n");
            PRINT(" contract: ", contract.to_string(), "\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");
            PRINT(" precision: ", std::to_string((unsigned) precision), "\n");
            PRINT(" ram_payer: ", ram_payer.to_string(), "\n");

            require_auth(ram_payer);

            tokens tokenstable(get_self(), get_self().value);
            auto itr = tokenstable.find(sym_code.raw());
            eosio_assert(itr == tokenstable.end(), "Token already registered");
            tokenstable.emplace( ram_payer, [&]( auto& a ){
                a.contract = contract;
                a.symbol = sym_code;
                a.precision = precision;
                a.appname  = "unknown";
                a.website  = "unknown";
                a.logo     = "unknown";
                a.logolg   = "unknown";
                a.verified = false;
            });
            PRINT("vapaee::token::exchange::action_add_token() ...\n");
        }

        void action_update_token_info(const symbol_code & sym_code, string appname, string website, string logo, string logolg, bool verified) {
            PRINT("vapaee::token::exchange::action_update_token_info()\n");
            PRINT(" sym_code: ", sym_code.to_string(), "\n");
            PRINT(" appname: ", appname.c_str(), "\n");
            PRINT(" website: ", website.c_str(), "\n");
            PRINT(" logo: ", logo.c_str(), "\n");
            PRINT(" logolg: ", logolg.c_str(), "\n");
            PRINT(" verified: ", std::to_string(verified), "\n");

            tokens tokenstable(get_self(), get_self().value);
            auto itr = tokenstable.find(sym_code.raw());

            eosio_assert(itr != tokenstable.end(), "Token not registered. You must register it first calling addtoken action");
            if (itr->verified) {
                eosio_assert(has_auth(get_self()), "only admin can modify a verified token");
            } else if (verified) {
                eosio_assert(has_auth(get_self()), "only admin can verify a token");
            }

            tokenstable.modify( *itr, get_self(), [&]( auto& a ){
                a.appname  = appname;
                a.website  = website;
                a.logo     = logo;
                a.logolg   = logolg;
                a.verified = verified;
            });

            PRINT("vapaee::token::exchange::action_update_token_info() ...\n");            
        }

        void action_swapdeposit(name from, name to, const asset & quantity, string memo) {
            PRINT("vapaee::token::exchange::action_swapdeposit()\n");
            PRINT(" from: ", from.to_string(), "\n");
            PRINT(" to: ", to.to_string(), "\n");
            PRINT(" quantity: ", quantity.to_string(), "\n");
            PRINT(" memo: ", memo.c_str(), "\n");
            
            eosio_assert( from != to, "cannot swap deposits to self" );
            require_auth( from );
            /*if (to == get_self()) {
                PRINT("   to == get_self()  ---> require_auth( to ): ", to.to_string(), "\n");
                require_auth( to );
            } else {
                PRINT("   to == get_self()  ---> require_auth( from ): ", from.to_string(), "\n");
                require_auth( from );
            }*/
            
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
            auto ram_payer = has_auth( to ) ? to : from;

            aux_substract_deposits(from, quantity, ram_payer);
            aux_add_deposits(to, quantity, ram_payer);
            
            PRINT("vapaee::token::exchange::action_swapdeposit() ...\n"); 
        }        

        void handler_transfer(name from, name to, asset quantity, string memo) {
            // skipp handling outcoming transfers from this contract to outside
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
                quantity = aux_extend_asset(quantity);
                PRINT(" quantity extended: ", quantity.to_string(), "\n");
                aux_add_deposits(receiver, quantity, get_self());
            }

            PRINT("vapaee::token::exchange::handler_transfer() ...\n");
        }

        void action_cancel(name owner, name type, const symbol_code & token_a, const symbol_code & token_p, const std::vector<uint64_t> & orders) {
            PRINT("vapaee::token::exchange::action_cancel()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" type: ", type.to_string(), "\n");
            PRINT(" token_a: ",  token_a.to_string(), "\n");
            PRINT(" token_p: ",  token_p.to_string(), "\n");
            PRINT(" orders.size(): ", std::to_string((int) orders.size()), "\n");

            require_auth(owner);

            // create scope for the orders table
            name scope_buy = aux_get_scope_for_tokens(token_a, token_p);
            name scope_sell = aux_get_scope_for_tokens(token_p, token_a);

            if (type == name("sell")) {
                aux_cancel_sell_order(owner, scope_buy, orders);
            }

            if (type == name("buy")) {
                aux_cancel_sell_order(owner, scope_sell, orders);
            }

            PRINT("vapaee::token::exchange::action_cancel() ...\n");
        }

        void aux_cancel_sell_order(name owner, name scope, const std::vector<uint64_t> & orders) {
            PRINT("vapaee::token::exchange::aux_cancel_sell_order()\n");
            PRINT(" owner: ", owner.to_string(), "\n");
            PRINT(" scope: ", scope.to_string(), "\n");
            PRINT(" orders.size(): ", orders.size(), "\n");

            sellorders selltable(get_self(), scope.value);
            asset return_amount;
            
            ordertables orderstables(get_self(), get_self().value);
            auto order_itr = orderstables.find(scope.value);
            
            

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
                auto buyer_itr = buyerorders.find(scope.value);
                
                eosio_assert(buyer_itr != buyerorders.end(), "ERROR: cómo que no existe? No fue registrado antes?");

                // take out the registry for this completed order
                eosio_assert(order_itr != orderstables.end(), "ordertable does not exist for that scope");
                if (order_itr->orders > 1) {
                    buyerorders.modify(*buyer_itr, same_payer, [&](auto & a){
                        std::vector<uint64_t> newlist;
                        std::copy_if (a.ids.begin(), a.ids.end(), std::back_inserter(newlist), [&](uint64_t i){return i!=order_id;} );
                        a.ids = newlist;
                    });
                    orderstables.modify(*order_itr, same_payer, [&](auto & a){
                        a.orders--;
                        a.total -= return_amount;
                    });
                } else {
                    orderstables.erase(*order_itr);
                    buyerorders.erase(*buyer_itr);
                }               

                action(
                    permission_level{get_self(),name("active")},
                    get_self(),
                    name("swapdeposit"),
                    std::make_tuple(get_self(), owner, return_amount, string("order canceled, payment returned"))
                ).send();
            }

            userorders buyerorders(get_self(), owner.value);
            auto buyer_itr = buyerorders.find(scope.value);
            if (buyer_itr != buyerorders.end() && buyer_itr->ids.size() == 0) {
                buyerorders.erase(*buyer_itr);
            }
        }

        void action_droptokens() {
            PRINT("vapaee::token::exchange::action_droptokens()\n");

            require_auth(get_self());
            
            tokens tokenstable(get_self(), get_self().value);
            
            for (auto itr = tokenstable.begin(); itr != tokenstable.end(); itr = tokenstable.begin()) {
                tokenstable.erase(*itr);
            }
            
            PRINT("vapaee::token::exchange::action_droptokens() ...\n");
        }

        void action_clear_tables_orders_and_history() {
            PRINT("vapaee::token::exchange::action_clear_tables_orders_and_history()\n");
            require_auth(get_self());

            ordertables orderstables(get_self(), get_self().value);
            for (auto orders = orderstables.begin(); orders != orderstables.end(); orders = orderstables.begin()) {
                PRINT(" -- deleting table: ", orders->table.to_string(),"\n");

                tablesummary summary(get_self(), orders->table.value);
                for (auto s_itr = summary.begin(); s_itr != summary.end(); s_itr = summary.begin()) {
                    PRINT("   -- deleting summary: ", s_itr->label.to_string(),"\n");
                    summary.erase(*s_itr);
                }
                
                history history_table(get_self(), orders->table.value);
                for (auto h_itr = history_table.begin(); h_itr != history_table.end(); h_itr = history_table.begin()) {
                    PRINT("   -- deleting history: ", std::to_string((unsigned long long)h_itr->id),"\n");
                    history_table.erase(*h_itr);
                }

                sellorders selltable(get_self(), orders->table.value);
                for (auto order = selltable.begin(); order != selltable.end(); order = selltable.begin()) {
                    aux_cancel_sell_order(order->owner, orders->table, {order->id});
                }
            }
            
            PRINT("vapaee::token::exchange::action_clear_tables_orders_and_history() ...\n");
        }        

        void action_return_all_deposits() {
            PRINT("vapaee::token::exchange::action_return_all_deposits()\n");
            require_auth(get_self());

            depusers depuserstable(get_self(), get_self().value);
            
            for (auto user_itr = depuserstable.begin(); user_itr != depuserstable.end(); user_itr = depuserstable.begin()) {
                name user = user_itr->account;
                if (user == get_self()) continue;
                depuserstable.erase(*user_itr);

                deposits depositstable(get_self(), user.value);
                for (auto dep_itr = depositstable.begin(); dep_itr != depositstable.end(); dep_itr = depositstable.begin()) {
                    asset quantity = dep_itr->amount;
                    depositstable.erase(*dep_itr);

                    // send tokens
                    tokens tokenstable(get_self(), get_self().value);
                    auto ptk_itr = tokenstable.find(quantity.symbol.code().raw());
                    eosio_assert(ptk_itr != tokenstable.end(), (string("Token ") + quantity.symbol.code().to_string() + " not registered registered").c_str());

                    action(
                        permission_level{get_self(),name("active")},
                        ptk_itr->contract,
                        name("transfer"),
                        std::make_tuple(get_self(), user, quantity, string("withdraw deposits: ") + quantity.to_string())
                    ).send();
                    PRINT("   transfer ", quantity.to_string(), " to ", user.to_string(),"\n");
                }
            }

            PRINT("vapaee::token::exchange::action_return_all_deposits() ...\n");
        }
        
        void action_cancel_all_orders() {
            PRINT("vapaee::token::exchange::action_cancel_all_orders()\n");
            require_auth(get_self());

            ordertables orderstables(get_self(), get_self().value);
            for (auto orders = orderstables.begin(); orders != orderstables.end(); orders = orderstables.begin()) {
                PRINT(" -- deleting table: ", orders->table.to_string(),"\n");
                sellorders selltable(get_self(), orders->table.value);
                for (auto order = selltable.begin(); order != selltable.end(); order = selltable.begin()) {
                    aux_cancel_sell_order(order->owner, orders->table, {order->id});
                }
            }
            
            PRINT("vapaee::token::exchange::action_cancel_all_orders() ...\n");
        }

        void action_hotfix(int num, name account, asset quantity) {
            PRINT("vapaee::token::exchange::action_poblate_user_orders_table()\n");
            require_auth(get_self());
            int count = 0; 

            // Borrar ordertables
            // tokens table0(get_self(), get_self().value);
            // for (auto ptr = table0.begin(); ptr != table0.end(); ptr = table0.begin()) {
            //     table0.erase(*ptr);
            //     if (count++ > num) break;
            // }

            // Borrar ordertables
            // ordertables table(get_self(), get_self().value);
            // for (auto ptr = table.begin(); ptr != table.end(); ptr = table.begin()) {
            //     table.erase(*ptr);
            //     if (count++ > num) break;
            // }

            // Update ordertables
            // ordertables table1(get_self(), get_self().value);
            // auto ptr = table1.find(name("olive.tlos").value);
            // table1.modify(*ptr, same_payer, [&](auto & a){
            //     a.blocks = 2;
            //     a.deals = 5;
            // });

            // Delete fake Tokens balance
            // auto sym = quantity.symbol;
            // stats statstable( _self, sym.code().raw() );
            // auto existing = statstable.find( sym.code().raw() );
            // eosio_assert( existing != statstable.end(), "token with symbol does not exist" );
            // const auto& st = *existing;
            // eosio_assert( quantity.is_valid(), "invalid quantity" );
            // eosio_assert( quantity.amount > 0, "must retire positive quantity" );
            // eosio_assert( quantity.symbol == st.supply.symbol, "symbol precision mismatch" );
            // statstable.modify( st, same_payer, [&]( auto& s ) {
            //     s.supply -= quantity;
            // });
            // accounts acnts( _self, account.value );
            // auto it = acnts.find( quantity.symbol.code().raw() );
            // eosio_assert( it != acnts.end(), "Balance row already deleted or never existed. Action won't have any effect." );
            // acnts.erase( it );


            // Borrar earnings
            // earnings table1(get_self(), get_self().value);
            // auto eptr_1 = table1.find(symbol_code("AAA").raw());
            // auto eptr_2 = table1.find(symbol_code("BBB").raw());
            // auto eptr_3 = table1.find(symbol_code("CCC").raw());
            // auto eptr_4 = table1.find(symbol_code("DDD").raw());
            // auto eptr_5 = table1.find(symbol_code("EEE").raw());
            // auto eptr_6 = table1.find(symbol_code("FFF").raw());
            // if (eptr_1 != table1.end()) table1.erase(*eptr_1);
            // if (eptr_2 != table1.end()) table1.erase(*eptr_2);
            // if (eptr_3 != table1.end()) table1.erase(*eptr_3);
            // if (eptr_4 != table1.end()) table1.erase(*eptr_4);
            // if (eptr_5 != table1.end()) table1.erase(*eptr_5);
            // if (eptr_6 != table1.end()) table1.erase(*eptr_6);            

            
 
            // Borrar history
            // history table2(get_self(), account.value);
            // for (auto ptr = table2.begin(); ptr != table2.end(); ptr = table2.begin()) {
            //     table2.erase(*ptr);
            //     if (count++ > num) break;
            // }
             
            // Borrar blocks
            // blockhistory table3(get_self(), account.value);
            // for (auto ptr = table3.begin(); ptr != table3.end(); ptr = table3.begin()) {
            //     table3.erase(*ptr);
            //     if (count++ > num) break;
            // }
            
            // Borrar blocks
            // tablesummary table4(get_self(), account.value);
            // for (auto ptr = table4.begin(); ptr != table4.end(); ptr = table4.begin()) {
            //     table4.erase(*ptr);
            //     if (count++ > num) break;
            // }

            // Borrar deposits
            // deposits table5(get_self(), account.value);
            // for (auto ptr = table5.begin(); ptr != table5.end(); ptr = table5.begin()) {
            //     table5.erase(*ptr);
            //     if (count++ > num) break;
            // }

            // Borrar earnings
            // earnings table6(get_self(), get_self().value);
            // for (auto ptr = table6.begin(); ptr != table6.end(); ptr = table6.begin()) {
            //     table6.erase(*ptr);
            //     if (count++ > num) break;
            // }

            
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