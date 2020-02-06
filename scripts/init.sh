#!/bin/bash
# rm /var/www/blockchain/eosio/data -fr




./1_create_accounts.sh

./2_deploy_vapaeetokens.sh

./3_load_tokens.sh

./4_register_interfaces.sh

./5_deposits.sh

./6_orders.sh