#!/bin/bash

token=cnt
TOKEN=CNT
if [ "$1" != "" ]; then
if [ "$1" != "test" ]; then
if [ "$1" != "prod" ]; then
   token=$1
   token=${token,,}
   TOKEN=${token^^}
fi
fi
fi

NET=
if [ "$1" == "test" ]; then
   NET='--url https://testnet.telos.caleos.io'
fi

if [ "$2" == "test" ]; then
   NET='--url https://testnet.telos.caleos.io'
fi

if [ "$1" == "prod" ]; then
   NET='--url https://telos.eos.barcelona'
fi

if [ "$2" == "prod" ]; then
   NET='--url https://telos.eos.barcelona'
fi


show_table() {
    code=$1
    scope=$2
    table=$3

    echo "--------- $code::$table($scope) -------------------------------------------------"
    cleos $NET get table $code $scope $table -l 10000
}

show_table vapaeetokens $token.tlos blockhistory