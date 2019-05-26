#include "vapaeetokens.hpp"

#define TOKEN_ACTIONS (create)(addissuer)(removeissuer)(issue)(transfer)(open)(close)(burn)
#define AIRDROP_ACTIONS (setsnapshot)(claim)
#define EXCHANGE_ACTIONS (addtoken)(updatetoken)(order)(withdraw)(swapdeposit)(cancel)(deps2earn)(dotick)
#define STAKE_ACTIONS (stake)(unstake)(restake)(unstakeback)(unstaketime)

#define EXCHANGE_HANDLERS (htransfer)

#define DEBUG_ACTIONS (droptokens)(cancelall)(returnall)(cleartables)(hotfix)

EOSIO_DISPATCH_VAPAEETOKENS(
    vapaee::vapaeetokens,
    TOKEN_ACTIONS AIRDROP_ACTIONS EXCHANGE_ACTIONS STAKE_ACTIONS AUX_DEBUG_ACTIONS(DEBUG_ACTIONS),
    EXCHANGE_HANDLERS
)