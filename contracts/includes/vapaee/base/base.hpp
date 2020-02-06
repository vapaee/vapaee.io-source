#pragma once
#include <eosiolib/contracts/eosio/eosio.hpp>
#include <eosiolib/core/eosio/symbol.hpp>
#include <eosiolib/core/eosio/asset.hpp>
#include <eosiolib/core/eosio/print.hpp>
#include <eosiolib/contracts/eosio/transaction.hpp>
#include <eosiolib/core/eosio/check.hpp>

// #include <eosiolib/singleton.hpp>

// defining namespaces 
using namespace eosio;

namespace vapaee {
    namespace bgbox {
        static name contract = eosio::name("boardgamebox");
    };
    namespace token {
        static name contract = eosio::name("vapaeetokens");
    };
    namespace cnt {
        static name contract = eosio::name("cardsntokens");
    };
    namespace utils {}
};

using namespace vapaee;
using namespace bgbox;
using namespace cnt;
using namespace utils;

#include <vapaee/base/slug.hpp>
#include <vapaee/base/slug_asset.hpp>
#include <vapaee/base/slug_symbol.hpp>
#include <vapaee/base/utils.hpp>

// #define current_time current_time_point

/*
#define MAINTENANCE(...) check(has_auth(_self), ">>>>>> This contract is in MAINTENANCE. Please, try later again. <<<<<<");
/*/
#define MAINTENANCE(...)
//*/


//*
#define PRINT(...) print(__VA_ARGS__)
#define AUX_DEBUG_ACTIONS(...) __VA_ARGS__
/*/
#define PRINT(...)
#define AUX_DEBUG_ACTIONS(...)
//*/