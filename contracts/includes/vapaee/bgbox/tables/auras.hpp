#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE aura_spec: lista de todas las auras definidas por una app sobre las props de una mastery
            // scope: contract
            TABLE aura_spec {
                uint64_t          id;
                name            nick;
                uint64_t         app; // table vapaeeaouthor::authors.id
                uint64_t     mastery; // tabla mastery_spec.
                uint64_t  acumulable; // indica la cantidad de veces que se puede acumular
                // TODO: implementar los points: lista de tuplas (prop-level-points-value)
                uint64_t primary_key() const { return id; }
                uint128_t secondary_key() const { return vapaee::utils::combine(app, nick); }
                uint64_t app_key() const { return app; }
                std::string to_string() const {
                    return std::to_string((int) id) + " - nick(" + 
                    nick.to_string() + ") - app(" +
                    std::to_string((int) app) + ") - mastery(" +
                    std::to_string((int) mastery) + ") - acumulable(" + 
                    std::to_string((int) acumulable) + ")";
                };
            };
            typedef eosio::multi_index<"auras"_n, aura_spec,
                indexed_by<"second"_n, const_mem_fun<aura_spec, uint128_t, &aura_spec::secondary_key>>,
                indexed_by<"app"_n, const_mem_fun<aura_spec, uint64_t, &aura_spec::app_key>>
            > aura_specs;
        // ------------------------------------