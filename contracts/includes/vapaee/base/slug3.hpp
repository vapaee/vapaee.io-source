#pragma once
#include <eosiolib/eosio.hpp>
#include <string>
using namespace std;
using namespace eosio;

#define longint unsigned long
#define maxlong 50
#define bytes 32
#define nibble 62 
#define bits 256

#define STRING_INIT "                                "

namespace vapaee {

    struct slug {
        string value;
        
        constexpr explicit slug(): value(STRING_INIT) {
            init(0);
        }

        constexpr explicit slug(const unsigned long &i): value(STRING_INIT) {
            init(i);
        }

        constexpr explicit slug(const int &i): value(STRING_INIT) {
            init((const unsigned long)i);
        }

        constexpr explicit slug(const char* s): value(STRING_INIT) {
            init(0);
            init(s);
        }

        constexpr explicit slug(std::string_view s): value(STRING_INIT) {
            init(0);
            init(s);
        }
        

        void init(longint i) {
            char* ptr = value;
            longint* d = (longint*) ptr;
            *d = 0;
            d = (longint*) (ptr + 8);
            *d = 0;
            d = (longint*) (ptr + 16);
            *d = 0;
            d = (longint*) (ptr + 24);
            *d = i;
        }

        int length() const {
            return value[bytes-1] & 0x3F;
        }

        void init(std::string_view str) {
            char* ptr = value;
            char v, c;
            char n = std::min( (int) str.length(), maxlong );
            int i = 0;
            int shift;
            int ibit, jbit, offset;


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
                    if (j<bytes) {
                        c = v << (8+shift);
                        ptr[j+1] |= c;
                    }
                }
            }

            ptr[bytes-1] |= n;
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
            const char* ptr = value;
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
                    if (j<bytes) {
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
            uint128_t _top = *((uint128_t*) value);
            uint128_t _low = *((uint128_t*) (value + 16));
            return (_top ^ _low);
        }

        uint64_t to64bits() {
            uint64_t first  = *((uint64_t*) value);
            uint64_t second = *((uint64_t*) (value + 8));
            uint64_t third  = *((uint64_t*) (value + 16));
            uint64_t forth  = *((uint64_t*) (value + 24));
            return  (first ^ second) ^ (third ^ forth);
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
        //     return
        //         *((longint*) (a.value + 0))  == *((longint*) (b.value + 0))  &&
        //         *((longint*) (a.value + 8))  == *((longint*) (b.value + 8))  &&
        //         *((longint*) (a.value + 16)) == *((longint*) (b.value + 16)) &&
        //         *((longint*) (a.value + 24)) == *((longint*) (b.value + 24));
            return
                *((uint128_t*) a.value)  == *((uint128_t*) b.value)  &&
                *((uint128_t*) (a.value + 16)) == *((uint128_t*) (b.value + 16));
            }

        /**
         * Inverted equivalency operator. Returns true if a != b (are different)
         *
         * @brief Inverted equivalency operator
         * @return boolean - true if both provided slug are not the same
         */
        constexpr friend bool operator != ( const slug& a, const slug& b ) {
            // return
            //     *((longint*) (a.value + 0))  != *((longint*) (b.value + 0))  ||
            //     *((longint*) (a.value + 8))  != *((longint*) (b.value + 8))  ||
            //     *((longint*) (a.value + 16)) != *((longint*) (b.value + 16)) ||
            //     *((longint*) (a.value + 24)) != *((longint*) (b.value + 24));
            return
                *((uint128_t*) a.value) != *((uint128_t*) b.value) ||
                *((uint128_t*) (a.value + 16)) != *((uint128_t*) (b.value + 16));
        }

        constexpr friend bool operator != ( const slug& a, const int& b ) {
            // return
            //     *((longint*) (a.value + 0))  != 0  ||
            //     *((longint*) (a.value + 8))  != 0  ||
            //     *((longint*) (a.value + 16)) != 0 ||
            //     *((longint*) (a.value + 24)) != (longint) b;
            return
                *((uint128_t*) a.value)  != (uint128_t)b  ||
                *((uint128_t*) (a.value + 16)) != (uint128_t)b;
        }
        /**
         * Less than operator. Returns true if a < b.
         * @brief Less than operator
         * @return boolean - true if slug `a` is less than `b`
         */
        constexpr friend bool operator < ( const slug& a, const slug& b ) {
            // if ( *((longint*) (a.value +  0))  !=  *((longint*) (b.value +  0)) )
            //     return *((longint*) (a.value +  0)) < *((longint*) (b.value +  0));
            // 
            // if ( *((longint*) (a.value +  8))  !=  *((longint*) (b.value +  8)) )
            //     return *((longint*) (a.value +  8)) < *((longint*) (b.value +  8));
            // 
            // if ( *((longint*) (a.value + 16))  !=  *((longint*) (b.value + 16)) )
            //     return *((longint*) (a.value + 16)) < *((longint*) (b.value + 16));
            // 
            // return *((longint*) (a.value + 24)) < *((longint*) (b.value + 24));

            if ( *((uint128_t*) a.value)  !=  *((uint128_t*) b.value) )
                return *((uint128_t*) a.value) < *((uint128_t*) b.value);

            return *((uint128_t*) (a.value + 16)) < *((uint128_t*) (b.value + 16));
        }

        EOSLIB_SERIALIZE(slug, (value))

    };

};