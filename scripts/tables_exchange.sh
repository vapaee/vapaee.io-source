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

show_balance() {
    user=$1
    echo "balances for $user -------------------------------------------------"
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

show_table vapaeetokens vapaeetokens tokens

show_table vapaeetokens 4 sellorders
show_table vapaeetokens 5 sellorders

# if [ "$NET" == "" ]; then
#     show_balance bob
#     show_balance alice
#     show_balance tom
#     show_balance kate   
# fi
# show_balance vapaeetokens
# show_balance viterbotelos

show_table vapaeetokens vapaeetokens depusers
show_table vapaeetokens vapaeetokens ordersummary
show_table vapaeetokens vapaeetokens earnings
show_table vapaeetokens vapaeetokens markets
# show_table vapaeetokens vapaeetokens events
show_table vapaeetokens 8 history
show_table vapaeetokens 8 tablesummary
show_table vapaeetokens 8 blockhistory
# show_table vapaeetokens vapaeetokens events


# show_table vapaeetokens tlos.$token tablesummary
# show_table vapaeetokens tlos.$token history
# show_table vapaeetokens box.tlos tablesummary
# show_table vapaeetokens box.tlos history
