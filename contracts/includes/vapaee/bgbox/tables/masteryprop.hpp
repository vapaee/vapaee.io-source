#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE mastery_prop: lista de properties que tiene una mastery
            // scope: mastery
            // row: representa una property de la maestría
            TABLE mastery_prop {
                uint64_t                   id;
                name                    title; // localstrings.strings.key
                name                     desc; // localstrings.strings.key
                slug                 property;
                iconinfo                 icon;
                std::vector<levelinfo> levels;
                uint64_t primary_key() const { return id;  }
                uint128_t property_key() const { return property.to128bits(); }
                std::string to_string() const {
                    return std::to_string((int) id) + " - title(" + 
                    title.to_string() + ") - desc(" +
                    desc.to_string() + ") - property(" +
                    property.to_string() + ") - icon[" + 
                    icon.to_string() + "]- levels(" + 
                    std::to_string((int) levels.size()) + ")";
                };
            };
            typedef eosio::multi_index<"masteryprop"_n, mastery_prop,
                indexed_by<"property"_n, const_mem_fun<mastery_prop, uint128_t, &mastery_prop::property_key>>
            > mastery_props;
        // ------------------------------------