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
cleos set contract eosio.token $PWD -p eosio.token@active
cleos push action eosio.token create '[ "vapaeetokens", "1000000000.0000 TLOS"]' -p eosio.token@active
cleos push action eosio.token create '[ "vapaeetokens", "1000000000.0000 TLOS"]' -p eosio.token@active
cleos push action eosio.token issue '["alice", "1000.0000 TLOS", "memo 1000 TLOS"]' -p vapaeetokens@active
cleos push action eosio.token issue '["alice", "1001.0000 TLOS", "memo 1001 TLOS"]' -p vapaeetokens@active
cleos push action eosio.token issue '["bob", "1000.0000 TLOS", "memo 1000 TLOS"]' -p vapaeetokens@active
cleos push action eosio.token issue '["tom", "1000.0000 TLOS", "memo 1000 TLOS"]' -p vapaeetokens@active
cleos push action eosio.token issue '["kate", "1000.0000 TLOS", "memo 1000 TLOS"]' -p vapaeetokens@active

echo "-------- acornaccount (ACORN) ---------"
cleos set contract acornaccount $PWD -p acornaccount@active
cleos push action acornaccount create '[ "vapaeetokens", "461168601842738.0000 ACORN"]' -p acornaccount@active
cleos push action acornaccount issue '["alice", "1000.0000 ACORN", "memo ACORN"]' -p vapaeetokens@active
cleos push action acornaccount issue '["bob", "1000.0000 ACORN", "memo ACORN"]' -p vapaeetokens@active
cleos push action acornaccount issue '["tom", "1000.0000 ACORN", "memo ACORN"]' -p vapaeetokens@active
cleos push action acornaccount issue '["kate", "1000.0000 ACORN", "memo ACORN"]' -p vapaeetokens@active

echo "-------- oliveaccount (OLIVE) ---------"
cleos set contract oliveaccount $PWD -p oliveaccount@active
cleos push action oliveaccount create '[ "vapaeetokens", "461168601842738.0000 OLIVE"]' -p oliveaccount@active
cleos push action oliveaccount issue '["alice", "100.0000 OLIVE", "memo OLIVE"]' -p vapaeetokens@active
cleos push action oliveaccount issue '["bob", "100.0000 OLIVE", "memo OLIVE"]' -p vapaeetokens@active
cleos push action oliveaccount issue '["tom", "100.0000 OLIVE", "memo OLIVE"]' -p vapaeetokens@active
cleos push action oliveaccount issue '["kate", "100.0000 OLIVE", "memo OLIVE"]' -p vapaeetokens@active

echo "-------- revelation21 (HEART) ---------"
cleos set contract revelation21 $PWD -p revelation21@active
cleos push action revelation21 create '[ "vapaeetokens", "2100000000.0000 HEART"]' -p revelation21@active
cleos push action revelation21 issue '["alice", "100.0000 HEART", "memo HEART"]' -p vapaeetokens@active
cleos push action revelation21 issue '["bob", "100.0000 HEART", "memo HEART"]' -p vapaeetokens@active
cleos push action revelation21 issue '["tom", "100.0000 HEART", "memo HEART"]' -p vapaeetokens@active
cleos push action revelation21 issue '["kate", "100.0000 HEART", "memo HEART"]' -p vapaeetokens@active

echo "-------- futboltokens (FUTBOL) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "vapaeetokens", "2100000000.0000 FUTBOL"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 FUTBOL", "memo FUTBOL"]' -p vapaeetokens@active
cleos push action futboltokens issue '["bob", "1000.0000 FUTBOL", "memo FUTBOL"]' -p vapaeetokens@active
cleos push action futboltokens issue '["tom", "1000.0000 FUTBOL", "memo FUTBOL"]' -p vapaeetokens@active
cleos push action futboltokens issue '["kate", "1000.0000 FUTBOL", "memo FUTBOL"]' -p vapaeetokens@active

echo "-------- teloslegends (LEGEND) ---------"
cleos set contract teloslegends $PWD -p teloslegends@active
cleos push action teloslegends create '[ "vapaeetokens", "12 LEGEND"]' -p teloslegends@active
cleos push action teloslegends issue '["alice", "1 LEGEND", "memo LEGEND"]' -p vapaeetokens@active
cleos push action teloslegends issue '["bob", "1 LEGEND", "memo LEGEND"]' -p vapaeetokens@active
cleos push action teloslegends issue '["tom", "1 LEGEND", "memo LEGEND"]' -p vapaeetokens@active
cleos push action teloslegends issue '["kate", "1 LEGEND", "memo LEGEND"]' -p vapaeetokens@active

echo "-------- viitasphere1 (VIITA) ---------"
cleos set contract viitasphere1 $PWD -p viitasphere1@active
cleos push action viitasphere1 create '[ "vapaeetokens", "10000000000.0000 VIITA"]' -p viitasphere1@active
cleos push action viitasphere1 issue '["alice", "100.0000 VIITA", "memo VIITA"]' -p vapaeetokens@active
cleos push action viitasphere1 issue '["bob", "100.0000 VIITA", "memo VIITA"]' -p vapaeetokens@active
cleos push action viitasphere1 issue '["tom", "100.0000 VIITA", "memo VIITA"]' -p vapaeetokens@active
cleos push action viitasphere1 issue '["kate", "100.0000 VIITA", "memo VIITA"]' -p vapaeetokens@active

echo "-------- viitasphere1 (VIICT) ---------"
cleos push action viitasphere1 create '[ "vapaeetokens", "500000 VIICT"]' -p viitasphere1@active
cleos push action viitasphere1 issue '["alice", "100 VIICT", "memo VIICT"]' -p vapaeetokens@active
cleos push action viitasphere1 issue '["bob", "100 VIICT", "memo VIICT"]' -p vapaeetokens@active
cleos push action viitasphere1 issue '["tom", "100 VIICT", "memo VIICT"]' -p vapaeetokens@active
cleos push action viitasphere1 issue '["kate", "100 VIICT", "memo VIICT"]' -p vapaeetokens@active

echo "-------- qubicletoken (QBE) ---------"
cleos set contract qubicletoken $PWD -p qubicletoken@active
cleos push action qubicletoken create '[ "vapaeetokens", "100000000.0000 QBE"]' -p qubicletoken@active
cleos push action qubicletoken issue '["alice", "100.0000 QBE", "memo QBE"]' -p vapaeetokens@active
cleos push action qubicletoken issue '["bob", "100.0000 QBE", "memo QBE"]' -p vapaeetokens@active
cleos push action qubicletoken issue '["tom", "100.0000 QBE", "memo QBE"]' -p vapaeetokens@active
cleos push action qubicletoken issue '["kate", "100.0000 QBE", "memo QBE"]' -p vapaeetokens@active

echo "-------- ednazztokens (EDNA) ---------"
cleos set contract ednazztokens $PWD -p ednazztokens@active
cleos push action ednazztokens create '[ "vapaeetokens", "1300000000.0000 EDNA"]' -p ednazztokens@active
cleos push action ednazztokens issue '["alice", "100.0000 EDNA", "memo EDNA"]' -p vapaeetokens@active
cleos push action ednazztokens issue '["bob", "100.0000 EDNA", "memo EDNA"]' -p vapaeetokens@active
cleos push action ednazztokens issue '["tom", "100.0000 EDNA", "memo EDNA"]' -p vapaeetokens@active
cleos push action ednazztokens issue '["kate", "100.0000 EDNA", "memo EDNA"]' -p vapaeetokens@active

echo "-------- teachology14 (TEACH) ---------"
cleos set contract teachology14 $PWD -p teachology14@active
cleos push action teachology14 create '[ "vapaeetokens", "10000000000.0000 TEACH"]' -p teachology14@active
cleos push action teachology14 issue '["alice", "100.0000 TEACH", "memo TEACH"]' -p vapaeetokens@active
cleos push action teachology14 issue '["bob", "100.0000 TEACH", "memo TEACH"]' -p vapaeetokens@active
cleos push action teachology14 issue '["tom", "100.0000 TEACH", "memo TEACH"]' -p vapaeetokens@active
cleos push action teachology14 issue '["kate", "100.0000 TEACH", "memo TEACH"]' -p vapaeetokens@active

echo "-------- proxibotstkn (ROBO) ---------"
cleos set contract proxibotstkn $PWD -p proxibotstkn@active
cleos push action proxibotstkn create '[ "vapaeetokens", "1000000000.0000 ROBO"]' -p proxibotstkn@active
cleos push action proxibotstkn issue '["alice", "100.0000 ROBO", "memo ROBO"]' -p vapaeetokens@active
cleos push action proxibotstkn issue '["bob", "100.0000 ROBO", "memo ROBO"]' -p vapaeetokens@active
cleos push action proxibotstkn issue '["tom", "100.0000 ROBO", "memo ROBO"]' -p vapaeetokens@active
cleos push action proxibotstkn issue '["kate", "100.0000 ROBO", "memo ROBO"]' -p vapaeetokens@active

echo "-------- stablecarbon (TLOSD) ---------"
cleos set contract stablecarbon $PWD -p stablecarbon@active
cleos push action stablecarbon create '[ "vapaeetokens", "1000000000.0000 TLOSD"]' -p stablecarbon@active
cleos push action stablecarbon issue '["alice", "1000.0000 TLOSD", "memo TLOSD"]' -p vapaeetokens@active
cleos push action stablecarbon issue '["bob", "1000.0000 TLOSD", "memo TLOSD"]' -p vapaeetokens@active
cleos push action stablecarbon issue '["tom", "1000.0000 TLOSD", "memo TLOSD"]' -p vapaeetokens@active
cleos push action stablecarbon issue '["kate", "1000.0000 TLOSD", "memo TLOSD"]' -p vapaeetokens@active

echo "-------- telosdacdrop (TLOSDAC) ---------"
cleos set contract telosdacdrop $PWD -p telosdacdrop@active
cleos push action telosdacdrop create '[ "vapaeetokens", "1000000000.0000 TLOSDAC"]' -p telosdacdrop@active
cleos push action telosdacdrop issue '["alice", "50000.0000 TLOSDAC", "memo TLOSDAC"]' -p vapaeetokens@active
cleos push action telosdacdrop issue '["bob", "50000.0000 TLOSDAC", "memo TLOSDAC"]' -p vapaeetokens@active
cleos push action telosdacdrop issue '["tom", "50000.0000 TLOSDAC", "memo TLOSDAC"]' -p vapaeetokens@active
cleos push action telosdacdrop issue '["kate", "50000.0000 TLOSDAC", "memo TLOSDAC"]' -p vapaeetokens@active

echo "-------- stablecoin.z (EZAR) ---------"
cleos set contract stablecoin.z $PWD -p stablecoin.z@active
cleos push action stablecoin.z create '[ "vapaeetokens", "1000000000.00 EZAR"]' -p stablecoin.z@active
cleos push action stablecoin.z issue '["alice", "1000.00 EZAR", "memo EZAR"]' -p vapaeetokens@active
cleos push action stablecoin.z issue '["bob", "1000.00 EZAR", "memo EZAR"]' -p vapaeetokens@active
cleos push action stablecoin.z issue '["tom", "1000.00 EZAR", "memo EZAR"]' -p vapaeetokens@active
cleos push action stablecoin.z issue '["kate", "1000.00 EZAR", "memo EZAR"]' -p vapaeetokens@active

echo "-------- yanggangcoin (YANG) ---------"
cleos set contract yanggangcoin $PWD -p yanggangcoin@active
cleos push action yanggangcoin create '[ "vapaeetokens", "1000000000.0000 YANG"]' -p yanggangcoin@active
cleos push action yanggangcoin issue '["alice", "1000.0000 YANG", "memo YANG"]' -p vapaeetokens@active
cleos push action yanggangcoin issue '["bob", "1000.0000 YANG", "memo YANG"]' -p vapaeetokens@active
cleos push action yanggangcoin issue '["tom", "1000.0000 YANG", "memo YANG"]' -p vapaeetokens@active
cleos push action yanggangcoin issue '["kate", "1000.0000 YANG", "memo YANG"]' -p vapaeetokens@active


echo "----- loading tokens ----"

# register tokens
echo "-- register TLOS --" 
cleos push action vapaeetokens addtoken '["eosio.token","TLOS",4,"vapaeetokens", "Telos", "https://telosfoundation.io", "", "", "/assets/logos/telos.png", "/assets/logos/telos-lg.png",true]' -p vapaeetokens@active
cleos push action vapaeetokens addtoken '["eosio.token","TLOS",4,"vapaeetokens", "Telos", "https://telosfoundation.io", "", "", "/assets/logos/telos.png", "/assets/logos/telos-lg.png",true]' -p vapaeetokens@active
cleos push action vapaeetokens setcurrency '["TLOS", true]' -p vapaeetokens@active
echo "-- register VIITA --" 
cleos push action vapaeetokens addtoken '["viitasphere1","VIITA",4,"vapaeetokens", "Viitasphere", "https://viitasphere.com", "", "", "/assets/logos/viitasphere.png", "/assets/logos/viitasphere-lg.png",true]' -p vapaeetokens@active
echo "-- register VIICT --" 
cleos push action vapaeetokens addtoken '["viitasphere1","VIICT",0,"vapaeetokens", "Viitasphere", "https://viitasphere.com", "", "", "/assets/logos/viitasphere.png", "/assets/logos/viitasphere-lg.png",true]' -p vapaeetokens@active
echo "-- register QBE --" 
cleos push action vapaeetokens addtoken '["qubicletoken","QBE",4,"vapaeetokens", "Qubicles", "https://fenero.io/qubicles", "", "", "/assets/logos/qbe.png", "/assets/logos/qbe-lg.png",true]' -p vapaeetokens@active
echo "-- register ACORN --" 
cleos push action vapaeetokens addtoken '["acornaccount","ACORN",4,"vapaeetokens", "ACORN", "http://acorns.fun", "", "", "/assets/logos/acorn.svg", "/assets/logos/acorn-lg.png",true]' -p vapaeetokens@active
echo "-- register YANG --" 
cleos push action vapaeetokens addtoken '["yanggangcoin","YANG",4,"vapaeetokens", "Yang Gang Coin", "https://www.yang2020.com/", "Together, We Can Build a New Kind of Economy, One That Puts People First.", "/assets/uploads/yang-banner.jpg", "/assets/logos/yang-coin.png", "/assets/logos/yang-coin-lg.png",true]' -p vapaeetokens@active
cleos push action vapaeetokens settokendata '["YANG", 0, "add", "twitter", "Official Twitter Account", "https://twitter.com/andrewyang"]' -p vapaeetokens@active


echo "-- register FUTBOL --" 
cleos push action vapaeetokens addtoken '["futboltokens","FUTBOL",4,"vapaeetokens", "Fútbol Tokens", "http://futboltokens.online/", "Collect the best football trading cards and win prizes", "/assets/uploads/futboltokens-banner.jpg", "/assets/logos/futboltokens.png", "/assets/logos/futboltokens.png",true]' -p vapaeetokens@active
cleos push action vapaeetokens settokendata '["FUTBOL", 0, "add", "youtube", "Video en español", "https://www.youtube.com/watch?v=4fYHjH5ylnA"]' -p vapaeetokens@active

echo "-- register LEGEND --" 
cleos push action vapaeetokens addtoken '["teloslegends","LEGEND",0,"vapaeetokens", "Telos Legends", "http://futboltokens.online/", "Collect the best football trading cards and win prizes", "/assets/uploads/legend-banner.png", "/assets/logos/legend.png", "/assets/logos/legend-lg.png",false]' -p vapaeetokens@active

echo "-- register OLIVE --" 
cleos push action vapaeetokens addtoken '["oliveaccount","OLIVE",4,"vapaeetokens", "OLIVE", "http://democratic.money/olive", "", "", "/assets/logos/olive.png", "/assets/logos/olive-lg.png",true]' -p vapaeetokens@active
echo "-- register HEART --" 
cleos push action vapaeetokens addtoken '["revelation21","HEART",4,"vapaeetokens", "HEART", "https://steemit.com/@steemchurch", "", "", "/assets/logos/beautitude.png", "/assets/logos/beautitude-lg.png",true]' -p vapaeetokens@active
echo "-- register EDNA --" 
cleos push action vapaeetokens addtoken '["ednazztokens","EDNA",4,"vapaeetokens", "EDNA", "https://github.com/EDNA-LIFE", "", "", "/assets/logos/edna.png", "/assets/logos/edna-lg.png",true]' -p vapaeetokens@active
echo "-- register TEACH --" 
cleos push action vapaeetokens addtoken '["teachology14","TEACH",4,"vapaeetokens", "Teachology", "http://teachology.io", "", "", "/assets/logos/teach.svg", "/assets/logos/teach-lg.png",true]' -p vapaeetokens@active
echo "-- register ROBO --" 
cleos push action vapaeetokens addtoken '["proxibotstkn","ROBO",4,"vapaeetokens", "Proxibots", "https://proxibots.io", "", "", "/assets/logos/proxibots.png", "/assets/logos/proxibots-lg.png",true]' -p vapaeetokens@active
echo "-- register TLOSD --" 
cleos push action vapaeetokens addtoken '["stablecarbon","TLOSD",4,"vapaeetokens", "Carbon", "https://www.carbon.money", "", "", "/assets/logos/carbon.svg", "/assets/logos/carbon.svg",true]' -p vapaeetokens@active
cleos push action vapaeetokens setcurrency '["TLOSD", true]' -p vapaeetokens@active

echo "-- register TLOSDAC --" 
cleos push action vapaeetokens addtoken '["telosdacdrop","TLOSDAC",4,"vapaeetokens", "TelosDAC", "https://telosdac.io/", "", "", "/assets/logos/telosdac.png", "/assets/logos/telosdac-lg.png",true]' -p vapaeetokens@active
echo "-- register EZAR --"
cleos push action vapaeetokens addtoken '["stablecoin.z","EZAR",2,"vapaeetokens", "South African Rand", "https://t.me/ezartoken", "", "", "/assets/logos/ezar.png", "/assets/logos/ezar-lg.png",true]' -p vapaeetokens@active


echo "-- creating CNT token --" 
cleos push action vapaeetokens create '["vapaeetokens","500000000.0000 CNT"]' -p vapaeetokens@active
cleos push action vapaeetokens addtoken '["vapaeetokens", "CNT", 4, "vapaeetokens", "Cards & Tokens", "http://cardsandtokens.com", "A platform where you can create themed albums and trading cards to collect and play making money in the process.", "assets/img/cards-and-tokens-1200x400.jpeg", "/assets/logos/cnt.svg", "/assets/logos/cnt-lg.svg",true]' -p vapaeetokens@active
cleos push action vapaeetokens settokendata '["CNT", 0, "add", "youtube", "Promo video", "https://youtu.be/YSVJgKsSobA"]' -p vapaeetokens@active
cleos push action vapaeetokens settokendata '["CNT", 0, "add", "twitter", "Membership cards", "https://twitter.com/TokensCards/status/1109668817175748608"]' -p vapaeetokens@active
cleos push action vapaeetokens settokendata '["CNT", 0, "add", "youtube", "Demo video", "https://www.youtube.com/watch?v=jhL1KyifGEs&list=PLIv5p7BTy5wxqwqs0fGyjtOahoO3YWX0x&index=1"]' -p vapaeetokens@active
cleos push action vapaeetokens settokendata '["CNT", 0, "add", "twitter", "The CNT token airdrop", "https://twitter.com/TokensCards/status/1105088865994452993"]' -p vapaeetokens@active



echo "-- creating BOX token --" 
cleos push action vapaeetokens create '["vapaeetokens","500000000.0000 BOX"]' -p vapaeetokens@active
cleos push action vapaeetokens addtoken '["vapaeetokens", "BOX", 4, "vapaeetokens", , "Board Game Box", "https://vapaee.io/bgbox", "", "", "/assets/logos/box.png", "/assets/logos/box-lg.png",true]' -p vapaeetokens@active
echo "-- creating VPE token --" 
cleos push action vapaeetokens create '["vapaeetokens","1000000.000000 VPE"]' -p vapaeetokens@active
cleos push action vapaeetokens addtoken '["vapaeetokens", "VPE", 6, "vapaeetokens", , "Vapaée", "https://vapaee.io", "", "", "/assets/logos/vapaee.png", "/assets/logos/vapaee-lg.png",true]' -p vapaeetokens@active


# telosmain push action vapaeetokens updatetoken '["YNT", "YNT", "https://sesacash.com", "YNT - Utility token for Sesacash (sesacash.com)", "/assets/uploads/yensesa-logo.svg", "/assets/logos/yensesa-icon-1.svg", "/assets/logos/yensesa-icon-1.svg",true]' -p vapaeetokens@active

# telosmain push action vapaeetokens updatetoken '["LEGEND", "LEGEND", "", "THE LEGENDS OF TELOS ARE COMING!", "/assets/uploads/legend-banner.png", "/assets/logos/legend.png", "/assets/logos/legend-lg.png",false]' -p vapaeetokens@active



# add issuers to the tokens
# echo "-- adding issuers to the tokens --" 
# cleos push action vapaeetokens addissuer '["vapaeetokens","VPE"]' -p vapaeetokens@active



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



