#!/bin/bash
./1_create_accounts.sh

./2_deploy_vapaeetokens.sh

./3_load_tokens.sh

./4_register_interfaces.sh

./5_deposits.sh


echo "----------------------------------"
echo "-------------- TEST --------------"
echo "----------------------------------"
sleep 1

echo "-- alice sells CNT --"
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 CNT", "1.00000000 TLOS",0]' -p alice


echo "-- bob buys CNT --"
cleos push action vapaeetokens order '["bob", "buy", "1.00000000 CNT", "1.00000000 TLOS",0]' -p bob

echo "-- vapaee balance --"
cleos get currency balance eosio.token vapaee TLOS
cleos get currency balance vapaeetokens vapaee CNT

echo "-- sqrl balance --"
cleos get currency balance eosio.token sqrl TLOS
cleos get currency balance vapaeetokens sqrl CNT

