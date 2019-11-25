#include <vapaee/bgbox/tables/_aux.hpp>

        // TABLE authors -----------
            // scope: contract
            TABLE author_slug {
                uint64_t    id;
                name        owner;
                uint64_t    ownervalue; // for debugging pourpuse
                slug        slugid;
                uint128_t   slugvalue;  // for debugging pourpuse
                uint64_t primary_key() const { return id;  }
                uint64_t by_owner_key() const { return owner.value;  }
                uint128_t by_slugid_key() const { return slugid.to128bits();  }
                uint64_t by_ownervalue_key() const { return owner.value;  }
                uint128_t by_slugidvalue_key() const { return slugid.to128bits();  }
                std::string to_string() const {
                    return std::to_string((int) id) + " - " + owner.to_string() + " - " + slugid.to_string();
                };
            };
            
            typedef eosio::multi_index<"authors"_n, author_slug,
                indexed_by<"owner"_n, const_mem_fun<author_slug, uint64_t, &author_slug::by_owner_key>>,
                indexed_by<"slugid"_n, const_mem_fun<author_slug, uint128_t, &author_slug::by_slugid_key>>,
                indexed_by<"ownervalue"_n, const_mem_fun<author_slug, uint64_t, &author_slug::by_ownervalue_key>>,
                indexed_by<"slugvalue"_n, const_mem_fun<author_slug, uint128_t, &author_slug::by_slugidvalue_key>>
            > authors;
        // ------------------------------------