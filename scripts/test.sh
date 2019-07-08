#!/bin/bash

token1=cnt
TOKEN1=CNT
if [ "$1" != "" ]; then
if [ "$1" != "test" ]; then
if [ "$1" != "prod" ]; then
   token1=$1
   token1=${token,,}
   TOKEN1=${token^^}
fi
fi
fi

token2=robo
TOKEN2=ROBO
if [ "$2" != "" ]; then
if [ "$2" != "test" ]; then
if [ "$2" != "prod" ]; then
   token2=$1
   token2=${token,,}
   TOKEN2=${token^^}
fi
fi
fi

if [ "$1" == "prod" ]; then
   NET='--url https://telos.eos.barcelona'
fi

if [ "$2" == "prod" ]; then
   NET='--url https://telos.eos.barcelona'
fi

if [ "$3" == "prod" ]; then
   NET='--url https://telos.eos.barcelona'
fi

show_balance() {
    user=$1
    echo "********* balances for $user -------------------------------------------------"
    cleos $NET get currency balance vapaeetokens $user $TOKEN
    cleos $NET get currency balance eosio.token $user TLOS
    cleos $NET get currency balance eosio.token $user ACORN
    cleos $NET get currency balance vapaeetokens $user BOX
    echo " -- deposits --"
    cleos $NET get table vapaeetokens $user deposits
    echo " -- userorders --"
    cleos $NET get table vapaeetokens $user userorders
}

show_table() {
    code=$1
    scope=$2
    table=$3

    echo "--------- $code::$table($scope) -------------------------------------------------"
    cleos $NET get table $code $scope $table -l 1000
}


show_table vapaeetokens vapaeetokens ordertables
show_table vapaeetokens vapaeetokens ordersummary

show_table vapaeetokens $token2.$token1 sellorders
show_table vapaeetokens $token1.$token2 sellorders