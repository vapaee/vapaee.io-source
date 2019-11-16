#!/bin/bash
# rm /var/www/blockchain/eosio/data -fr




./1_create_accounts.sh

./2_deploy_vapaeetokens.sh

./3_load_tokens.sh

./4_test_exchange.sh