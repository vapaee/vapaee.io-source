#include <iostream>
#include <string>
#include <vapaee/base/slug.hpp>
using namespace std;
using namespace vapaee;

int main ()
{

    // 0011 0010
    // 32

    slug a = "abcdefghijklmnopqrstuvwxyz.-1234";
    slug b = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz.";
    slug c = "viter-coso.coso-.1234.-123";
    slug d = "viter-coso.coso-.1234.-123";

    cout << "a.length(): " << a.length() << "\n";
    cout << "b.length(): " << b.length() << "\n";
    cout << "c.length(): " << c.length() << "\n";
    cout << "d.length(): " << d.length() << "\n";
    

    cout << "a.to_hexa(): " << a.to_hexa() << "\n";
    cout << "b.to_hexa(): " << b.to_hexa() << "\n";
    cout << "c.to_hexa(): " << c.to_hexa() << "\n";
    cout << "d.to_hexa(): " << d.to_hexa() << "\n";

    cout << "a.to_string(): " << a.to_string() << "\n";
    cout << "b.to_string(): " << b.to_string() << "\n";
    cout << "c.to_string(): " << c.to_string() << "\n";
    cout << "d.to_string(): " << d.to_string() << "\n";

    cout << "(a == b) " << (a == b) << "\n";
    cout << "(a == c) " << (a == c) << "\n";
    cout << "(d == c) " << (d == c) << "\n";
    cout << "(a != b) " << (a != b) << "\n";
    cout << "(a != c) " << (a != c) << "\n";
    cout << "(d != c) " << (d != c) << "\n";
    cout << "(a < a) " << (a < a) << "\n";
    cout << "(a < b) " << (a < b) << "\n";
    cout << "(a < c) " << (a < c) << "\n";
    cout << "(a < d) " << (a < d) << "\n";
    cout << "(b < a) " << (b < a) << "\n";
    cout << "(b < b) " << (b < b) << "\n";
    cout << "(b < c) " << (b < c) << "\n";
    cout << "(b < d) " << (b < d) << "\n";
    cout << "(c < a) " << (c < a) << "\n";
    cout << "(c < b) " << (c < b) << "\n";
    cout << "(c < c) " << (c < c) << "\n";
    cout << "(c < d) " << (c < d) << "\n";
    cout << "(d < a) " << (d < a) << "\n";
    cout << "(d < b) " << (d < b) << "\n";
    cout << "(d < c) " << (d < c) << "\n";
    cout << "(d < d) " << (d < d) << "\n";


    return 0;
}