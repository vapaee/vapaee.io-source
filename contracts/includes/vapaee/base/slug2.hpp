#pragma once
#include <eosiolib/eosio.hpp>
#include <string>
using namespace std;
using namespace eosio;

#define longint unsigned long
#define maxlong 50
#define BYTES 32
#define nibble 62 


namespace vapaee {

    struct slug {
        uint128_t top;
        uint128_t low;
        
        constexpr explicit slug(): top(0), low(0) {}

        constexpr explicit slug(const unsigned long &i): top(0), low(i) {}

        constexpr explicit slug(const int &i): top(0), low(i) {}

        constexpr explicit slug(const char* s): top(0), low(0) {
            init(s);
        }

        constexpr explicit slug(std::string_view s): top(0), low(0) {
            init(s);
        }
        
        int length() const {
            char* ptr = (char*) &low;
            return ptr[15] & 0x3F;
        }

        void init(std::string_view str) {
            char* ptr = (char*) &top;
            char v, c;
            char n = std::min( (int) str.length(), maxlong );
            int i = 0;
            int shift;
            int ibit, jbit, offset;

            eosio_assert( ptr+16 == (char*) &low, (string("ptr+16: ") + string(ptr+16) + " != " + string((char*) &low) + " (char*) &low").c_str() );

            for(; i < n; ++i ) {
                ibit = i*5;
                int j = (int)(ibit/8);
                jbit = j*8;
                offset = ibit - jbit;
                shift = 3 - offset;
                v = char_to_value(str[i]);
                if (shift >= 0) {
                    c = v << shift;
                    ptr[j] |= c;
                } else {
                    c = v >> (-1 * shift);
                    ptr[j] |= c;
                    if (j<BYTES) {
                        c = v << (8+shift);
                        ptr[j+1] |= c;
                    }
                }
            }

            ptr[BYTES-1] |= n;
        }

        static char char_to_value( char c ) {
            if( c == '.')
                return 0;
            else if( c == '-')
                return 1;
            else if( c >= '1' && c <= '4' )
                return (c - '1') + 2;
            else if( c >= 'a' && c <= 'z' )
                return (c - 'a') + 6;
            else
                eosio_assert( false, (string("") + "character '" + c + "' is not in allowed character set for slug_symbol").c_str() );
            return 0; // control flow will never reach here; just added to suppress warning
        }       

        static char value_to_char( char v ) {
            if (v == 0) return '.';
            if (v == 1) return '-';
            if (v < 6) return v + '0' - 1;
            if (v < 32) return v + 'a' - 6;
            eosio_assert( false, (string("") + "value '" + v + "' is out of range for slug_symbol. ").c_str() );
            return '?';
        }       
     
        char* write_string( char* begin, char* end ) const {
            const char* ptr = (const char*) &top;
            char v, c;
            int i = 0, s = 0;
            int shift;
            int ibit, jbit, offset;
            if( (begin + maxlong) < begin || (begin + maxlong) > end ) return begin;

            for(i=maxlong-1; i >= 0; i--) {
                ibit = i*5;
                int j = (int)(ibit/8);
                jbit = j*8;
                offset = ibit - jbit;
                shift = 3 - offset;

                if (shift >= 0) {
                    v = (31 << shift);
                    c = ptr[j] & v;
                    if (shift > 0) {
                        c >>= 1;
                        c &= 0x7F; // masking 0111 1111 ------> clear bit 0 
                        c >>= (shift-1); // now we can shift safely
                    }
                } else {
                    v = 31 >> (-1 * shift);
                    c = ptr[j] & v;
                    c <<= -1 * shift;
                    if (j<BYTES) {
                        v = 31 << (8+shift);
                        v = ptr[j+1] & v;
                        v >>= 1;
                        v &= 0x7F; // masking 0111 1111 ------> clear bit 0 
                        v >>= (7+shift); // now we can shift safely
                        c = c | v;
                    }
                }
                
                s += c;
                if (s > 0) {
                    begin[i] = value_to_char(c);
                } else {
                    begin[i] = '\0';
                }                
            }
            return begin+i;
        }

        uint128_t to128bits() const {
            // uint128_t _top = *((uint128_t*) value);
            // uint128_t _low = *((uint128_t*) (value + 16));
            return (top ^ low);
        }

        uint64_t to64bits() {
            uint128_t u128 = to128bits();
            uint64_t _top  = *((uint64_t*) &u128);
            uint64_t _low = *((uint64_t*) (&u128 + 8));
            return (_top ^ _low);
        }

        std::string to_string() const {
            char buffer[maxlong];
            char* end = write_string( buffer, buffer + sizeof(buffer) );
            *end = '\0';
            return std::string(buffer);
        }

        /**
         * Equivalency operator. Returns true if a == b (are the same)
         *
         * @brief Equivalency operator
         * @return boolean - true if both provided slug are the same
         */
        constexpr friend bool operator == ( const slug& a, const slug& b ) {
            return a.top == b.top && a.low == b.low;
        }

        /**
         * Inverted equivalency operator. Returns true if a != b (are different)
         *
         * @brief Inverted equivalency operator
         * @return boolean - true if both provided slug are not the same
         */
        constexpr friend bool operator != ( const slug& a, const slug& b ) {
            return a.top != b.top || a.low != b.low;
        }

        constexpr friend bool operator != ( const slug& a, const int& b ) {
            return a.top != 0 || a.low != (uint128_t) b;
        }
        /**
         * Less than operator. Returns true if a < b.
         * @brief Less than operator
         * @return boolean - true if slug `a` is less than `b`
         */
        constexpr friend bool operator < ( const slug& a, const slug& b ) {
            if ( a.top != b.top)
                return a.top < b.top;

            return a.low < b.low;
        }               

        EOSLIB_SERIALIZE(slug, (top)(low))
    };

};