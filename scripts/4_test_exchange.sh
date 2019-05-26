#!/bin/bash

echo "-- deposits --"
cleos push action eosio.token transfer  '["bob",  "vapaeetokens","50.0000 ACORN","deposit"]' -p bob@active
cleos push action eosio.token transfer  '["alice","vapaeetokens","10.0000 ACORN","deposit"]' -p alice@active
cleos push action eosio.token transfer  '["tom",  "vapaeetokens","50.0000 ACORN","deposit"]' -p tom@active
cleos push action eosio.token transfer  '["kate", "vapaeetokens","50.0000 ACORN","deposit"]' -p kate@active

cleos push action eosio.token transfer  '["bob",  "vapaeetokens","100.0000 QBE","deposit"]' -p bob@active
cleos push action eosio.token transfer  '["alice","vapaeetokens","100.0000 QBE","deposit"]' -p alice@active
cleos push action eosio.token transfer  '["tom",  "vapaeetokens","100.0000 QBE","deposit"]' -p tom@active
cleos push action eosio.token transfer  '["kate", "vapaeetokens","100.0000 QBE","deposit"]' -p kate@active

cleos push action eosio.token transfer  '["bob",  "vapaeetokens","100.0000 EDNA","deposit"]' -p bob@active
cleos push action eosio.token transfer  '["alice","vapaeetokens","100.0000 EDNA","deposit"]' -p alice@active
cleos push action eosio.token transfer  '["tom",  "vapaeetokens","100.0000 EDNA","deposit"]' -p tom@active
cleos push action eosio.token transfer  '["kate", "vapaeetokens","100.0000 EDNA","deposit"]' -p kate@active

cleos push action eosio.token transfer  '["bob",  "vapaeetokens","100.0000 ROBO","deposit"]' -p bob@active
cleos push action eosio.token transfer  '["alice","vapaeetokens","100.0000 ROBO","deposit"]' -p alice@active
cleos push action eosio.token transfer  '["tom",  "vapaeetokens","100.0000 ROBO","deposit"]' -p tom@active
cleos push action eosio.token transfer  '["kate", "vapaeetokens","100.0000 ROBO","deposit"]' -p kate@active

cleos push action eosio.token transfer  '["bob",  "vapaeetokens","100.0000 VIITA","deposit"]' -p bob@active
cleos push action eosio.token transfer  '["alice","vapaeetokens","100.0000 VIITA","deposit"]' -p alice@active
cleos push action eosio.token transfer  '["tom",  "vapaeetokens","100.0000 VIITA","deposit"]' -p tom@active
cleos push action eosio.token transfer  '["kate", "vapaeetokens","100.0000 VIITA","deposit"]' -p kate@active

cleos push action eosio.token transfer  '["bob",  "vapaeetokens","100.0000 TEACH","deposit"]' -p bob@active
cleos push action eosio.token transfer  '["alice","vapaeetokens","100.0000 TEACH","deposit"]' -p alice@active
cleos push action eosio.token transfer  '["tom",  "vapaeetokens","100.0000 TEACH","deposit"]' -p tom@active
cleos push action eosio.token transfer  '["kate", "vapaeetokens","100.0000 TEACH","deposit"]' -p kate@active

cleos push action vapaeetokens transfer '["bob",  "vapaeetokens","100.0000 CNT","deposit"]' -p bob@active
cleos push action vapaeetokens transfer '["alice","vapaeetokens","1000.0000 CNT","deposit"]' -p alice@active
cleos push action vapaeetokens transfer '["kate", "vapaeetokens","100.0000 CNT","deposit"]' -p kate@active

cleos push action eosio.token transfer  '["bob",  "vapaeetokens","100.0000 TLOS","deposit"]' -p bob@active
cleos push action eosio.token transfer  '["alice","vapaeetokens","1000.0000 TLOS","deposit"]' -p alice@active
cleos push action eosio.token transfer  '["kate", "vapaeetokens","100.0000 TLOS","deposit"]' -p kate@active
cleos push action eosio.token transfer  '["tom",  "vapaeetokens","1000.0000 TLOS","deposit"]' -p tom@active

cleos push action vapaeetokens transfer  '["bob",  "vapaeetokens","1000.0000 BOX","deposit"]' -p bob@active
cleos push action vapaeetokens transfer  '["alice","vapaeetokens","1000.0000 BOX","deposit"]' -p alice@active

echo "-- alice sells CNT --"
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.40000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.41000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.42000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.43000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.44000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.45000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.46000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.47000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.48000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.49000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.50000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.51000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.52000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.53000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.54000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.55000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.56000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.57000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.58000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 CNT", "0.59000000 TLOS"]' -p alice

echo "-- alice buys CNT --"
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.10000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.11000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.12000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.13000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.14000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.15000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.16000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.17000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.18000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.19000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.20000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.21000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.22000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.23000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.24000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.25000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.26000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.27000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.28000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 CNT", "0.29000000 TLOS"]' -p alice

echo "-- alice sells BOX --"
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.40000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.41000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.42000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.43000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.44000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.45000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.46000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.47000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.48000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.49000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.50000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.51000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.52000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.53000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.54000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.55000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.56000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.57000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.58000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 BOX", "0.59000000 TLOS"]' -p alice

echo "-- alice buys BOX --"
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.10000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.11000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.12000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.13000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.14000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.15000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.16000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.17000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.18000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.19000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.20000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.21000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.22000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.23000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.24000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.25000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.26000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.27000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.28000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 BOX", "0.29000000 TLOS"]' -p alice


echo "-- alice sells QBE --"
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.40000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.41000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.42000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.43000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.44000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.45000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.46000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.47000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.48000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.49000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.50000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.51000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.52000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.53000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.54000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.55000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.56000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.57000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.58000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 QBE", "0.59000000 TLOS"]' -p alice

echo "-- alice buys QBE --"
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.10000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.11000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.12000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.13000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.14000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.15000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.16000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.17000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.18000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.19000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.20000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.21000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.22000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.23000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.24000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.25000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.26000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.27000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.28000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 QBE", "0.29000000 TLOS"]' -p alice




echo "-- alice sells EDNA --"
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.40000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.41000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.42000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.43000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.44000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.45000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.46000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.47000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.48000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.49000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.50000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.51000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.52000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.53000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.54000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.55000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.56000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.57000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.58000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 EDNA", "0.59000000 TLOS"]' -p alice

echo "-- alice buys EDNA --"
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.10000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.11000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.12000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.13000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.14000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.15000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.16000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.17000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.18000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.19000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.20000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.21000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.22000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.23000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.24000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.25000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.26000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.27000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.28000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 EDNA", "0.29000000 TLOS"]' -p alice




echo "-- alice sells ROBO --"
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.40000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.41000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.42000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.43000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.44000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.45000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.46000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.47000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.48000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.49000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.50000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.51000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.52000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.53000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.54000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.55000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.56000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.57000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.58000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 ROBO", "0.59000000 TLOS"]' -p alice

echo "-- alice buys ROBO --"
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.10000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.11000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.12000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.13000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.14000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.15000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.16000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.17000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.18000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.19000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.20000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.21000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.22000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.23000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.24000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.25000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.26000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.27000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.28000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 ROBO", "0.29000000 TLOS"]' -p alice





echo "-- alice sells TEACH --"
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.40000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.41000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.42000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.43000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.44000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.45000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.46000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.47000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.48000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.49000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.50000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.51000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.52000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.53000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.54000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.55000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.56000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.57000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.58000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "5.00000000 TEACH", "0.59000000 TLOS"]' -p alice

echo "-- alice buys TEACH --"
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.10000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.11000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.12000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.13000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.14000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.15000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.16000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.17000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.18000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.19000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.20000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.21000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.22000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.23000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.24000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.25000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.26000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.27000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.28000000 TLOS"]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "5.00000000 TEACH", "0.29000000 TLOS"]' -p alice





# telosmain push action vapaeetokens cancel '["viterbotelos", "buy", "DDD", "TLOS", [0]]' -p viterbotelos

#
#echo "-- 1 sell orders -> 1 buy order --"
#sleep 2
#cleos push action vapaeetokens order '["alice", "buy", "2.50000000 CNT", "0.40000000 TLOS"]' -p alice
#cleos push action vapaeetokens order '["bob", "sell",  "2.50000000 CNT", "0.40000000 TLOS"]' -p bob
# 
#echo "-- 3 buy orders --"
#sleep 2
#cleos push action vapaeetokens order '["alice", "buy", "5.00000000 CNT", "0.20000000 TLOS"]' -p alice
#cleos push action vapaeetokens order '["alice", "buy","10.00000000 CNT", "0.10000000 TLOS"]' -p alice
#cleos push action vapaeetokens order '["alice", "buy", "2.50000000 CNT", "0.40000000 TLOS"]' -p alice
#  
#echo "-- 1 sell and 2 cancels --"
#sleep 2
#cleos push action vapaeetokens order '["bob",  "sell", "2.50000000 CNT", "0.40000000 TLOS"]' -p bob
#cleos push action vapaeetokens cancel '["alice", "buy", "CNT", "TLOS", [1,0]]' -p alice
# 
#echo "-- 3 orders --"
#sleep 2
#cleos push action vapaeetokens order '["alice", "buy", "5.00000000 CNT", "0.02000000 TLOS"]' -p alice
#cleos push action vapaeetokens order '["alice", "buy","10.00000000 CNT", "0.01000000 TLOS"]' -p alice
#cleos push action vapaeetokens order '["alice", "buy", "2.50000000 CNT", "0.04000000 TLOS"]' -p alice
# 
#echo "-- 1 buy and overflows --"
#sleep 2
#cleos push action vapaeetokens order '["bob",  "sell", "5.00000000 CNT", "0.04000000 TLOS"]' -p bob
#cleos push action vapaeetokens cancel '["bob", "sell", "CNT", "TLOS", [0]]' -p bob
#cleos push action vapaeetokens cancel '["alice", "buy", "CNT", "TLOS", [0,1]]' -p alice
#
#echo "-- 3 orders --"
#sleep 2
#cleos push action vapaeetokens order '["alice", "buy", "4.00000000 CNT", "0.20000000 TLOS"]' -p alice
#cleos push action vapaeetokens order '["alice", "buy", "8.00000000 CNT", "0.10000000 TLOS"]' -p alice
#cleos push action vapaeetokens order '["alice", "buy", "2.00000000 CNT", "0.40000000 TLOS"]' -p alice
#### --------- vapaeetokens::sellorders(tlos.cnt) -------------------------------------------------
#### {
####   "rows": [{
####       "id": 0,
####       "owner": "alice",
####       "price": "5.00000000 CNT",
####       "total": "4.00000000 CNT",
####       "selling": "0.80000000 TLOS",
####       "fee": "0.08000000 TLOS"
####     },{
####       "id": 1,
####       "owner": "alice",
####       "price": "10.00000000 CNT",
####       "total": "8.00000000 CNT",
####       "selling": "0.80000000 TLOS",
####       "fee": "0.08000000 TLOS"
####     },{
####       "id": 2,
####       "owner": "alice",
####       "price": "2.50000000 CNT",
####       "total": "2.00000000 CNT",
####       "selling": "0.80000000 TLOS",
####       "fee": "0.08000000 TLOS"
####     }
####   ],
####   "more": false
#### }
#
## ### 
#echo "-- 1 buy consumes 3 sell orders --"
#cleos push action vapaeetokens order '["bob" , "sell", "7.00000000 CNT", "0.10000000 TLOS"]' -p bob
#
#echo "-- 6 orders --"
#cleos push action vapaeetokens order '["alice", "buy", "4.00000000 CNT", "0.05000000 TLOS"]' -p alice
#cleos push action vapaeetokens order '["alice", "buy", "8.00000000 CNT", "0.06000000 TLOS"]' -p alice
#cleos push action vapaeetokens order '["alice", "buy", "2.00000000 CNT", "0.07000000 TLOS"]' -p alice
#
#cleos push action vapaeetokens order '["bob" , "sell", "7.00000000 CNT", "1.10000000 TLOS"]' -p bob
#cleos push action vapaeetokens order '["bob" , "sell", "2.00000000 CNT", "1.20000000 TLOS"]' -p bob
#cleos push action vapaeetokens order '["bob" , "sell", "3.00000000 CNT", "1.30000000 TLOS"]' -p bob
#
### cleos push action vapaeetokens withdraw '["alice", "9.0000 ACORN"]' -p alice
### cleos push action vapaeetokens withdraw '["bob", "4.0000 ACORN"]' -p bob
##
### cleos push action eosio.token transfer '["alice","vapaeetokens","8.0000 ACORN","deposit"]' -p alice@active
### cleos push action eosio.token transfer '["bob","vapaeetokens","3.0000 ACORN","deposit"]' -p bob@active
##
### ------------------------------------------------------------------------------------------------------
### cleos push action vapaeetokens order '["alice", "buy", "1.00000000 CNT", "1.00000000 TLOS"]' -p alice