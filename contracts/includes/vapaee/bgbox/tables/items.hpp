#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE item_unit: donde están las unidades de items
            // scope: app (unit.asset.spec.app)
            // row: representa un slot conteniendo quantity unidades del item definido por asset en la posición position
            TABLE item_unit {
                uint64_t           id;
                uint64_t        owner;
                uint64_t        asset;  // item_asset
                slotinfo         slot; 
                int          quantity;  // quantity <= item_asset.spec.maxgroup
                uint64_t primary_key() const { return id;  }
                uint64_t asset_key() const { return asset;  }
                uint64_t container_key() const { return slot.container; }
                uint128_t slot_key() const { return slot.to128bits(); }
                uint64_t owner_key() const { return owner; }
                std::string to_string() const {
                    return std::to_string((int) id) + " - owner(" + 
                    std::to_string((int) owner) + ") - asset(" + 
                    std::to_string((int) asset) + ") - slot{" +
                    slot.to_string() + "} - quantity(" +  std::to_string((int) quantity) + ")";
                };
            };
            typedef eosio::multi_index<"items"_n, item_unit,
                indexed_by<"owner"_n, const_mem_fun<item_unit, uint64_t, &item_unit::owner_key>>,
                indexed_by<"asset"_n, const_mem_fun<item_unit, uint64_t, &item_unit::asset_key>>,
                indexed_by<"container"_n, const_mem_fun<item_unit, uint64_t, &item_unit::container_key>>,
                indexed_by<"slot"_n, const_mem_fun<item_unit, uint128_t, &item_unit::slot_key>>
            > item_units;
        // containers ------------------------------------