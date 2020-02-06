#!/bin/bash

echo "-- deposits --"
cleos push action acornaccount transfer  '["bob",  "vapaeetokens","50.0000 ACORN","deposit"]' -p bob@active
cleos push action acornaccount transfer  '["alice","vapaeetokens","1000.0000 ACORN","deposit"]' -p alice@active
cleos push action acornaccount transfer  '["tom",  "vapaeetokens","50.0000 ACORN","deposit"]' -p tom@active
cleos push action acornaccount transfer  '["kate", "vapaeetokens","50.0000 ACORN","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","1000.0000 FUTBOL","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","1000.0000 FUTBOL","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","1000.0000 FUTBOL","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","1000.0000 FUTBOL","deposit"]' -p kate@active

cleos push action qubicletoken transfer  '["bob",  "vapaeetokens","100.0000 QBE","deposit"]' -p bob@active
cleos push action qubicletoken transfer  '["alice","vapaeetokens","100.0000 QBE","deposit"]' -p alice@active
cleos push action qubicletoken transfer  '["tom",  "vapaeetokens","100.0000 QBE","deposit"]' -p tom@active
cleos push action qubicletoken transfer  '["kate", "vapaeetokens","100.0000 QBE","deposit"]' -p kate@active

cleos push action stablecarbon transfer  '["bob",  "vapaeetokens","1000.0000 TLOSD","deposit"]' -p bob@active
cleos push action stablecarbon transfer  '["alice","vapaeetokens","1000.0000 TLOSD","deposit"]' -p alice@active
cleos push action stablecarbon transfer  '["tom",  "vapaeetokens","1000.0000 TLOSD","deposit"]' -p tom@active
cleos push action stablecarbon transfer  '["kate", "vapaeetokens","1000.0000 TLOSD","deposit"]' -p kate@active

cleos push action stablecoin.z transfer  '["bob",  "vapaeetokens","1000.00 EZAR","deposit"]' -p bob@active
cleos push action stablecoin.z transfer  '["alice","vapaeetokens","1000.00 EZAR","deposit"]' -p alice@active
cleos push action stablecoin.z transfer  '["tom",  "vapaeetokens","1000.00 EZAR","deposit"]' -p tom@active
cleos push action stablecoin.z transfer  '["kate", "vapaeetokens","1000.00 EZAR","deposit"]' -p kate@active

cleos push action ednazztokens transfer  '["bob",  "vapaeetokens","100.0000 EDNA","deposit"]' -p bob@active
cleos push action ednazztokens transfer  '["alice","vapaeetokens","100.0000 EDNA","deposit"]' -p alice@active
cleos push action ednazztokens transfer  '["tom",  "vapaeetokens","100.0000 EDNA","deposit"]' -p tom@active
cleos push action ednazztokens transfer  '["kate", "vapaeetokens","100.0000 EDNA","deposit"]' -p kate@active

cleos push action oliveaccount transfer  '["bob",  "vapaeetokens","100.0000 OLIVE","deposit"]' -p bob@active
cleos push action oliveaccount transfer  '["alice","vapaeetokens","100.0000 OLIVE","deposit"]' -p alice@active
cleos push action oliveaccount transfer  '["tom",  "vapaeetokens","100.0000 OLIVE","deposit"]' -p tom@active
cleos push action oliveaccount transfer  '["kate", "vapaeetokens","100.0000 OLIVE","deposit"]' -p kate@active

cleos push action proxibotstkn transfer  '["bob",  "vapaeetokens","100.0000 ROBO","deposit"]' -p bob@active
cleos push action proxibotstkn transfer  '["alice","vapaeetokens","100.0000 ROBO","deposit"]' -p alice@active
cleos push action proxibotstkn transfer  '["tom",  "vapaeetokens","100.0000 ROBO","deposit"]' -p tom@active
cleos push action proxibotstkn transfer  '["kate", "vapaeetokens","100.0000 ROBO","deposit"]' -p kate@active

cleos push action viitasphere1 transfer  '["bob",  "vapaeetokens","100.0000 VIITA","deposit"]' -p bob@active
cleos push action viitasphere1 transfer  '["alice","vapaeetokens","100.0000 VIITA","deposit"]' -p alice@active
cleos push action viitasphere1 transfer  '["tom",  "vapaeetokens","100.0000 VIITA","deposit"]' -p tom@active
cleos push action viitasphere1 transfer  '["kate", "vapaeetokens","100.0000 VIITA","deposit"]' -p kate@active

cleos push action teachology14 transfer  '["bob",  "vapaeetokens","100.0000 TEACH","deposit"]' -p bob@active
cleos push action teachology14 transfer  '["alice","vapaeetokens","100.0000 TEACH","deposit"]' -p alice@active
cleos push action teachology14 transfer  '["tom",  "vapaeetokens","100.0000 TEACH","deposit"]' -p tom@active
cleos push action teachology14 transfer  '["kate", "vapaeetokens","100.0000 TEACH","deposit"]' -p kate@active

cleos push action telosdacdrop transfer '["bob",  "vapaeetokens","50000.0000 TLOSDAC","deposit"]' -p bob@active
cleos push action telosdacdrop transfer '["alice","vapaeetokens","50000.0000 TLOSDAC","deposit"]' -p alice@active
cleos push action telosdacdrop transfer '["tom",  "vapaeetokens","50000.0000 TLOSDAC","deposit"]' -p tom@active
cleos push action telosdacdrop transfer '["kate", "vapaeetokens","50000.0000 TLOSDAC","deposit"]' -p kate@active

cleos push action vapaeetokens transfer '["bob",  "vapaeetokens","100.0000 CNT","deposit"]' -p bob@active
cleos push action vapaeetokens transfer '["alice","vapaeetokens","1000.0000 CNT","deposit"]' -p alice@active
cleos push action vapaeetokens transfer '["kate", "vapaeetokens","100.0000 CNT","deposit"]' -p kate@active

cleos push action eosio.token transfer  '["bob",  "vapaeetokens","100.0000 TLOS","deposit"]' -p bob@active
cleos push action eosio.token transfer  '["alice","vapaeetokens","1000.0000 TLOS","deposit"]' -p alice@active
cleos push action eosio.token transfer  '["kate", "vapaeetokens","100.0000 TLOS","deposit"]' -p kate@active
cleos push action eosio.token transfer  '["tom",  "vapaeetokens","1000.0000 TLOS","deposit"]' -p tom@active

cleos push action vapaeetokens transfer  '["bob",  "vapaeetokens","1000.0000 BOX","deposit"]' -p bob@active
cleos push action vapaeetokens transfer  '["alice","vapaeetokens","1000.0000 BOX","deposit"]' -p alice@active
