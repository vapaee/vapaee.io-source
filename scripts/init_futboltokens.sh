#!/bin/bash
# rm /var/www/blockchain/eosio/data -fr

# Los apodos de los clubes sudamericanos en Primera división
# https://www.goal.com/es-ar/news/4483/f%C3%BAtbol-sudamericano/2012/08/26/3331063/los-apodos-de-los-clubes-sudamericanos-en-primera-divisi%C3%B3n


./1_create_accounts.sh

cleos create account eosio futboltokens EOS8RoCAXxWYUW2v4xkG19F57BDVBzpt9NN2iDsD1ouQNyV2BkiNc

./2_deploy_vapaeetokens.sh


## ----------------------------------------------------------------------------

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

echo "-------- futboltokens (ATLETI) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 ATLETI"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 ATLETI", "memo ATLETI"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 ATLETI", "memo ATLETI"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 ATLETI", "memo ATLETI"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 ATLETI", "memo ATLETI"]' -p eosio@active

echo "-------- futboltokens (BARCA) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 BARCA"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 BARCA", "memo BARCA"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 BARCA", "memo BARCA"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 BARCA", "memo BARCA"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 BARCA", "memo BARCA"]' -p eosio@active

echo "-------- futboltokens (BAYER) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 BAYER"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 BAYER", "memo BAYER"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 BAYER", "memo BAYER"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 BAYER", "memo BAYER"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 BAYER", "memo BAYER"]' -p eosio@active

echo "-------- futboltokens (BOCA) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 BOCA"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 BOCA", "memo BOCA"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 BOCA", "memo BOCA"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 BOCA", "memo BOCA"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 BOCA", "memo BOCA"]' -p eosio@active

echo "-------- futboltokens (GREMIO) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 GREMIO"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 GREMIO", "memo GREMIO"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 GREMIO", "memo GREMIO"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 GREMIO", "memo GREMIO"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 GREMIO", "memo GREMIO"]' -p eosio@active

echo "-------- futboltokens (JUVE) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 JUVE"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 JUVE", "memo JUVE"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 JUVE", "memo JUVE"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 JUVE", "memo JUVE"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 JUVE", "memo JUVE"]' -p eosio@active

echo "-------- futboltokens (BOLSO) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 BOLSO"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 BOLSO", "memo BOLSO"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 BOLSO", "memo BOLSO"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 BOLSO", "memo BOLSO"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 BOLSO", "memo BOLSO"]' -p eosio@active

echo "-------- futboltokens (VERDAO) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 VERDAO"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 VERDAO", "memo VERDAO"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 VERDAO", "memo VERDAO"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 VERDAO", "memo VERDAO"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 VERDAO", "memo VERDAO"]' -p eosio@active

echo "-------- futboltokens (MANYA) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 MANYA"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 MANYA", "memo MANYA"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 MANYA", "memo MANYA"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 MANYA", "memo MANYA"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 MANYA", "memo MANYA"]' -p eosio@active

echo "-------- futboltokens (RMADRID) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 RMADRID"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 RMADRID", "memo RMADRID"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 RMADRID", "memo RMADRID"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 RMADRID", "memo RMADRID"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 RMADRID", "memo RMADRID"]' -p eosio@active

echo "-------- futboltokens (RIVER) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 RIVER"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 RIVER", "memo RIVER"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 RIVER", "memo RIVER"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 RIVER", "memo RIVER"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 RIVER", "memo RIVER"]' -p eosio@active

echo "-------- futboltokens (SEVILLA) ---------"
cleos set contract futboltokens $PWD -p futboltokens@active
cleos push action futboltokens create '[ "eosio", "100000000.0000 SEVILLA"]' -p futboltokens@active
cleos push action futboltokens issue '["alice", "1000.0000 SEVILLA", "memo SEVILLA"]' -p eosio@active
cleos push action futboltokens issue '["bob", "1000.0000 SEVILLA", "memo SEVILLA"]' -p eosio@active
cleos push action futboltokens issue '["tom", "1000.0000 SEVILLA", "memo SEVILLA"]' -p eosio@active
cleos push action futboltokens issue '["kate", "1000.0000 SEVILLA", "memo RIVER"]' -p eosio@active

echo "----- loading tokens ----"

# register tokens
echo "-- register TLOS --" 
cleos push action vapaeetokens addtoken '["eosio.token","TLOS",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens addtoken '["eosio.token","TLOS",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["TLOS", "Telos", "https://telosfoundation.io", "", "", "/assets/logos/telos.png", "/assets/logos/telos-lg.png",true]' -p vapaeetokens@active
echo "-- register ATLETI --" 
cleos push action vapaeetokens addtoken '["futboltokens","ATLETI",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["ATLETI", "Club Atlético de Madrid, S. A. D.", "https://www.atleticodemadrid.com", "", "", "/assets/logos/atletico-de-madrid.png", "/assets/logos/atletico-de-madrid-lg.png",true]' -p vapaeetokens@active
echo "-- register BARCA --" 
cleos push action vapaeetokens addtoken '["futboltokens","BARCA",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["BARCA", "Fútbol Club Barcelona, S. A. D.", "http://www.fcbarcelona.es/", "", "", "/assets/logos/barcelona.png", "/assets/logos/barcelona-lg.png",true]' -p vapaeetokens@active
echo "-- register BAYER --" 
cleos push action vapaeetokens addtoken '["futboltokens","BAYER",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["BAYER", "Fußball-Club Bayern München e.V.", "https://fcbayern.com/es", "", "", "/assets/logos/bayer-munich.png", "/assets/logos/bayer-munich-lg.png",true]' -p vapaeetokens@active
echo "-- register BOCA --" 
cleos push action vapaeetokens addtoken '["futboltokens","BOCA",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["BOCA", "Club Atlético Boca Juniors", "https://www.bocajuniors.com.ar/", "", "", "/assets/logos/boca.png", "/assets/logos/boca-lg.png",true]' -p vapaeetokens@active
echo "-- register GREMIO --" 
cleos push action vapaeetokens addtoken '["futboltokens","GREMIO",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["GREMIO", "Grêmio Foot-Ball Porto Alegrense", "http://www.gremio.net/", "", "", "/assets/logos/gremio.png", "/assets/logos/gremio-lg.png",true]' -p vapaeetokens@active
echo "-- register JUVE --" 
cleos push action vapaeetokens addtoken '["futboltokens","JUVE",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["JUVE", "Juventus Football Club S.p.A.", "http://www.juventus.com/", "", "", "/assets/logos/juventus.png", "/assets/logos/juventus-lg.png",true]' -p vapaeetokens@active
echo "-- register BOLSO --" 
cleos push action vapaeetokens addtoken '["futboltokens","BOLSO",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["BOLSO", "Club Nacional de Football", "https://www.nacional.uy/", "", "", "/assets/logos/nacional.png", "/assets/logos/nacional-lg.png",true]' -p vapaeetokens@active
echo "-- register VERDAO --" 
cleos push action vapaeetokens addtoken '["futboltokens","VERDAO",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["VERDAO", "Sociedade Esportiva Palmeiras", "http://www.palmeiras.com.br/home/", "", "", "/assets/logos/palmeiras.png", "/assets/logos/palmeiras-lg.png",true]' -p vapaeetokens@active
echo "-- register MANYA --" 
cleos push action vapaeetokens addtoken '["futboltokens","MANYA",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["MANYA", "Club Atlético Peñarol", "http://www.peñarol.org", "", "", "/assets/logos/peñarol.png", "/assets/logos/peñarol-lg.png",true]' -p vapaeetokens@active
echo "-- register RMADRID --" 
cleos push action vapaeetokens addtoken '["futboltokens","RMADRID",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["RMADRID", "Real Madrid Club de Fútbol", "https://www.realmadrid.com/", "", "", "/assets/logos/real-madrid.png", "/assets/logos/real-madrid-lg.png",true]' -p vapaeetokens@active
echo "-- register RIVER --" 
cleos push action vapaeetokens addtoken '["futboltokens","RIVER",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["RIVER", "Club Atlético River Plate", "http://www.cariverplate.com.ar/", "", "", "/assets/logos/river-plate.png", "/assets/logos/river-plate-lg.png",true]' -p vapaeetokens@active
echo "-- register SEVILLA --" 
cleos push action vapaeetokens addtoken '["futboltokens","SEVILLA",4,"vapaeetokens"]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["SEVILLA", "Sevilla Fútbol Club, S. A. D.", "https://www.sevillafc.es/", "", "", "/assets/logos/sevilla.png", "/assets/logos/sevilla-lg.png",true]' -p vapaeetokens@active
































