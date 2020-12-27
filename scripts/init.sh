#!/bin/bash
# rm /var/www/blockchain/eosio/data -fr




./1_create_accounts.sh

sleep 1

./2_deploy_vapaeetokens.sh

sleep 1

./3_load_tokens.sh

sleep 1

./4_register_interfaces.sh

sleep 1

./5_deposits.sh

sleep 1

./6_orders.sh