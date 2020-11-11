#pragma once


#include <tuple>
#include <limits>

#include <vapaee/base/slug_symbol.hpp>
#include <vapaee/base/slug.hpp>

namespace vapaee {

  /**
   *  @defgroup slug_assetapi slug_asset API
   *  @brief Defines API for managing slug_assets
   *  @ingroup contractdev
   */

  /**
   *  @defgroup slug_assetcppapi slug_asset CPP API
   *  @brief Defines %CPP API for managing slug_assets
   *  @ingroup slug_assetapi
   *  @{
   */

   /**
    * \struct Stores information for owner of slug_asset
    *
    * @brief Stores information for owner of slug_asset
    */

   struct slug_asset {
      /**
       * The amount of the slug_asset
       *
       * @brief The amount of the slug_asset
       */
      int64_t      amount = 0;

      /**
       * The symbol name of the slug_asset
       *
       * @brief The symbol name of the slug_asset
       */
      slug_symbol  symbol;

      /**
       * Maximum amount possible for this slug_asset. It's capped to 2^62 - 1
       *
       * @brief Maximum amount possible for this slug_asset
       */
      static constexpr int64_t max_amount    = (1LL << 62) - 1;

      slug_asset() {}

      /**
       * Construct a new slug_asset given the symbol name and the amount
       *
       * @brief Construct a new slug_asset object
       * @param a - The amount of the slug_asset
       * @param s - The name of the symbol
       */
      slug_asset( int64_t a, class slug_symbol s )
      :amount(a),symbol{s}
      {
         check( is_amount_within_range(), "magnitude of slug_asset amount must be less than 2^62" );
         check( symbol.is_valid(),        "invalid symbol name" );
      }

      /**
       * Check if the amount doesn't exceed the max amount
       *
       * @brief Check if the amount doesn't exceed the max amount
       * @return true - if the amount doesn't exceed the max amount
       * @return false - otherwise
       */
      bool is_amount_within_range()const { return -max_amount <= amount && amount <= max_amount; }

      /**
       * Check if the slug_asset is valid. %A valid slug_asset has its amount <= max_amount and its symbol name valid
       *
       * @brief Check if the slug_asset is valid
       * @return true - if the slug_asset is valid
       * @return false - otherwise
       */
      bool is_valid()const               { return is_amount_within_range() && symbol.is_valid(); }

      /**
       * Set the amount of the slug_asset
       *
       * @brief Set the amount of the slug_asset
       * @param a - New amount for the slug_asset
       */
      void set_amount( int64_t a ) {
         amount = a;
         check( is_amount_within_range(), "magnitude of slug_asset amount must be less than 2^62" );
      }

      /**
       * Unary minus operator
       *
       * @brief Unary minus operator
       * @return slug_asset - New slug_asset with its amount is the negative amount of this slug_asset
       */
      slug_asset operator-()const {
         slug_asset r = *this;
         r.amount = -r.amount;
         return r;
      }

      /**
       * Subtraction assignment operator
       *
       * @brief Subtraction assignment operator
       * @param a - Another slug_asset to subtract this slug_asset with
       * @return slug_asset& - Reference to this slug_asset
       * @post The amount of this slug_asset is subtracted by the amount of slug_asset a
       */
      slug_asset& operator-=( const slug_asset& a ) {
         check( a.symbol == symbol, "attempt to subtract slug_asset with different symbol" );
         amount -= a.amount;
         check( -max_amount <= amount, "subtraction underflow" );
         check( amount <= max_amount,  "subtraction overflow" );
         return *this;
      }

      /**
       * Addition Assignment  operator
       *
       * @brief Addition Assignment operator
       * @param a - Another slug_asset to subtract this slug_asset with
       * @return slug_asset& - Reference to this slug_asset
       * @post The amount of this slug_asset is added with the amount of slug_asset a
       */
      slug_asset& operator+=( const slug_asset& a ) {
         check( a.symbol == symbol, "attempt to add slug_asset with different symbol" );
         amount += a.amount;
         check( -max_amount <= amount, "addition underflow" );
         check( amount <= max_amount,  "addition overflow" );
         return *this;
      }

      /**
       * Addition operator
       *
       * @brief Addition operator
       * @param a - The first slug_asset to be added
       * @param b - The second slug_asset to be added
       * @return slug_asset - New slug_asset as the result of addition
       */
      inline friend slug_asset operator+( const slug_asset& a, const slug_asset& b ) {
         slug_asset result = a;
         result += b;
         return result;
      }

      /**
       * Subtraction operator
       *
       * @brief Subtraction operator
       * @param a - The slug_asset to be subtracted
       * @param b - The slug_asset used to subtract
       * @return slug_asset - New slug_asset as the result of subtraction of a with b
       */
      inline friend slug_asset operator-( const slug_asset& a, const slug_asset& b ) {
         slug_asset result = a;
         result -= b;
         return result;
      }

      /**
       * Multiplication assignment operator. Multiply the amount of this slug_asset with a number and then assign the value to itself.
       *
       * @brief Multiplication assignment operator, with a number
       * @param a - The multiplier for the slug_asset's amount
       * @return slug_asset - Reference to this slug_asset
       * @post The amount of this slug_asset is multiplied by a
       */
      slug_asset& operator*=( int64_t a ) {
         int128_t tmp = (int128_t)amount * (int128_t)a;
         check( tmp <= max_amount, "multiplication overflow" );
         check( tmp >= -max_amount, "multiplication underflow" );
         amount = (int64_t)tmp;
         return *this;
      }

      /**
       * Multiplication operator, with a number proceeding
       *
       * @brief Multiplication operator, with a number proceeding
       * @param a - The slug_asset to be multiplied
       * @param b - The multiplier for the slug_asset's amount
       * @return slug_asset - New slug_asset as the result of multiplication
       */
      friend slug_asset operator*( const slug_asset& a, int64_t b ) {
         slug_asset result = a;
         result *= b;
         return result;
      }


      /**
       * Multiplication operator, with a number preceeding
       *
       * @brief Multiplication operator, with a number preceeding
       * @param a - The multiplier for the slug_asset's amount
       * @param b - The slug_asset to be multiplied
       * @return slug_asset - New slug_asset as the result of multiplication
       */
      friend slug_asset operator*( int64_t b, const slug_asset& a ) {
         slug_asset result = a;
         result *= b;
         return result;
      }

      /**
       * Division assignment operator. Divide the amount of this slug_asset with a number and then assign the value to itself.
       *
       * @brief Division assignment operator, with a number
       * @param a - The divisor for the slug_asset's amount
       * @return slug_asset - Reference to this slug_asset
       * @post The amount of this slug_asset is divided by a
       */
      slug_asset& operator/=( int64_t a ) {
         check( a != 0, "divide by zero" );
         check( !(amount == std::numeric_limits<int64_t>::min() && a == -1), "signed division overflow" );
         amount /= a;
         return *this;
      }

      /**
       * Division operator, with a number proceeding
       *
       * @brief Division operator, with a number proceeding
       * @param a - The slug_asset to be divided
       * @param b - The divisor for the slug_asset's amount
       * @return slug_asset - New slug_asset as the result of division
       */
      friend slug_asset operator/( const slug_asset& a, int64_t b ) {
         slug_asset result = a;
         result /= b;
         return result;
      }

      /**
       * Division operator, with another slug_asset
       *
       * @brief Division operator, with another slug_asset
       * @param a - The slug_asset which amount acts as the dividend
       * @param b - The slug_asset which amount acts as the divisor
       * @return int64_t - the resulted amount after the division
       * @pre Both slug_asset must have the same symbol
       */
      friend int64_t operator/( const slug_asset& a, const slug_asset& b ) {
         check( b.amount != 0, "divide by zero" );
         check( a.symbol == b.symbol, "comparison of slug_assets with different symbols is not allowed" );
         return a.amount / b.amount;
      }

      /**
       * Equality operator
       *
       * @brief Equality operator
       * @param a - The first slug_asset to be compared
       * @param b - The second slug_asset to be compared
       * @return true - if both slug_asset has the same amount
       * @return false - otherwise
       * @pre Both slug_asset must have the same symbol
       */
      friend bool operator==( const slug_asset& a, const slug_asset& b ) {
         check( a.symbol == b.symbol, "comparison of slug_assets with different symbols is not allowed" );
         return a.amount == b.amount;
      }

      /**
       * Inequality operator
       *
       * @brief Inequality operator
       * @param a - The first slug_asset to be compared
       * @param b - The second slug_asset to be compared
       * @return true - if both slug_asset doesn't have the same amount
       * @return false - otherwise
       * @pre Both slug_asset must have the same symbol
       */
      friend bool operator!=( const slug_asset& a, const slug_asset& b ) {
         return !( a == b);
      }

      /**
       * Less than operator
       *
       * @brief Less than operator
       * @param a - The first slug_asset to be compared
       * @param b - The second slug_asset to be compared
       * @return true - if the first slug_asset's amount is less than the second slug_asset amount
       * @return false - otherwise
       * @pre Both slug_asset must have the same symbol
       */
      friend bool operator<( const slug_asset& a, const slug_asset& b ) {
         check( a.symbol == b.symbol, "comparison of slug_assets with different symbols is not allowed" );
         return a.amount < b.amount;
      }

      /**
       * Less or equal to operator
       *
       * @brief Less or equal to operator
       * @param a - The first slug_asset to be compared
       * @param b - The second slug_asset to be compared
       * @return true - if the first slug_asset's amount is less or equal to the second slug_asset amount
       * @return false - otherwise
       * @pre Both slug_asset must have the same symbol
       */
      friend bool operator<=( const slug_asset& a, const slug_asset& b ) {
         check( a.symbol == b.symbol, "comparison of slug_assets with different symbols is not allowed" );
         return a.amount <= b.amount;
      }

      /**
       * Greater than operator
       *
       * @brief Greater than operator
       * @param a - The first slug_asset to be compared
       * @param b - The second slug_asset to be compared
       * @return true - if the first slug_asset's amount is greater than the second slug_asset amount
       * @return false - otherwise
       * @pre Both slug_asset must have the same symbol
       */
      friend bool operator>( const slug_asset& a, const slug_asset& b ) {
         check( a.symbol == b.symbol, "comparison of slug_assets with different symbols is not allowed" );
         return a.amount > b.amount;
      }

      /**
       * Greater or equal to operator
       *
       * @brief Greater or equal to operator
       * @param a - The first slug_asset to be compared
       * @param b - The second slug_asset to be compared
       * @return true - if the first slug_asset's amount is greater or equal to the second slug_asset amount
       * @return false - otherwise
       * @pre Both slug_asset must have the same symbol
       */
      friend bool operator>=( const slug_asset& a, const slug_asset& b ) {
         check( a.symbol == b.symbol, "comparison of slug_assets with different symbols is not allowed" );
         return a.amount >= b.amount;
      }

      /**
       * %slug_asset to std::string
       *
       * @brief %slug_asset to std::string
       */
      std::string to_string()const {
         int64_t p = (int64_t)symbol.precision();
         int64_t p10 = 1;
         bool negative = false;
         int64_t invert = 1;

         while( p > 0  ) {
            p10 *= 10; --p;
         }
         p = (int64_t)symbol.precision();

         char fraction[p+1];
         fraction[p] = '\0';

         if (amount < 0) {
            invert = -1;
            negative = true;
         }

         auto change = (amount % p10) * invert;

         for( int64_t i = p -1; i >= 0; --i ) {
            fraction[i] = (change % 10) + '0';
            change /= 10;
         }
         char str[p+32];
         const char* fmt = negative ? "-%lld.%s %s" : "%lld.%s %s";
         snprintf(str, sizeof(str), fmt,
               (int64_t)(amount/p10), fraction, symbol.code().to_string().c_str());
         return {str};
      }

      /**
       * %Print the slug_asset
       *
       * @brief %Print the slug_asset
       */
      void print()const {
         eosio::print(to_string());
      }

      EOSLIB_SERIALIZE( slug_asset, (amount)(symbol) )
   };

  /**
   * \struct Extended slug_asset which stores the information of the owner of the slug_asset
   *
   * @brief Extended slug_asset which stores the information of the owner of the slug_asset
   */
   struct extended_slug_asset {
      /**
       * The slug_asset
       */
      slug_asset quantity;

      /**
       * The owner of the slug_asset
       *
       * @brief The owner of the slug_asset
       */
      name contract;

      /**
       * Get the extended symbol of the slug_asset
       *
       * @brief Get the extended symbol of the slug_asset
       * @return extended_slug_symbol - The extended symbol of the slug_asset
       */
      // extended_slug_symbol get_extended_slug_symbol()const { return extended_slug_symbol{ quantity.symbol, contract }; }
      extended_slug_symbol get_extended_symbol()const { return extended_slug_symbol{ quantity.symbol, contract }; }

      /**
       * Default constructor
       *
       * @brief Construct a new extended slug_asset object
       */
      // extended_slug_asset() = default;
      extended_slug_asset(){};

       /**
       * Construct a new extended slug_asset given the amount and extended symbol
       *
       * @brief Construct a new extended slug_asset object
       */
      extended_slug_asset( int64_t v, extended_slug_symbol s ):quantity(v,s.get_symbol()),contract(s.get_contract()){}
      /**
       * Construct a new extended slug_asset given the slug_asset and owner name
       *
       * @brief Construct a new extended slug_asset object
       */
      extended_slug_asset( slug_asset a, name c ):quantity(a),contract(c){}

      /**
       * %Print the extended slug_asset
       *
       * @brief %Print the extended slug_asset
       */
      void print()const {
         quantity.print();
         eosio::print("@");
         eosio::print(contract.value);
      }

       /**
       *  Unary minus operator
       *
       *  @brief Unary minus operator
       *  @return extended_slug_asset - New extended slug_asset with its amount is the negative amount of this extended slug_asset
       */
      extended_slug_asset operator-()const {
         return {-quantity, contract};
      }

      /**
       * Subtraction operator. This subtracts the amount of the extended slug_asset.
       *
       * @brief Subtraction operator
       * @param a - The extended slug_asset to be subtracted
       * @param b - The extended slug_asset used to subtract
       * @return extended_slug_asset - New extended slug_asset as the result of subtraction
       * @pre The owner of both extended slug_asset need to be the same
       */
      friend extended_slug_asset operator - ( const extended_slug_asset& a, const extended_slug_asset& b ) {
         check( a.contract == b.contract, "type mismatch" );
         return {a.quantity - b.quantity, a.contract};
      }

      /**
       * Addition operator. This adds the amount of the extended slug_asset.
       *
       * @brief Addition operator
       * @param a - The extended slug_asset to be added
       * @param b - The extended slug_asset to be added
       * @return extended_slug_asset - New extended slug_asset as the result of addition
       * @pre The owner of both extended slug_asset need to be the same
       */
      friend extended_slug_asset operator + ( const extended_slug_asset& a, const extended_slug_asset& b ) {
         check( a.contract == b.contract, "type mismatch" );
         return {a.quantity + b.quantity, a.contract};
      }

      /// Addition operator.
      friend extended_slug_asset& operator+=( extended_slug_asset& a, const extended_slug_asset& b ) {
         check( a.contract == b.contract, "type mismatch" );
         a.quantity += b.quantity;
         return a;
      }

      /// Subtraction operator.
      friend extended_slug_asset& operator-=( extended_slug_asset& a, const extended_slug_asset& b ) {
         check( a.contract == b.contract, "type mismatch" );
         a.quantity -= b.quantity;
         return a;
      }

      /// Less than operator
      friend bool operator<( const extended_slug_asset& a, const extended_slug_asset& b ) {
         check( a.contract == b.contract, "type mismatch" );
         return a.quantity < b.quantity;
      }


      /// Comparison operator
      friend bool operator==( const extended_slug_asset& a, const extended_slug_asset& b ) {
         return std::tie(a.quantity, a.contract) == std::tie(b.quantity, b.contract);
      }

      /// Comparison operator
      friend bool operator!=( const extended_slug_asset& a, const extended_slug_asset& b ) {
         return std::tie(a.quantity, a.contract) != std::tie(b.quantity, b.contract);
      }

      /// Comparison operator
      friend bool operator<=( const extended_slug_asset& a, const extended_slug_asset& b ) {
         check( a.contract == b.contract, "type mismatch" );
         return a.quantity <= b.quantity;
      }

      /// Comparison operator
      friend bool operator>=( const extended_slug_asset& a, const extended_slug_asset& b ) {
         check( a.contract == b.contract, "type mismatch" );
         return a.quantity >= b.quantity;
      }

      EOSLIB_SERIALIZE( extended_slug_asset, (quantity)(contract) )
   };

/// @} slug_asset type
} /// namespace eosio
