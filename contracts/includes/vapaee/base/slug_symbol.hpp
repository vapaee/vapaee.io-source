/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */
#pragma once



#include <tuple>
#include <limits>
#include <string_view>

#include <vapaee/base/slug.hpp>

namespace vapaee {

  /**
   *  @defgroup slug_symbolapi slug_symbol API
   *  @brief Defines API for managing slug_symbols
   *  @ingroup contractdev
   */

  /**
   *  @defgroup slug_symbolcppapi slug_symbol CPP API
   *  @brief Defines %CPP API for managing slug_symbols
   *  @ingroup slug_symbolapi
   *  @{
   */

   /**
    * \struct Stores the slug_symbol code
    * @brief Stores the slug_symbol code
    */

   

   class slug_symbol_code {
   public:
      constexpr slug_symbol_code() : value(0) {}

      constexpr explicit slug_symbol_code( slug raw ) : value(raw) {}

      constexpr explicit slug_symbol_code( std::string_view str )
      :value(str)
      {
         check( str.size() <= 50, "string is too long to be a valid slug_symbol" );
      } 

      /**
       * Checks if the slug_symbol code is valid
       * @return true - if slug_symbol is valid
       */
      constexpr bool is_valid() const {
         // TODO: cuando es inválido un slug?
         return true;
      }

      /**
       * Returns the character length of the provided slug_symbol
       *
       * @return length - character length of the provided slug_symbol
       */
      constexpr uint32_t length() const {
         return value.length();
      }

      constexpr slug raw() const { return value; }

      constexpr explicit operator bool()const { return value != 0; }

      char* write_as_string( char* begin, char* end ) const {
         return value.write_string(begin, end);
      }

      std::string to_string()const {
         return value.to_string();
      }

      /**
       * Equivalency operator. Returns true if a == b (are the same)
       *
       * @brief Equivalency operator
       * @return boolean - true if both provided slug_symbol_codes are the same
       */
      friend constexpr bool operator == ( const slug_symbol_code& a, const slug_symbol_code& b ) {
         return a.value == b.value;
      }

      /**
       * Inverted equivalency operator. Returns true if a != b (are different)
       *
       * @brief Inverted equivalency operator
       * @return boolean - true if both provided slug_symbol_codes are not the same
       */
      friend constexpr bool operator != ( const slug_symbol_code& a, const slug_symbol_code& b ) {
         return a.value != b.value;
      }

      /**
       * Less than operator. Returns true if a < b.
       * @brief Less than operator
       * @return boolean - true if slug_symbol_code `a` is less than `b`
       */
      friend constexpr bool operator < ( const slug_symbol_code& a, const slug_symbol_code& b ) {
         return a.value < b.value;
      }

   private:
      slug value;

      EOSLIB_SERIALIZE( slug_symbol_code, (value) )
   };

   /**
    * \struct Stores information about a slug_symbol
    *
    * @brief Stores information about a slug_symbol
    */
   class slug_symbol {
   public:
      constexpr slug_symbol() : value(0) {}

      constexpr explicit slug_symbol( slug raw ) : value(raw) {}

      constexpr slug_symbol( slug_symbol_code sc, uint8_t precision )
      : value( sc.raw() )
      {}

      constexpr slug_symbol( std::string_view ss, uint8_t precision )
      : value( slug_symbol_code(ss).raw() )
      {}

      /**
       * Is this slug_symbol valid
       */
      constexpr bool is_valid()const                 { return code().is_valid(); }

      /**
       * This slug_symbol's precision
       */
      constexpr uint8_t precision()const             { return 0; }

      /**
       * Returns representation of slug_symbol name
       */
      constexpr slug_symbol_code code()const              { return slug_symbol_code{value};   }

      /**
       * Returns uint64_t repreresentation of the slug_symbol
       */
      constexpr slug raw()const                  { return value; }

      constexpr explicit operator bool()const { return value != 0; }

      /**
       * %Print the slug_symbol
       *
       * @brief %Print the slug_symbol
       */
      void print( bool show_precision = true )const {
         string str = code().to_string();
         printl( str.c_str(), str.length() );
      }

      /**
       * Equivalency operator. Returns true if a == b (are the same)
       *
       * @brief Equivalency operator
       * @return boolean - true if both provided slug_symbols are the same
       */
      friend constexpr bool operator == ( const slug_symbol& a, const slug_symbol& b ) {
         return a.value == b.value;
      }

      /**
       * Inverted equivalency operator. Returns true if a != b (are different)
       *
       * @brief Inverted equivalency operator
       * @return boolean - true if both provided slug_symbols are not the same
       */
      friend constexpr bool operator != ( const slug_symbol& a, const slug_symbol& b ) {
         return a.value != b.value;
      }

      /**
       * Less than operator. Returns true if a < b.
       * @brief Less than operator
       * @return boolean - true if slug_symbol `a` is less than `b`
       */
      friend constexpr bool operator < ( const slug_symbol& a, const slug_symbol& b ) {
         return a.value < b.value;
      }

   private:
      slug value;

      EOSLIB_SERIALIZE( slug_symbol, (value) )
   };


   /**
    * \struct Extended asset which stores the information of the owner of the slug_symbol
    *
    */
   class extended_slug_symbol
   {
   public:
      constexpr extended_slug_symbol() {}

      constexpr extended_slug_symbol( slug_symbol sym, name con ) : slug_symbol(sym), contract(con) {}

      constexpr slug_symbol get_symbol() const { return slug_symbol; }

      constexpr name   get_contract() const { return contract; }

      /**
       * %Print the extended slug_symbol
       *
       * @brief %Print the extended slug_symbol
       */
      void print( bool show_precision = true )const {
         slug_symbol.print( show_precision );
         eosio::print("@");
         eosio::print( contract.value );
      }

      /**
       * Equivalency operator. Returns true if a == b (are the same)
       *
       * @brief Equivalency operator
       * @return boolean - true if both provided extended_slug_symbols are the same
       */
      friend constexpr bool operator == ( const extended_slug_symbol& a, const extended_slug_symbol& b ) {
        return std::tie( a.slug_symbol, a.contract ) == std::tie( b.slug_symbol, b.contract );
      }

      /**
       * Inverted equivalency operator. Returns true if a != b (are different)
       *
       * @brief Inverted equivalency operator
       * @return boolean - true if both provided extended_slug_symbols are not the same
       */
      friend constexpr bool operator != ( const extended_slug_symbol& a, const extended_slug_symbol& b ) {
        return std::tie( a.slug_symbol, a.contract ) != std::tie( b.slug_symbol, b.contract );
      }

      /**
       * Less than operator. Returns true if a < b.
       * @brief Less than operator
       * @return boolean - true if extended_slug_symbol `a` is less than `b`
       */
      friend constexpr bool operator < ( const extended_slug_symbol& a, const extended_slug_symbol& b ) {
        return std::tie( a.slug_symbol, a.contract ) < std::tie( b.slug_symbol, b.contract );
      }

   private:
      slug_symbol slug_symbol; ///< the slug_symbol
      name   contract; ///< the token contract hosting the slug_symbol

      EOSLIB_SERIALIZE( extended_slug_symbol, (slug_symbol)(contract) )
   };

   // }@ slug_symbolapi

} /// namespace eosio
