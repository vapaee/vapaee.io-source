#pragma once

#include <eosiolib/contracts/eosio/eosio.hpp>
#include <eosiolib/core/eosio/symbol.hpp>
#include <eosiolib/core/eosio/asset.hpp>
#include <eosiolib/core/eosio/print.hpp>
#include <eosiolib/contracts/eosio/transaction.hpp>

using namespace eosio;
using namespace std;

#define PRINT(...) print(__VA_ARGS__)
#define AUX_DEBUG_ACTIONS(...) __VA_ARGS__

CONTRACT eventhandler : public eosio::contract {

    public:
        using contract::contract;

        ACTION dexevent( name event, name user, name peer, const asset & quantity, const asset & payment, const asset & price) {
            PRINT("vapaee::eventhandler::dexevent()\n");
            PRINT(" event: ",  event.to_string(), "\n");
            PRINT(" user: ",  user.to_string(), "\n");
            PRINT(" peer: ",  peer.to_string(), "\n");
            PRINT(" quantity: ",  quantity.to_string(), "\n");
            PRINT(" payment: ",  payment.to_string(), "\n");
            PRINT(" price: ",  price.to_string(), "\n");
            PRINT("vapaee::eventhandler::dexevent()...\n");
        }
};


EOSIO_DISPATCH ( eventhandler, (dexevent) )