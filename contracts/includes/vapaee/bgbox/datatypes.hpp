#pragma once
#include <vapaee/bgbox/common.hpp>

using namespace std;
using namespace eosio;

#define FULL64BITS 0xFFFFFFFFFFFFFFFF

namespace vapaee {
    namespace bgbox {


        static uint128_t combine( uint64_t key1, uint64_t key2 );
        static uint128_t combine( uint64_t key1, name key2 );
        static uint128_t combine( name key1, name key2 );

        struct slotinfo {
            uint64_t container;
            uint64_t position;
            slotinfo():position(0), container(0) {}
            slotinfo(const slotinfo &c):position(c.position), container(c.container) {}
            uint128_t to128bits() const { return vapaee::utils::combine(container, position); }
            void setAux() {
                position = FULL64BITS;
                container = FULL64BITS;
            }
            bool isAux() const {
                return position == FULL64BITS && container == FULL64BITS;
            }
            std::string to_string() const {
                return string("container(") + std::to_string((int) container) + "), pos(" + std::to_string((int) position) + ")";
            };        
            EOSLIB_SERIALIZE(slotinfo, (position)(container))
        };    

        struct requireinfo {
            uint8_t points;
            uint8_t mastery;
            std::string to_string() const {
                return string("points(") + std::to_string((int) points) + "), mastery(" + std::to_string((int) mastery) + ")";
            };
            EOSLIB_SERIALIZE(requireinfo, (points)(mastery))
        };

        struct levelinfo {
            uint8_t value;
            requireinfo require;
            std::string to_string() const {
                return string("value(") + std::to_string((int) value) + "), require[" + require.to_string() + "]";
            };        
            EOSLIB_SERIALIZE(levelinfo, (value)(require))
        };

        struct iconinfo {
            string small;
            string big;
            std::string to_string() const {
                return string("small:'") + small + "' big:'" + big + "'";
            };        
            EOSLIB_SERIALIZE(iconinfo, (small)(big))
        };

        struct mastery_property {
            name title;   // localstrings.strings.key
            name desc;    // localstrings.strings.key
            vapaee::slug property;
            iconinfo icon;        
            std::vector<levelinfo> levels;
            std::string to_string() const {
                return "mastery_property FALTA hacer el to_string()";
            };
            EOSLIB_SERIALIZE(mastery_property, (title)(desc)(property)(icon)(levels))
        };

    }; // namespace bgbox
}; // namespace vaapee