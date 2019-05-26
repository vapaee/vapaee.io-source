#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE container_spec: Lista de todos los contenedores definidos. Cada app tiene varios contenedores definidos
            // TODAS LAS APPS TIENEN AL MENOS UNA CONTENEDOR LLAMADO INVENTARIO (es una forma de saber si una app está registrada)
            // DEBE DEFINIR UN FILTRO PARA LOS ITEMS QUE SE PUEDEN PONER. dEBE ESPECIFICARSE QUE ITEM_SPEC SE PUEDEN PONER
            // scope: contract
            // row: representa un container definido para la aplicación app con el apodo nick
            TABLE container_spec {
                uint64_t          id;
                name            nick; // el apodo de este container debe ser único para cada app
                uint64_t         app; // table vapaeeaouthor::authors.id
                uint64_t primary_key() const { return id;  }
                uint128_t secondary_key() const { return vapaee::utils::combine(app, nick); }
                uint64_t app_key() const { return app; }
                std::string to_string() const {
                    return std::to_string((int) id) + " - nick(" + 
                    nick.to_string() + ") - app(" + 
                    std::to_string((int) app) + ")";
                };
            };
            typedef eosio::multi_index<"contspec"_n, container_spec,
                indexed_by<"second"_n, const_mem_fun<container_spec, uint128_t, &container_spec::secondary_key>>,
                indexed_by<"app"_n, const_mem_fun<container_spec, uint64_t, &container_spec::app_key>>
            > container_specs; 
        // ------------------------------------