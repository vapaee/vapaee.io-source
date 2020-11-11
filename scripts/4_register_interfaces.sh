#!/bin/bash
echo "-- regitering interfaces --"
cleos push action vapaeetokens addui '["bob",   "vapaee","fee memo for vapaee", "Vapaée Telos DEX", "https://vapaee.io", "brief", "banner", "thumbnail"]' -p bob@active
cleos push action vapaeetokens addui '["alice", "sqrl", "fee memo for sqrl", "SQRL Wallet", "https://sqrlwallet.io", "brief", "banner", "thumbnail"]' -p alice@active

# uint64_t ui, name admin, name receiver, string params, string title, string website, string brief, string banner, string thumbnail
# telosmain push action vapaeetokens addui '["viterbotelos", "vapaee", "fees from Vapaée DEX", "Vapaée Telos DEX", "https://vapaee.io", "Vapaée is a company dedicated to the development of digital platforms on Telos network.", "/assets/img/Logo.png", "/assets/img/Logo.png"]' -p viterbotelos@active
# telosmain push action vapaeetokens addui '["viterbotelos", "cardsandtokens", "fees from Vapaée DEX", "Vapaée Telos DEX", "https://vapaee.io", "Vapaée is a company dedicated to the development of digital platforms on Telos network.", "/assets/img/Logo.png", "/assets/img/Logo.png"]' -p viterbotelos@active