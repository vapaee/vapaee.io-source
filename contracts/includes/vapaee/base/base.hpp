#pragma once
#include <eosiolib/eosio.hpp>
#include <eosiolib/symbol.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/print.hpp>
#include <eosiolib/transaction.hpp>
#include <eosiolib/singleton.hpp>

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

/*
#define MAINTENANCE(...) eosio_assert(has_auth(_self), ">>>>>> This contract is in MAINTENANCE. Please, try later again. <<<<<<");
/*/
#define MAINTENANCE(...)
//*/


/*
#define PRINT(...) print(__VA_ARGS__)
#define AUX_DEBUG_ACTIONS(...) __VA_ARGS__
/*/
#define PRINT(...)
#define AUX_DEBUG_ACTIONS(...)
//*/