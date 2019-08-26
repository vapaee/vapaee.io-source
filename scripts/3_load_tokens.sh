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

echo "-------- eosio.token (standar token) ---------"
cd $HOME/contracts/_examples/eosio.contracts/eosio.token
if [[ src/eosio.token.cpp -nt eosio.token.wasm ]]; then
    eosio-cpp -o eosio.token.wasm src/eosio.token.cpp --abigen -I include
fi

echo "-------- eosio.token (TLOS) ---------"
cleos set contract eosio.token $PWD -p eosio.token@active
cleos push action eosio.token create '[ "eosio", "1000000000.0000 TLOS"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "1000.0000 TLOS", "memo 1000 TLOS"]' -p eosio@active
cleos push action eosio.token issue '["bob", "1000.0000 TLOS", "memo 1000 TLOS"]' -p eosio@active
cleos push action eosio.token issue '["tom", "1000.0000 TLOS", "memo 1000 TLOS"]' -p eosio@active
cleos push action eosio.token issue '["kate", "1000.0000 TLOS", "memo 1000 TLOS"]' -p eosio@active

echo "-------- acornaccount (ACORN) ---------"
cleos set contract acornaccount $PWD -p acornaccount@active
cleos push action acornaccount create '[ "eosio", "461168601842738.0000 ACORN"]' -p acornaccount@active
cleos push action acornaccount issue '["alice", "1000.0000 ACORN", "memo ACORN"]' -p eosio@active
cleos push action acornaccount issue '["bob", "1000.0000 ACORN", "memo ACORN"]' -p eosio@active
cleos push action acornaccount issue '["tom", "1000.0000 ACORN", "memo ACORN"]' -p eosio@active
cleos push action acornaccount issue '["kate", "1000.0000 ACORN", "memo ACORN"]' -p eosio@active

echo "-------- oliveaccount (OLIVE) ---------"
cleos set contract oliveaccount $PWD -p oliveaccount@active
cleos push action oliveaccount create '[ "eosio", "461168601842738.0000 OLIVE"]' -p oliveaccount@active
cleos push action oliveaccount issue '["alice", "100.0000 OLIVE", "memo OLIVE"]' -p eosio@active
cleos push action oliveaccount issue '["bob", "100.0000 OLIVE", "memo OLIVE"]' -p eosio@active
cleos push action oliveaccount issue '["tom", "100.0000 OLIVE", "memo OLIVE"]' -p eosio@active
cleos push action oliveaccount issue '["kate", "100.0000 OLIVE", "memo OLIVE"]' -p eosio@active

echo "-------- revelation21 (HEART) ---------"
cleos set contract revelation21 $PWD -p revelation21@active
cleos push action revelation21 create '[ "eosio", "2100000000.0000 HEART"]' -p revelation21@active
cleos push action revelation21 issue '["alice", "100.0000 HEART", "memo HEART"]' -p eosio@active
cleos push action revelation21 issue '["bob", "100.0000 HEART", "memo HEART"]' -p eosio@active
cleos push action revelation21 issue '["tom", "100.0000 HEART", "memo HEART"]' -p eosio@active
cleos push action revelation21 issue '["kate", "100.0000 HEART", "memo HEART"]' -p eosio@active

echo "-------- viitasphere1 (VIITA) ---------"
cleos set contract viitasphere1 $PWD -p viitasphere1@active
cleos push action viitasphere1 create '[ "eosio", "10000000000.0000 VIITA"]' -p viitasphere1@active
cleos push action viitasphere1 issue '["alice", "100.0000 VIITA", "memo VIITA"]' -p eosio@active
cleos push action viitasphere1 issue '["bob", "100.0000 VIITA", "memo VIITA"]' -p eosio@active
cleos push action viitasphere1 issue '["tom", "100.0000 VIITA", "memo VIITA"]' -p eosio@active
cleos push action viitasphere1 issue '["kate", "100.0000 VIITA", "memo VIITA"]' -p eosio@active

echo "-------- viitasphere1 (VIICT) ---------"
cleos push action viitasphere1 create '[ "eosio", "500000 VIICT"]' -p viitasphere1@active
cleos push action viitasphere1 issue '["alice", "100 VIICT", "memo VIICT"]' -p eosio@active
cleos push action viitasphere1 issue '["bob", "100 VIICT", "memo VIICT"]' -p eosio@active
cleos push action viitasphere1 issue '["tom", "100 VIICT", "memo VIICT"]' -p eosio@active
cleos push action viitasphere1 issue '["kate", "100 VIICT", "memo VIICT"]' -p eosio@active

echo "-------- qubicletoken (QBE) ---------"
cleos set contract qubicletoken $PWD -p qubicletoken@active
cleos push action qubicletoken create '[ "eosio", "100000000.0000 QBE"]' -p qubicletoken@active
cleos push action qubicletoken issue '["alice", "100.0000 QBE", "memo QBE"]' -p eosio@active
cleos push action qubicletoken issue '["bob", "100.0000 QBE", "memo QBE"]' -p eosio@active
cleos push action qubicletoken issue '["tom", "100.0000 QBE", "memo QBE"]' -p eosio@active
cleos push action qubicletoken issue '["kate", "100.0000 QBE", "memo QBE"]' -p eosio@active

echo "-------- ednazztokens (EDNA) ---------"
cleos set contract ednazztokens $PWD -p ednazztokens@active
cleos push action ednazztokens create '[ "eosio", "1300000000.0000 EDNA"]' -p ednazztokens@active
cleos push action ednazztokens issue '["alice", "100.0000 EDNA", "memo EDNA"]' -p eosio@active
cleos push action ednazztokens issue '["bob", "100.0000 EDNA", "memo EDNA"]' -p eosio@active
cleos push action ednazztokens issue '["tom", "100.0000 EDNA", "memo EDNA"]' -p eosio@active
cleos push action ednazztokens issue '["kate", "100.0000 EDNA", "memo EDNA"]' -p eosio@active

echo "-------- teachology14 (TEACH) ---------"
cleos set contract teachology14 $PWD -p teachology14@active
cleos push action teachology14 create '[ "eosio", "10000000000.0000 TEACH"]' -p teachology14@active
cleos push action teachology14 issue '["alice", "100.0000 TEACH", "memo TEACH"]' -p eosio@active
cleos push action teachology14 issue '["bob", "100.0000 TEACH", "memo TEACH"]' -p eosio@active
cleos push action teachology14 issue '["tom", "100.0000 TEACH", "memo TEACH"]' -p eosio@active
cleos push action teachology14 issue '["kate", "100.0000 TEACH", "memo TEACH"]' -p eosio@active

echo "-------- proxibotstkn (ROBO) ---------"
cleos set contract proxibotstkn $PWD -p proxibotstkn@active
cleos push action proxibotstkn create '[ "eosio", "1000000000.0000 ROBO"]' -p proxibotstkn@active
cleos push action proxibotstkn issue '["alice", "100.0000 ROBO", "memo ROBO"]' -p eosio@active
cleos push action proxibotstkn issue '["bob", "100.0000 ROBO", "memo ROBO"]' -p eosio@active
cleos push action proxibotstkn issue '["tom", "100.0000 ROBO", "memo ROBO"]' -p eosio@active
cleos push action proxibotstkn issue '["kate", "100.0000 ROBO", "memo ROBO"]' -p eosio@active

echo "-------- stablecarbon (TELOSD) ---------"
cleos set contract stablecarbon $PWD -p stablecarbon@active
cleos push action stablecarbon create '[ "eosio", "1000000000.0000 TELOSD"]' -p stablecarbon@active
cleos push action stablecarbon issue '["alice", "1000.0000 TELOSD", "memo TELOSD"]' -p eosio@active
cleos push action stablecarbon issue '["bob", "1000.0000 TELOSD", "memo TELOSD"]' -p eosio@active
cleos push action stablecarbon issue '["tom", "1000.0000 TELOSD", "memo TELOSD"]' -p eosio@active
cleos push action stablecarbon issue '["kate", "1000.0000 TELOSD", "memo TELOSD"]' -p eosio@active

echo "-------- stablecoin.z (EZAR) ---------"
cleos set contract stablecoin.z $PWD -p stablecoin.z@active
cleos push action stablecoin.z create '[ "eosio", "1000000000.00 EZAR"]' -p stablecoin.z@active
cleos push action stablecoin.z issue '["alice", "1000.00 EZAR", "memo EZAR"]' -p eosio@active
cleos push action stablecoin.z issue '["bob", "1000.00 EZAR", "memo EZAR"]' -p eosio@active
cleos push action stablecoin.z issue '["tom", "1000.00 EZAR", "memo EZAR"]' -p eosio@active
cleos push action stablecoin.z issue '["kate", "1000.00 EZAR", "memo EZAR"]' -p eosio@active



echo "-------- yanggangcoin (YANG) ---------"
cleos set contract yanggangcoin $PWD -p yanggangcoin@active
cleos push action yanggangcoin create '[ "eosio", "1000000000.0000 YANG"]' -p yanggangcoin@active
cleos push action yanggangcoin issue '["alice", "1000.0000 YANG", "memo YANG"]' -p eosio@active
cleos push action yanggangcoin issue '["bob", "1000.0000 YANG", "memo YANG"]' -p eosio@active
cleos push action yanggangcoin issue '["tom", "1000.0000 YANG", "memo YANG"]' -p eosio@active
cleos push action yanggangcoin issue '["kate", "1000.0000 YANG", "memo YANG"]' -p eosio@active


echo "----- loading tokens ----"

# register tokens
echo "-- register TLOS --" 
cleos push action vapaeetokens addtoken '["eosio.token","TLOS",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens addtoken '["eosio.token","TLOS",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["TLOS", "Telos", "https://telosfoundation.io", "", "", "/assets/logos/telos.png", "/assets/logos/telos-lg.png",true]' -p vapaeetokens@active
echo "-- register VIITA --" 
cleos push action vapaeetokens addtoken '["viitasphere1","VIITA",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["VIITA", "Viitasphere", "https://viitasphere.com", "", "", "/assets/logos/viitasphere.png", "/assets/logos/viitasphere-lg.png",true]' -p vapaeetokens@active
echo "-- register VIICT --" 
cleos push action vapaeetokens addtoken '["viitasphere1","VIICT",0,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["VIICT", "Viitasphere", "https://viitasphere.com", "", "", "/assets/logos/viitasphere.png", "/assets/logos/viitasphere-lg.png",true]' -p vapaeetokens@active
echo "-- register QBE --" 
cleos push action vapaeetokens addtoken '["qubicletoken","QBE",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["QBE", "Qubicles", "https://fenero.io/qubicles", "", "", "/assets/logos/qbe.png", "/assets/logos/qbe-lg.png",true]' -p vapaeetokens@active
echo "-- register ACORN --" 
cleos push action vapaeetokens addtoken '["acornaccount","ACORN",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["ACORN", "ACORN", "http://acorns.fun", "", "", "/assets/logos/acorn.svg", "/assets/logos/acorn-lg.png",true]' -p vapaeetokens@active
echo "-- register YANG --" 
cleos push action vapaeetokens addtoken '["yanggangcoin","YANG",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["YANG", "Yang Gang Coin", "https://www.yang2020.com/", "Together, We Can Build a New Kind of Economy, One That Puts People First.", "/assets/uploads/yang-banner.jpg", "/assets/logos/yang-coin.png", "/assets/logos/yang-coin-lg.png",true]' -p vapaeetokens@active
cleos push action vapaeetokens settokendata '["YANG", 0, "add", "twitter", "Official Twitter Account", "https://twitter.com/andrewyang"]' -p vapaeetokens@active

echo "-- register OLIVE --" 
cleos push action vapaeetokens addtoken '["oliveaccount","OLIVE",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["OLIVE", "OLIVE", "http://democratic.money/olive", "", "", "/assets/logos/olive.png", "/assets/logos/olive-lg.png",true]' -p vapaeetokens@active
echo "-- register HEART --" 
cleos push action vapaeetokens addtoken '["revelation21","HEART",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["HEART", "HEART", "https://steemit.com/@steemchurch", "", "", "/assets/logos/beautitude.png", "/assets/logos/beautitude-lg.png",true]' -p vapaeetokens@active
echo "-- register EDNA --" 
cleos push action vapaeetokens addtoken '["ednazztokens","EDNA",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["EDNA", "EDNA", "https://github.com/EDNA-LIFE", "", "", "/assets/logos/edna.png", "/assets/logos/edna-lg.png",true]' -p vapaeetokens@active
echo "-- register TEACH --" 
cleos push action vapaeetokens addtoken '["teachology14","TEACH",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["TEACH", "Teachology", "http://teachology.io", "", "", "/assets/logos/teach.svg", "/assets/logos/teach-lg.png",true]' -p vapaeetokens@active
echo "-- register ROBO --" 
cleos push action vapaeetokens addtoken '["proxibotstkn","ROBO",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["ROBO", "Proxibots", "https://proxibots.io", "", "", "/assets/logos/proxibots.png", "/assets/logos/proxibots-lg.png",true]' -p vapaeetokens@active
echo "-- register TELOSD --" 
cleos push action vapaeetokens addtoken '["stablecarbon","TELOSD",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["TELOSD", "Carbon", "https://www.carbon.money", "", "", "/assets/logos/carbon.svg", "/assets/logos/carbon.svg",true]' -p vapaeetokens@active
echo "-- register EZAR --"
cleos push action vapaeetokens addtoken '["stablecoin.z","EZAR",2,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["EZAR", "South African Rand", "https://t.me/ezartoken", "", "", "/assets/logos/ezar.png", "/assets/logos/ezar-lg.png",true]' -p vapaeetokens@active


echo "-- creating CNT token --" 
cleos push action vapaeetokens create '["vapaeetokens","500000000.0000 CNT"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["CNT", "Cards & Tokens", "http://cardsandtokens.com", "A platform where you can create themed albums and trading cards to collect and play making money in the process.", "assets/img/cards-and-tokens-1200x400.jpeg", "/assets/logos/cnt.svg", "/assets/logos/cnt-lg.svg",true]' -p vapaeetokens@active
cleos push action vapaeetokens settokendata '["CNT", 0, "add", "youtube", "Promo video", "https://youtu.be/YSVJgKsSobA"]' -p vapaeetokens@active
cleos push action vapaeetokens settokendata '["CNT", 0, "add", "twitter", "Membership cards", "https://twitter.com/TokensCards/status/1109668817175748608"]' -p vapaeetokens@active
cleos push action vapaeetokens settokendata '["CNT", 0, "add", "youtube", "Demo video", "https://www.youtube.com/watch?v=jhL1KyifGEs&list=PLIv5p7BTy5wxqwqs0fGyjtOahoO3YWX0x&index=1"]' -p vapaeetokens@active
cleos push action vapaeetokens settokendata '["CNT", 0, "add", "twitter", "The CNT token airdrop", "https://twitter.com/TokensCards/status/1105088865994452993"]' -p vapaeetokens@active




echo "-- creating BOX token --" 
cleos push action vapaeetokens create '["vapaeetokens","500000000.0000 BOX"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["BOX", "Board Game Box", "https://vapaee.io/bgbox", "", "", "/assets/logos/box.png", "/assets/logos/box-lg.png",true]' -p vapaeetokens@active
echo "-- creating VPE token --" 
cleos push action vapaeetokens create '["vapaeetokens","1000000.000000 VPE"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["VPE", "Vapaée", "https://vapaee.io", "", "", "/assets/logos/vapaee.png", "/assets/logos/vapaee-lg.png",true]' -p vapaeetokens@active






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



