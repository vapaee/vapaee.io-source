#!/bin/bash
# rm /var/www/blockchain/eosio/data -fr

# cleos wallet import
# eosio: 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
# cleos wallet import
# dev: 5J1astpVJcAJVGX8PGWN9KCcHU5DMszi4gJgCEpWc5DxmpTsKqp

cleos create account eosio eosio.token EOS8RoCAXxWYUW2v4xkG19F57BDVBzpt9NN2iDsD1ouQNyV2BkiNc
cleos create account eosio eosio.trail EOS8RoCAXxWYUW2v4xkG19F57BDVBzpt9NN2iDsD1ouQNyV2BkiNc

cleos create account eosio vapaeetokens EOS8RoCAXxWYUW2v4xkG19F57BDVBzpt9NN2iDsD1ouQNyV2BkiNc

cleos create account eosio bob EOS8RoCAXxWYUW2v4xkG19F57BDVBzpt9NN2iDsD1ouQNyV2BkiNc
cleos create account eosio alice EOS8RoCAXxWYUW2v4xkG19F57BDVBzpt9NN2iDsD1ouQNyV2BkiNc
cleos create account eosio tom EOS8RoCAXxWYUW2v4xkG19F57BDVBzpt9NN2iDsD1ouQNyV2BkiNc
cleos create account eosio kate EOS8RoCAXxWYUW2v4xkG19F57BDVBzpt9NN2iDsD1ouQNyV2BkiNc

#cleos set account permission vapaeetokens active '{"threshold": 1,"keys": [{"key": "EOS8RoCAXxWYUW2v4xkG19F57BDVBzpt9NN2iDsD1ouQNyV2BkiNc","weight": 1}],"accounts": [{"permission":{"actor":"vapaeetokens","permission":"eosio.code"},"weight":1}]}' owner -p vapaeetokens




