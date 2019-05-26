#!/bin/bash
HOME=/var/www/vapaee.io-source


if [ ! -d $HOME/contracts/_examples/eosio.contracts ]; then
    cd $HOME/contracts/_examples/
    echo "Cloning eosio.contracts (eosio.trail & eosio.token)"
    git clone https://github.com/Telos-Foundation/eosio.contracts.git
else
    echo "$HOME/contracts/_examples/eosio.contracts OK!"
fi


# eosio.token
echo "-------- eosio.trail (Voting system) ---------"
cd $HOME/contracts/_examples/eosio.contracts/eosio.trail
if [[ src/eosio.trail.cpp -nt eosio.trail.wasm ]]; then
    eosio-cpp -o eosio.trail.wasm src/eosio.trail.cpp --abigen -I include
fi
cleos set contract eosio.trail $PWD -p eosio.trail@active
echo "-------- eosio.token (TLOS) ---------"
cd $HOME/contracts/_examples/eosio.contracts/eosio.token
if [[ src/eosio.token.cpp -nt eosio.token.wasm ]]; then
    eosio-cpp -o eosio.token.wasm src/eosio.token.cpp --abigen -I include
fi
cleos set contract eosio.token $PWD -p eosio.token@active
cleos push action eosio.token create '[ "eosio", "1000000000.0000 TLOS"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "1000.0000 TLOS", "memo 1000 TLOS"]' -p eosio@active
cleos push action eosio.token issue '["bob", "1000.0000 TLOS", "memo 1000 TLOS"]' -p eosio@active
cleos push action eosio.token issue '["tom", "1000.0000 TLOS", "memo 1000 TLOS"]' -p eosio@active
cleos push action eosio.token issue '["kate", "1000.0000 TLOS", "memo 1000 TLOS"]' -p eosio@active

echo "-------- eosio.token (ACORN) ---------"
cleos push action eosio.token create '[ "eosio", "461168601842738.0000 ACORN"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "100.0000 ACORN", "memo ACORN"]' -p eosio@active
cleos push action eosio.token issue '["bob", "100.0000 ACORN", "memo ACORN"]' -p eosio@active
cleos push action eosio.token issue '["tom", "100.0000 ACORN", "memo ACORN"]' -p eosio@active
cleos push action eosio.token issue '["kate", "100.0000 ACORN", "memo ACORN"]' -p eosio@active

echo "-------- eosio.token (OLIVE) ---------"
cleos push action eosio.token create '[ "eosio", "461168601842738.0000 OLIVE"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "100.0000 OLIVE", "memo OLIVE"]' -p eosio@active
cleos push action eosio.token issue '["bob", "100.0000 OLIVE", "memo OLIVE"]' -p eosio@active
cleos push action eosio.token issue '["tom", "100.0000 OLIVE", "memo OLIVE"]' -p eosio@active
cleos push action eosio.token issue '["kate", "100.0000 OLIVE", "memo OLIVE"]' -p eosio@active

echo "-------- eosio.token (HEART) ---------"
cleos push action eosio.token create '[ "eosio", "2100000000.0000 HEART"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "100.0000 HEART", "memo HEART"]' -p eosio@active
cleos push action eosio.token issue '["bob", "100.0000 HEART", "memo HEART"]' -p eosio@active
cleos push action eosio.token issue '["tom", "100.0000 HEART", "memo HEART"]' -p eosio@active
cleos push action eosio.token issue '["kate", "100.0000 HEART", "memo HEART"]' -p eosio@active

echo "-------- eosio.token (VIITA) ---------"
cleos push action eosio.token create '[ "eosio", "10000000000.0000 VIITA"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "100.0000 VIITA", "memo VIITA"]' -p eosio@active
cleos push action eosio.token issue '["bob", "100.0000 VIITA", "memo VIITA"]' -p eosio@active
cleos push action eosio.token issue '["tom", "100.0000 VIITA", "memo VIITA"]' -p eosio@active
cleos push action eosio.token issue '["kate", "100.0000 VIITA", "memo VIITA"]' -p eosio@active

echo "-------- eosio.token (VIICT) ---------"
cleos push action eosio.token create '[ "eosio", "500000 VIICT"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "100 VIICT", "memo VIICT"]' -p eosio@active
cleos push action eosio.token issue '["bob", "100 VIICT", "memo VIICT"]' -p eosio@active
cleos push action eosio.token issue '["tom", "100 VIICT", "memo VIICT"]' -p eosio@active
cleos push action eosio.token issue '["kate", "100 VIICT", "memo VIICT"]' -p eosio@active

echo "-------- eosio.token (QBE) ---------"
cleos push action eosio.token create '[ "eosio", "100000000.0000 QBE"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "100.0000 QBE", "memo QBE"]' -p eosio@active
cleos push action eosio.token issue '["bob", "100.0000 QBE", "memo QBE"]' -p eosio@active
cleos push action eosio.token issue '["tom", "100.0000 QBE", "memo QBE"]' -p eosio@active
cleos push action eosio.token issue '["kate", "100.0000 QBE", "memo QBE"]' -p eosio@active

echo "-------- eosio.token (EDNA) ---------"
cleos push action eosio.token create '[ "eosio", "1300000000.0000 EDNA"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "100.0000 EDNA", "memo EDNA"]' -p eosio@active
cleos push action eosio.token issue '["bob", "100.0000 EDNA", "memo EDNA"]' -p eosio@active
cleos push action eosio.token issue '["tom", "100.0000 EDNA", "memo EDNA"]' -p eosio@active
cleos push action eosio.token issue '["kate", "100.0000 EDNA", "memo EDNA"]' -p eosio@active

echo "-------- eosio.token (TEACH) ---------"
cleos push action eosio.token create '[ "eosio", "10000000000.0000 TEACH"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "100.0000 TEACH", "memo TEACH"]' -p eosio@active
cleos push action eosio.token issue '["bob", "100.0000 TEACH", "memo TEACH"]' -p eosio@active
cleos push action eosio.token issue '["tom", "100.0000 TEACH", "memo TEACH"]' -p eosio@active
cleos push action eosio.token issue '["kate", "100.0000 TEACH", "memo TEACH"]' -p eosio@active

echo "-------- eosio.token (ROBO) ---------"
cleos push action eosio.token create '[ "eosio", "1000000000.0000 ROBO"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "100.0000 ROBO", "memo ROBO"]' -p eosio@active
cleos push action eosio.token issue '["bob", "100.0000 ROBO", "memo ROBO"]' -p eosio@active
cleos push action eosio.token issue '["tom", "100.0000 ROBO", "memo ROBO"]' -p eosio@active
cleos push action eosio.token issue '["kate", "100.0000 ROBO", "memo ROBO"]' -p eosio@active


echo "----- loading tokens ----"

# register tokens
echo "-- register TLOS --" 
cleos push action vapaeetokens addtoken '["eosio.token","TLOS",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens addtoken '["eosio.token","TLOS",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["TLOS", "Telos", "https://telosfoundation.io", "/assets/logos/telos.png", "/assets/logos/telos-lg.png",true]' -p vapaeetokens@active
echo "-- register VIITA --" 
cleos push action vapaeetokens addtoken '["eosio.token","VIITA",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["VIITA", "Viitasphere", "https://viitasphere.com", "/assets/logos/viitasphere.png", "/assets/logos/viitasphere-lg.png",true]' -p vapaeetokens@active
echo "-- register VIICT --" 
cleos push action vapaeetokens addtoken '["eosio.token","VIICT",0,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["VIICT", "Viitasphere", "https://viitasphere.com", "/assets/logos/viitasphere.png", "/assets/logos/viitasphere-lg.png",true]' -p vapaeetokens@active
echo "-- register QBE --" 
cleos push action vapaeetokens addtoken '["eosio.token","QBE",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["QBE", "Qubicles", "https://fenero.io/qubicles", "/assets/logos/qbe.png", "/assets/logos/qbe-lg.png",true]' -p vapaeetokens@active
echo "-- register ACORN --" 
cleos push action vapaeetokens addtoken '["eosio.token","ACORN",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["ACORN", "ACORN", "http://acorns.fun", "/assets/logos/acorn.svg", "/assets/logos/acorn-lg.png",true]' -p vapaeetokens@active
echo "-- register OLIVE --" 
cleos push action vapaeetokens addtoken '["eosio.token","OLIVE",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["OLIVE", "OLIVE", "http://democratic.money/olive", "/assets/logos/olive.png", "/assets/logos/olive-lg.png",true]' -p vapaeetokens@active
echo "-- register ACORN --" 
cleos push action vapaeetokens addtoken '["eosio.token","HEART",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["HEART", "HEART", "https://steemit.com/@steemchurch", "/assets/logos/beautitude.png", "/assets/logos/beautitude-lg.png",true]' -p vapaeetokens@active
echo "-- register EDNA --" 
cleos push action vapaeetokens addtoken '["eosio.token","EDNA",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["EDNA", "EDNA", "https://github.com/EDNA-LIFE", "/assets/logos/edna.png", "/assets/logos/edna-lg.png",true]' -p vapaeetokens@active
echo "-- register TEACH --" 
cleos push action vapaeetokens addtoken '["eosio.token","TEACH",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["TEACH", "Teachology", "http://teachology.io", "/assets/logos/teach.svg", "/assets/logos/teach-lg.png",true]' -p vapaeetokens@active
echo "-- register ROBO --" 
cleos push action vapaeetokens addtoken '["eosio.token","ROBO",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["ROBO", "Proxibots", "https://proxibots.io", "/assets/logos/proxibots.png", "/assets/logos/proxibots-lg.png",true]' -p vapaeetokens@active


echo "-- creating CNT token --" 
cleos push action vapaeetokens create '["vapaeetokens","500000000.0000 CNT"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["CNT", "Cards & Tokens", "http://cardsandtokens.com", "/assets/logos/cnt.svg", "/assets/logos/cnt-lg.svg",true]' -p vapaeetokens@active
echo "-- creating BOX token --" 
cleos push action vapaeetokens create '["vapaeetokens","500000000.0000 BOX"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["BOX", "Board Game Box", "https://vapaee.io/bgbox", "/assets/logos/box.png", "/assets/logos/box-lg.png",true]' -p vapaeetokens@active
echo "-- creating VPE token --" 
cleos push action vapaeetokens create '["vapaeetokens","1000000.000000 VPE"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["VPE", "Vapaée", "https://vapaee.io", "/assets/logos/vapaee.png", "/assets/logos/vapaee-lg.png",true]' -p vapaeetokens@active


# add issuers to the tokens
echo "-- adding issuers to the tokens --" 
cleos push action vapaeetokens addissuer '["vapaeetokens","VPE"]' -p vapaeetokens@active



echo "-------- vapaeetokens (CNT) ---------"
cleos push action vapaeetokens issue '["alice", "1000.0000 CNT", "memo CNT"]' -p vapaeetokens@active
cleos push action vapaeetokens issue '["bob", "1000.0000 CNT", "memo CNT"]' -p vapaeetokens@active
cleos push action vapaeetokens issue '["tom", "1000.0000 CNT", "memo CNT"]' -p vapaeetokens@active
cleos push action vapaeetokens issue '["kate", "1000.0000 CNT", "memo CNT"]' -p vapaeetokens@active

echo "-------- vapaeetokens (BOX) ---------"
cleos push action vapaeetokens issue '["alice", "1000.0000 BOX", "memo BOX"]' -p vapaeetokens@active
cleos push action vapaeetokens issue '["bob", "1000.0000 BOX", "memo BOX"]' -p vapaeetokens@active
cleos push action vapaeetokens issue '["tom", "1000.0000 BOX", "memo BOX"]' -p vapaeetokens@active
cleos push action vapaeetokens issue '["kate", "1000.0000 BOX", "memo BOX"]' -p vapaeetokens@active

echo "-------- vapaeetokens (VPE) ---------"
cleos push action vapaeetokens issue '["alice", "100.000000 VPE", "memo VPE"]' -p vapaeetokens@active
cleos push action vapaeetokens issue '["bob", "100.000000 VPE", "memo VPE"]' -p vapaeetokens@active
cleos push action vapaeetokens issue '["tom", "100.000000 VPE", "memo VPE"]' -p vapaeetokens@active
cleos push action vapaeetokens issue '["kate", "100.000000 VPE", "memo VPE"]' -p vapaeetokens@active
