#!/bin/bash

"""Start keosd and nodeos
link: https://docs.telos.net/developers/platform/
development-environment/start-your-node-setup
"""

set -e

# Step 1.1: Start keosd
keosd &

# Step 1.2: Start nodeos
nodeos -e -p eosio \
--plugin eosio::producer_plugin \
--plugin eosio::producer_api_plugin \
--plugin eosio::chain_api_plugin \
--plugin eosio::http_plugin \
--plugin eosio::history_plugin \
--plugin eosio::history_api_plugin \
--filter-on="*" \
--access-control-allow-origin='*' \
--contracts-console \
--http-validate-host=false \
--verbose-http-errors >> /tmp/nodeos.log 2>&1 &

sleep 9999999999