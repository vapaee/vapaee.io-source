#!/bin/bash
NET='--url https://telos.eos.barcelona'

show_balance() {
    user=$1
    echo "balances for $user -------------------------------------------------"
    cleos $NET get currency balance eosio.token $user TLOS
    cleos $NET get currency balance vapaeetokens $user CNT
    cleos $NET get currency balance vapaeetokens $user VPE
    cleos $NET get currency balance vapaeetokens $user BOX
    cleos $NET get currency balance revelation21 $user HEART
    cleos $NET get currency balance acornaccount $user ACORN
    cleos $NET get currency balance oliveaccount $user OLIVE
    cleos $NET get currency balance telosdacdrop $user TLOSDAC
    cleos $NET get currency balance ednazztokens $user EDNA
    cleos $NET get currency balance teachology14 $user TEACH
    cleos $NET get currency balance proxibotstkn $user ROBO
    cleos $NET get currency balance qubicletoken $user QBE
    cleos $NET get currency balance stablecoin.z $user EZAR
    cleos $NET get table vapaeetokens $user deposits
}

show_balance bigsquirrel1
show_balance blackpanther
show_balance eatschools11
show_balance eatscience14
show_balance everlush1234
show_balance foflexitytls
show_balance ge2damjqgage
show_balance ge4dombuhege
show_balance ge4tenjsg4ge
show_balance ghtdghvfkzfo
show_balance nofiatneeded
show_balance numerumnovem
show_balance rogerjdavies
show_balance rorymapstone
show_balance ryaninrussia
show_balance squirrelboss
show_balance stevensteven
show_balance tcrp11111344
show_balance user11111111
show_balance user22222222
show_balance user33333333
show_balance vapaeetokens
show_balance viterbotelos
show_balance heydqnjzgene