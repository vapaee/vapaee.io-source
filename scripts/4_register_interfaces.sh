#!/bin/bash
echo "-- regitering interfaces --"
cleos push action vapaeetokens addui '["bob",   "vapaee","fee memo for vapaee", "Vapaée Telos DEX", "https://vapaee.io", "brief", "banner", "thumbnail"]' -p bob@active
cleos push action vapaeetokens addui '["alice", "sqrl", "fee memo for sqrl", "SQRL Wallet", "https://sqrlwallet.io", "brief", "banner", "thumbnail"]' -p alice@active

