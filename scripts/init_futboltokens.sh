#!/bin/bash
# rm /var/www/blockchain/eosio/data -fr

# Los apodos de los clubes sudamericanos en Primera división
# https://www.goal.com/es-ar/news/4483/f%C3%BAtbol-sudamericano/2012/08/26/3331063/los-apodos-de-los-clubes-sudamericanos-en-primera-divisi%C3%B3n


./1_create_accounts.sh

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
cleos push action vapaeetokens addtoken '["eosio.token","TLOS",4,"vapaeetokens", "Telos", "https://telosfoundation.io", "", "", "/assets/logos/telos.png", "/assets/logos/telos-lg.png",true]' -p vapaeetokens@active
cleos push action vapaeetokens addtoken '["eosio.token","TLOS",4,"vapaeetokens", "Telos", "https://telosfoundation.io", "", "", "/assets/logos/telos.png", "/assets/logos/telos-lg.png",true]' -p vapaeetokens@active
cleos push action vapaeetokens updatetoken '["TLOS", "Telos", "https://telosfoundation.io", "", "", "/assets/logos/telos.png", "/assets/logos/telos-lg.png",true]' -p vapaeetokens@active
cleos push action vapaeetokens setcurrency '["TLOS", true]' -p vapaeetokens@active

echo "-- register ATLETI --" 
cleos push action vapaeetokens addtoken '["futboltokens","ATLETI",4,"vapaeetokens","Club Atlético de Madrid, S. A. D.", "https://www.atleticodemadrid.com", "", "", "/assets/logos/atletico-de-madrid.png", "/assets/logos/atletico-de-madrid-lg.png",true]' -p vapaeetokens@active
# cleos push action vapaeetokens updatetoken '["ATLETI", "Club Atlético de Madrid, S. A. D.", "https://www.atleticodemadrid.com", "", "", "/assets/logos/atletico-de-madrid.png", "/assets/logos/atletico-de-madrid-lg.png",true]' -p vapaeetokens@active
echo "-- register BARCA --" 
cleos push action vapaeetokens addtoken '["futboltokens","BARCA",4,"vapaeetokens","Fútbol Club Barcelona, S. A. D.", "http://www.fcbarcelona.es/", "", "", "/assets/logos/barcelona.png", "/assets/logos/barcelona-lg.png",true]' -p vapaeetokens@active
# cleos push action vapaeetokens updatetoken '["BARCA", "Fútbol Club Barcelona, S. A. D.", "http://www.fcbarcelona.es/", "", "", "/assets/logos/barcelona.png", "/assets/logos/barcelona-lg.png",true]' -p vapaeetokens@active
echo "-- register BAYER --" 
cleos push action vapaeetokens addtoken '["futboltokens","BAYER",4,"vapaeetokens","Fußball-Club Bayern München e.V.", "https://fcbayern.com/es", "", "", "/assets/logos/bayer-munich.png", "/assets/logos/bayer-munich-lg.png",true]' -p vapaeetokens@active
#cleos push action vapaeetokens updatetoken '["BAYER", "Fußball-Club Bayern München e.V.", "https://fcbayern.com/es", "", "", "/assets/logos/bayer-munich.png", "/assets/logos/bayer-munich-lg.png",true]' -p vapaeetokens@active
echo "-- register BOCA --" 
cleos push action vapaeetokens addtoken '["futboltokens","BOCA",4,"vapaeetokens","Club Atlético Boca Juniors", "https://www.bocajuniors.com.ar/", "", "", "/assets/logos/boca.png", "/assets/logos/boca-lg.png",true]' -p vapaeetokens@active
#cleos push action vapaeetokens updatetoken '["BOCA", "Club Atlético Boca Juniors", "https://www.bocajuniors.com.ar/", "", "", "/assets/logos/boca.png", "/assets/logos/boca-lg.png",true]' -p vapaeetokens@active
echo "-- register GREMIO --" 
cleos push action vapaeetokens addtoken '["futboltokens","GREMIO",4,"vapaeetokens","Grêmio Foot-Ball Porto Alegrense", "http://www.gremio.net/", "", "", "/assets/logos/gremio.png", "/assets/logos/gremio-lg.png",true]' -p vapaeetokens@active
#cleos push action vapaeetokens updatetoken '["GREMIO", "Grêmio Foot-Ball Porto Alegrense", "http://www.gremio.net/", "", "", "/assets/logos/gremio.png", "/assets/logos/gremio-lg.png",true]' -p vapaeetokens@active
echo "-- register JUVE --" 
cleos push action vapaeetokens addtoken '["futboltokens","JUVE",4,"vapaeetokens","Juventus Football Club S.p.A.", "http://www.juventus.com/", "", "", "/assets/logos/juventus.png", "/assets/logos/juventus-lg.png",true]' -p vapaeetokens@active
#cleos push action vapaeetokens updatetoken '["JUVE", "Juventus Football Club S.p.A.", "http://www.juventus.com/", "", "", "/assets/logos/juventus.png", "/assets/logos/juventus-lg.png",true]' -p vapaeetokens@active
echo "-- register BOLSO --" 
cleos push action vapaeetokens addtoken '["futboltokens","BOLSO",4,"vapaeetokens","Club Nacional de Football", "https://www.nacional.uy/", "", "", "/assets/logos/nacional.png", "/assets/logos/nacional-lg.png",true]' -p vapaeetokens@active
#cleos push action vapaeetokens updatetoken '["BOLSO", "Club Nacional de Football", "https://www.nacional.uy/", "", "", "/assets/logos/nacional.png", "/assets/logos/nacional-lg.png",true]' -p vapaeetokens@active
echo "-- register VERDAO --" 
cleos push action vapaeetokens addtoken '["futboltokens","VERDAO",4,"vapaeetokens","Sociedade Esportiva Palmeiras", "http://www.palmeiras.com.br/home/", "", "", "/assets/logos/palmeiras.png", "/assets/logos/palmeiras-lg.png",true]' -p vapaeetokens@active
#cleos push action vapaeetokens updatetoken '["VERDAO", "Sociedade Esportiva Palmeiras", "http://www.palmeiras.com.br/home/", "", "", "/assets/logos/palmeiras.png", "/assets/logos/palmeiras-lg.png",true]' -p vapaeetokens@active
echo "-- register MANYA --" 
cleos push action vapaeetokens addtoken '["futboltokens","MANYA",4,"vapaeetokens","Club Atlético Peñarol", "http://www.peñarol.org", "", "", "/assets/logos/peñarol.png", "/assets/logos/peñarol-lg.png",true]' -p vapaeetokens@active
#cleos push action vapaeetokens updatetoken '["MANYA", "Club Atlético Peñarol", "http://www.peñarol.org", "", "", "/assets/logos/peñarol.png", "/assets/logos/peñarol-lg.png",true]' -p vapaeetokens@active
echo "-- register RMADRID --" 
cleos push action vapaeetokens addtoken '["futboltokens","RMADRID",4,"vapaeetokens","Real Madrid Club de Fútbol", "https://www.realmadrid.com/", "", "", "/assets/logos/real-madrid.png", "/assets/logos/real-madrid-lg.png",true]' -p vapaeetokens@active
#cleos push action vapaeetokens updatetoken '["RMADRID", "Real Madrid Club de Fútbol", "https://www.realmadrid.com/", "", "", "/assets/logos/real-madrid.png", "/assets/logos/real-madrid-lg.png",true]' -p vapaeetokens@active
echo "-- register RIVER --" 
cleos push action vapaeetokens addtoken '["futboltokens","RIVER",4,"vapaeetokens","Club Atlético River Plate", "http://www.cariverplate.com.ar/", "", "", "/assets/logos/river-plate.png", "/assets/logos/river-plate-lg.png",true]' -p vapaeetokens@active
#cleos push action vapaeetokens updatetoken '["RIVER", "Club Atlético River Plate", "http://www.cariverplate.com.ar/", "", "", "/assets/logos/river-plate.png", "/assets/logos/river-plate-lg.png",true]' -p vapaeetokens@active
echo "-- register SEVILLA --" 
cleos push action vapaeetokens addtoken '["futboltokens","SEVILLA",4,"vapaeetokens","Sevilla Fútbol Club, S. A. D.", "https://www.sevillafc.es/", "", "", "/assets/logos/sevilla.png", "/assets/logos/sevilla-lg.png",true]' -p vapaeetokens@active
# cleos push action vapaeetokens updatetoken '["SEVILLA", "Sevilla Fútbol Club, S. A. D.", "https://www.sevillafc.es/", "", "", "/assets/logos/sevilla.png", "/assets/logos/sevilla-lg.png",true]' -p vapaeetokens@active





# -------------------------------------------------------------------------------------------------


echo "-- deposits --"

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 ATLETI","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 ATLETI","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 ATLETI","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 ATLETI","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 BARCA","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 BARCA","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 BARCA","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 BARCA","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 BAYER","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 BAYER","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 BAYER","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 BAYER","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 BOCA","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 BOCA","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 BOCA","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 BOCA","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 GREMIO","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 GREMIO","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 GREMIO","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 GREMIO","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 JUVE","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 JUVE","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 JUVE","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 JUVE","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 BOLSO","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 BOLSO","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 BOLSO","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 BOLSO","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 VERDAO","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 VERDAO","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 VERDAO","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 VERDAO","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 MANYA","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 MANYA","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 MANYA","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 MANYA","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 RMADRID","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 RMADRID","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 RMADRID","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 RMADRID","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 RIVER","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 RIVER","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 RIVER","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 RIVER","deposit"]' -p kate@active

cleos push action futboltokens transfer  '["bob",  "vapaeetokens","400.0000 SEVILLA","deposit"]' -p bob@active
cleos push action futboltokens transfer  '["alice","vapaeetokens","400.0000 SEVILLA","deposit"]' -p alice@active
cleos push action futboltokens transfer  '["tom",  "vapaeetokens","400.0000 SEVILLA","deposit"]' -p tom@active
cleos push action futboltokens transfer  '["kate", "vapaeetokens","400.0000 SEVILLA","deposit"]' -p kate@active

cleos push action eosio.token transfer  '["bob",  "vapaeetokens","100.0000 TLOS","deposit"]' -p bob@active
cleos push action eosio.token transfer  '["alice","vapaeetokens","1000.0000 TLOS","deposit"]' -p alice@active
cleos push action eosio.token transfer  '["kate", "vapaeetokens","100.0000 TLOS","deposit"]' -p kate@active
cleos push action eosio.token transfer  '["tom",  "vapaeetokens","1000.0000 TLOS","deposit"]' -p tom@active



echo "-- alice sells BARCA --"
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.40000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.41000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.42000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.43000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.44000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.45000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.46000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.47000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.48000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.49000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.50000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.51000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.52000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.53000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.54000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.55000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.56000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.57000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.58000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "10.00000000 BARCA", "0.59000000 TLOS",0]' -p alice

echo "-- alice buys BARCA --"
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.10000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.11000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.12000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.13000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.14000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.15000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.16000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.17000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.18000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.19000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.20000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.21000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.22000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.23000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.24000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.25000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.26000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.27000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.28000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "10.00000000 BARCA", "0.29000000 TLOS",0]' -p alice

echo "-- alice sells JUVE --"
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.40000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.41000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.42000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.43000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.44000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.45000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.46000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.47000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.48000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.49000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.50000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.51000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.52000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.53000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.54000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.55000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.56000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.57000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.58000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 JUVE", "0.59000000 TLOS",0]' -p alice

echo "-- alice buys JUVE --"
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.10000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.11000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.12000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.13000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.14000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.15000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.16000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.17000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.18000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.19000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.20000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.21000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.22000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.23000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.24000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.25000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.26000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.27000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.28000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 JUVE", "0.29000000 TLOS",0]' -p alice


echo "-- alice sells ATLETI --"
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.40000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.41000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.42000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.43000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.44000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.45000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.46000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.47000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.48000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.49000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.50000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.51000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.52000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.53000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.54000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.55000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.56000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.57000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.58000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 ATLETI", "0.59000000 TLOS",0]' -p alice

echo "-- alice buys ATLETI --"
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.10000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.11000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.12000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.13000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.14000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.15000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.16000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.17000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.18000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.19000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.20000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.21000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.22000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.23000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.24000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.25000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.26000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.27000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.28000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 ATLETI", "0.29000000 TLOS",0]' -p alice


echo "-- alice sells BOCA --"
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.40000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.41000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.42000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.43000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.44000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.45000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.46000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.47000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.48000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.49000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.50000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.51000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.52000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.53000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.54000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.55000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.56000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.57000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.58000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOCA", "0.59000000 TLOS",0]' -p alice

echo "-- alice buys BOCA --"
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.10000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.11000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.12000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.13000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.14000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.15000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.16000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.17000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.18000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.19000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.20000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.21000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.22000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.23000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.24000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.25000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.26000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.27000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.28000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOCA", "0.29000000 TLOS",0]' -p alice


echo "-- alice sells MANYA --"
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.40000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.41000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.42000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.43000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.44000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.45000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.46000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.47000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.48000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.49000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.50000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.51000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.52000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.53000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.54000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.55000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.56000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.57000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.58000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 MANYA", "0.59000000 TLOS",0]' -p alice

echo "-- alice buys MANYA --"
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.10000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.11000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.12000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.13000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.14000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.15000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.16000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.17000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.18000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.19000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.20000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.21000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.22000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.23000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.24000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.25000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.26000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.27000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.28000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 MANYA", "0.29000000 TLOS",0]' -p alice


echo "-- alice sells BOLSO --"
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.40000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.41000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.42000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.43000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.44000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.45000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.46000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.47000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.48000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.49000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.50000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.51000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.52000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.53000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.54000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.55000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.56000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.57000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.58000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 BOLSO", "0.59000000 TLOS",0]' -p alice

echo "-- alice buys BOLSO --"
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.10000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.11000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.12000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.13000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.14000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.15000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.16000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.17000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.18000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.19000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.20000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.21000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.22000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.23000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.24000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.25000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.26000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.27000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.28000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 BOLSO", "0.29000000 TLOS",0]' -p alice


echo "-- alice sells RIVER --"
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.40000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.41000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.42000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.43000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.44000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.45000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.46000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.47000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.48000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.49000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.50000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.51000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.52000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.53000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.54000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.55000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.56000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.57000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.58000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "sell", "1.00000000 RIVER", "0.59000000 TLOS",0]' -p alice

echo "-- alice buys RIVER --"
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.10000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.11000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.12000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.13000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.14000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.15000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.16000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.17000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.18000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.19000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.20000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.21000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.22000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.23000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.24000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.25000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.26000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.27000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.28000000 TLOS",0]' -p alice
cleos push action vapaeetokens order '["alice", "buy", "1.00000000 RIVER", "0.29000000 TLOS",0]' -p alice

