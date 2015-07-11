'use strict';

/*
5-trit text format, analogous to 7-bit ASCII

+1 to +121 normal text, black on white
-1 to -121 inverted, reverse video white on black
*/

var _chars =  [
// control/digits
/* 00000 = 0 */  '\0', // NUL   null, string terminator, only unbalanced; in serial mode zero-width, matrix mode alternating flashing normal/inverted
/* 00001 = 1 */  '1',
/* 0001i = 2 */  '2',
/* 00010 = 3 */  '3',
/* 00011 = 4 */  '4',
/* 001ii = 5 */  '5',
/* 001i0 = 6 */  '6',
/* 001i1 = 7 */  '7',
/* 0010i = 8 */  '8',
/* 00100 = 9 */  '9',
/* 00101 = 10 */ '0',
/* 0011i = 11 */ '⌂', // escape/reserved code, U+2302 house
/* 00110 = 12 */ '\n', // newline, \n, linefeed
/* 00111 = 13 */ ' ', // space

// left punctuation (01xxx=left, pairs with 10xxx=right, and control(1i)=01, shift-control(11)=10)
/* 01iii = 14 */ '@',
/* 01ii0 = 15 */ '☺', // U+263A smiley
/* 01ii1 = 16 */ '♥', // U+2665 hearts
/* 01i0i = 17 */ '♣', // U+2663 clubs
/* 01i00 = 18 */ '•', // U+2022 bullet
/* 01i01 = 19 */ '○', // U+25CB circle
/* 01i1i = 20 */ '♂', // U+2642 male
/* 01i10 = 21 */ '☼', // U+263C solar
/* 01i11 = 22 */ '←', // U+2190 left arrow
/* 010ii = 23 */ '↑', // U+2191 up arrow
/* 010i0 = 24 */ '«', // U+00AB left-pointing double angle quot
/* 010i1 = 25 */ '±', // U+00B1 plus-minus sign
/* 0100i = 26 */ '(',
/* 01000 = 27 */ '[',
/* 01001 = 28 */ '<',
/* 0101i = 29 */ '{',
/* 01010 = 30 */ '\\',
/* 01011 = 31 */ '.',
/* 011ii = 32 */ ';',
/* 011i0 = 33 */ '\'',
/* 011i1 = 34 */ '!',
/* 0110i = 35 */ '#',
/* 01100 = 36 */ '%',
/* 01101 = 37 */ '-',
/* 0111i = 38 */ '*',
/* 01110 = 39 */ '=',
/* 01111 = 40 */ '^',

// lowercase letters (1cxxxx = letters, where c=case, i=lower, 1=upper)
/* 1iiii = 41 */ '‾', // U+203E overline (standalone)
/* 1iii0 = 42 */ 'a',
/* 1iii1 = 43 */ 'b',
/* 1ii0i = 44 */ 'c',
/* 1ii00 = 45 */ 'd',
/* 1ii01 = 46 */ 'e',
/* 1ii1i = 47 */ 'f',
/* 1ii10 = 48 */ 'g',
/* 1ii11 = 49 */ 'h',
/* 1i0ii = 50 */ 'i',
/* 1i0i0 = 51 */ 'j',
/* 1i0i1 = 52 */ 'k',
/* 1i00i = 53 */ 'l',
/* 1i000 = 54 */ 'm',
/* 1i001 = 55 */ 'n',
/* 1i01i = 56 */ 'o',
/* 1i010 = 57 */ 'p',
/* 1i011 = 58 */ 'q',
/* 1i1ii = 59 */ 'r',
/* 1i1i0 = 60 */ 's',
/* 1i1i1 = 61 */ 't',
/* 1i10i = 62 */ 'u',
/* 1i100 = 63 */ 'v',
/* 1i101 = 64 */ 'w',
/* 1i11i = 65 */ 'x',
/* 1i110 = 66 */ 'y',
/* 1i111 = 67 */ 'z',

// right punctuation
/* 10iii = 68 */ '`',
/* 10ii0 = 69 */ '☻', // U+263B inverted smiley
/* 10ii1 = 70 */ '♦', // U+2666 diamonds
/* 10i0i = 71 */ '♠', // U+2660 spades
/* 10i00 = 72 */ '◘', // U+25D8 inverted bullet
/* 10i01 = 73 */ '◙', // U+25D9 inverted circle
/* 10i1i = 74 */ '♀', // U+2640 female
/* 10i10 = 75 */ '▒', // U+2592 medium shade
/* 10i11 = 76 */ '→', // U+2192 right arrow
/* 100ii = 77 */ '↓', // U+2193 down arrow
/* 100i0 = 78 */ '»', // U+00BB
/* 100i1 = 79 */ '∓', // U+2213 minus-or-plus sign
/* 1000i = 80 */ ')',
/* 10000 = 81 */ ']',
/* 10001 = 82 */ '>',
/* 1001i = 83 */ '}',
/* 10010 = 84 */ '/',
/* 10011 = 85 */ ',',
/* 101ii = 86 */ ':',
/* 101i0 = 87 */ '"',
/* 101i1 = 88 */ '?',
/* 1010i = 89 */ '$',
/* 10100 = 90 */ '&',
/* 10101 = 91 */ '+',
/* 1011i = 92 */ '|',
/* 10110 = 93 */ '≈', // U+2248 approximately equal
/* 10111 = 94 */ '~',

// uppercase letters - toggle 2nd mst i=lowercase,1=uppercase (includes _ and ‾, allow in program identifiers)
/* 11iii = 95 */ '_', // underline
/* 11ii0 = 96 */ 'A',
/* 11ii1 = 97 */ 'B',
/* 11i0i = 98 */ 'C',
/* 11i00 = 99 */ 'D',
/* 11i01 = 100 */ 'E',
/* 11i1i = 101 */ 'F',
/* 11i10 = 102 */ 'G',
/* 11i11 = 103 */ 'H',
/* 110ii = 104 */ 'I',
/* 110i0 = 105 */ 'J',
/* 110i1 = 106 */ 'K',
/* 1100i = 107 */ 'L',
/* 11000 = 108 */ 'M',
/* 11001 = 109 */ 'N',
/* 1101i = 110 */ 'O',
/* 11010 = 111 */ 'P',
/* 11011 = 112 */ 'Q',
/* 111ii = 113 */ 'R',
/* 111i0 = 114 */ 'S',
/* 111i1 = 115 */ 'T',
/* 1110i = 116 */ 'U',
/* 11100 = 117 */ 'V',
/* 11101 = 118 */ 'W',
/* 1111i = 119 */ 'X',
/* 11110 = 120 */ 'Y',
/* 11111 = 121 */ 'Z',
];

function toUnicode(n) {
  return _chars[Math.abs(n)];
}

function isInverted(n) {
  return n < 0;
}

function fromUnicode(c, inverted) {
  var n = _chars.indexOf(c);
  if (n === -1) return null; // TODO: extended escape for full Unicode support?
  if (inverted) n = -n;

  return n;
}

module.exports = {
  toUnicode: toUnicode,
  isInverted: isInverted,
  fromUnicode: fromUnicode,
  allUnicode: _chars,
};
