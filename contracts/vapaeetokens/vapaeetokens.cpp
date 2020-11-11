#include "vapaeetokens.hpp"

#define TOKEN_ACTIONS (create)(addissuer)(removeissuer)(issue)(transfer)(open)(close)(burn)
#define EXCHANGE_ACTIONS (addui)(updateui)(addtoken)(updatetoken)(tokenadmin)(setcurrency)(settokendata)(edittkevent)(order)(withdraw)(swapdeposit)(cancel)(deps2earn)
// #define AIRDROP_ACTIONS (setsnapshot)(claim)
//#define STAKE_ACTIONS (stake)(unstake)(restake)(unstakeback)(unstaketime)

// #define TOKEN_ACTIONS (create)
// #define EXCHANGE_ACTIONS
#define AIRDROP_ACTIONS 
#define STAKE_ACTIONS 


#define EXCHANGE_HANDLERS (htransfer)
// #define EXCHANGE_HANDLERS

#define DEBUG_ACTIONS (hotfix)
// #define DEBUG_ACTIONS

EOSIO_DISPATCH_VAPAEE (
    vapaee::vapaeetokens,
    TOKEN_ACTIONS AIRDROP_ACTIONS EXCHANGE_ACTIONS STAKE_ACTIONS AUX_DEBUG_ACTIONS(DEBUG_ACTIONS),
    EXCHANGE_HANDLERS
)