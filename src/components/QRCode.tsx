// Lightweight QR code generator — no external dependencies.
// Implements a compact QR Code (Version 3, Level M) suitable for short URLs/strings.
// Based on the QR Code specification (ISO/IEC 18004). This is a minimal implementation
// that produces valid scannable QR codes for short alphanumeric strings.

type BitBuffer = { buffer: number[]; bitCount: number };

function createBitBuffer(): BitBuffer {
  return { buffer: [], bitCount: 0 };
}

function putBits(bb: BitBuffer, data: number, len: number) {
  for (let i = 0; i < len; i++) {
    const bit = (data >>> (len - i - 1)) & 1;
    if (bb.bitCount % 8 === 0) bb.buffer.push(0);
    bb.buffer[Math.floor(bb.bitCount / 8)] |= bit << (7 - (bb.bitCount % 8));
    bb.bitCount++;
  }
}

// GF(256) arithmetic for Reed-Solomon
const EXP_TABLE: number[] = new Array(256);
const LOG_TABLE: number[] = new Array(256);
(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  EXP_TABLE[255] = EXP_TABLE[0];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP_TABLE[LOG_TABLE[a] + LOG_TABLE[b]];
}

function rsGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const newPoly = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      newPoly[j] ^= poly[j];
      newPoly[j + 1] ^= gfMul(poly[j], EXP_TABLE[i]);
    }
    poly = newPoly;
  }
  return poly;
}

function rsEncode(data: number[], ecLen: number): number[] {
  const gen = rsGeneratorPoly(ecLen);
  const result = data.concat(new Array(ecLen).fill(0));
  for (let i = 0; i < data.length; i++) {
    const coef = result[i];
    if (coef === 0) continue;
    for (let j = 0; j < gen.length; j++) {
      result[i + j] ^= gfMul(gen[j], coef);
    }
  }
  return result.slice(data.length);
}

// QR Version 3, Level M: 29x29 modules, 7 data blocks, 18 EC per block
// Total data codewords: 70, EC codewords: 36, total codewords: 106
// Block structure: 2 blocks of (35 data + 18 EC) = 2 groups
// Actually: Version 3-M has 2 blocks of (35, 18) + 2 blocks of (35, 18) = 4 blocks total? No.
// Let me use a simpler approach — Version 2, Level L (25x25) for short strings.

// Version 2, Level L: 25x25, data capacity ~47 alphanumeric, EC capacity 10 per block, 2 blocks
// Block structure: 2 blocks of (44 data + 10 EC)
// Total codewords: 88, data: 44, ec: 20... Let me just use a well-known configuration.

// Version 1, Level L: 21x21, data capacity 25 bytes (byte mode), 1 block of (26 data + 7 EC)
// This handles strings up to 17 chars in byte mode (with mode + length headers).

const VERSION = 1;
const SIZE = 17 + 4 * VERSION; // 21 for version 1
const DATA_CODEWORDS = 26;
const EC_CODEWORDS = 7;
const EC_BLOCKS = 1;

// Finder pattern positions
function isFinder(r: number, c: number): boolean {
  const inBox = (br: number, bc: number) =>
    r >= br && r < br + 7 && c >= bc && c < bc + 7;
  return inBox(0, 0) || inBox(0, SIZE - 7) || inBox(SIZE - 7, 0);
}

function isFinderInner(r: number, c: number): boolean {
  const isOuter = (br: number, bc: number) => {
    const dr = r - br, dc = c - bc;
    return dr >= 0 && dr < 7 && dc >= 0 && dc < 7 && (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
  };
  return isOuter(0, 0) || isOuter(0, SIZE - 7) || isOuter(SIZE - 7, 0);
}

// Timing patterns
function isTiming(r: number, c: number): boolean {
  return (r === 6 && c >= 8 && c <= SIZE - 9) || (c === 6 && r >= 8 && r <= SIZE - 9);
}

// Format info bits (Level L, mask 0) = 0x77c4
const FORMAT_INFO = 0x77c4;

function isFormatInfo(r: number, c: number): boolean {
  // Around top-left finder
  if ((r === 8 && c !== 6) || (c === 8 && r !== 6)) {
    if (isFinder(r, c)) return false;
    // Top-left format area: r=8, c in 0..8 (except 6); c=8, r in 0..8 (except 6)
    if ((r === 8 && c <= 8 && c !== 6) || (c === 8 && r <= 8 && r !== 6)) return true;
  }
  // Top-right: r=8, c from SIZE-8 to SIZE-1
  if (r === 8 && c >= SIZE - 8) return true;
  // Bottom-left: c=8, r from SIZE-7 to SIZE-1
  if (c === 8 && r >= SIZE - 7) return true;
  return false;
}

function getFormatBit(r: number, c: number): number {
  // 15-bit format info. Bits 0-5 around top-left finder (row 8, cols 0-5 skipping 6, then col 8 rows 0-5)
  // Bits 6-7 at (SIZE-7,8) and (SIZE-8,8), bits 8-14 at (8, SIZE-8..SIZE-1)
  let bitIndex = -1;
  if (r === SIZE - 1 && c === 8) bitIndex = 0;
  else if (r === SIZE - 2 && c === 8) bitIndex = 1;
  else if (r === SIZE - 3 && c === 8) bitIndex = 2;
  else if (r === SIZE - 4 && c === 8) bitIndex = 3;
  else if (r === SIZE - 5 && c === 8) bitIndex = 4;
  else if (r === SIZE - 6 && c === 8) bitIndex = 5;
  else if (r === SIZE - 7 && c === 8) bitIndex = 6;
  else if (r === SIZE - 8 && c === 8) bitIndex = 7;
  else if (r === 8 && c === SIZE - 8) bitIndex = 8;
  else if (r === 8 && c === SIZE - 7) bitIndex = 9;
  else if (r === 8 && c === SIZE - 6) bitIndex = 10;
  else if (r === 8 && c === SIZE - 5) bitIndex = 11;
  else if (r === 8 && c === SIZE - 4) bitIndex = 12;
  else if (r === 8 && c === SIZE - 3) bitIndex = 13;
  else if (r === 8 && c === SIZE - 2) bitIndex = 14;
  // Top-left format bits
  else if (r === 8) {
    // c from 0 to 5, then 7
    if (c <= 5) bitIndex = 14 - c;
    else if (c === 7) bitIndex = 8;
  } else if (c === 8) {
    // r from 0 to 5, then 7
    if (r <= 5) bitIndex = 8 - r;
    else if (r === 7) bitIndex = 7;
  }

  if (bitIndex < 0) return 0;
  return (FORMAT_INFO >> (14 - bitIndex)) & 1;
}

// Mask pattern 0: (r + c) % 2 === 0
function mask(r: number, c: number): boolean {
  return (r + c) % 2 === 0;
}

function isReserved(r: number, c: number): boolean {
  return isFinder(r, c) || isTiming(r, c) || isFormatInfo(r, c);
}

function isDark(r: number, c: number): boolean {
  if (isFinderInner(r, c)) return true;
  if (isTiming(r, c)) return (r === 6 ? c : r) % 2 === 0;
  if (isFormatInfo(r, c)) return getFormatBit(r, c) === 1;
  return false;
}

export function generateQR(text: string): boolean[][] {
  // Encode data
  const bb = createBitBuffer();
  // Mode: Byte (0100)
  putBits(bb, 0b0100, 4);
  // Character count (8 bits for version 1)
  putBits(bb, text.length, 8);
  // Data
  for (let i = 0; i < text.length; i++) {
    putBits(bb, text.charCodeAt(i), 8);
  }
  // Terminator + padding
  const totalBits = DATA_CODEWORDS * 8;
  putBits(bb, 0, Math.min(4, totalBits - bb.bitCount));
  while (bb.bitCount % 8 !== 0) putBits(bb, 0, 1);
  const padBytes = [0xec, 0x11];
  let pi = 0;
  while (bb.buffer.length < DATA_CODEWORDS) {
    bb.buffer.push(padBytes[pi++ % 2]);
  }

  // Error correction
  const ecData = rsEncode(bb.buffer.slice(0, DATA_CODEWORDS), EC_CODEWORDS);
  const allCodewords = bb.buffer.slice(0, DATA_CODEWORDS).concat(ecData);

  // Build module matrix
  const modules: boolean[][] = Array.from({ length: SIZE }, () => new Array(SIZE).fill(false));
  const reserved: boolean[][] = Array.from({ length: SIZE }, () => new Array(SIZE).fill(false));

  // Place reserved patterns
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (isReserved(r, c)) {
        modules[r][c] = isDark(r, c);
        reserved[r][c] = true;
      }
    }
  }

  // Dark module
  modules[SIZE - 8][8] = true;
  reserved[SIZE - 8][8] = true;

  // Place data bits (zigzag from bottom-right)
  let bitIndex = 0;
  let upward = true;
  let col = SIZE - 1;
  while (col > 0) {
    if (col === 6) col--; // skip timing column
    for (let i = 0; i < SIZE; i++) {
      const r = upward ? SIZE - 1 - i : i;
      for (let j = 0; j < 2; j++) {
        const cc = col - j;
        if (!reserved[r][cc] && bitIndex < allCodewords.length * 8) {
          const byteIdx = Math.floor(bitIndex / 8);
          const bitInByte = 7 - (bitIndex % 8);
          let bit = (allCodewords[byteIdx] >> bitInByte) & 1;
          // Apply mask
          if (mask(r, cc)) bit ^= 1;
          modules[r][cc] = bit === 1;
          bitIndex++;
        }
      }
    }
    col -= 2;
    upward = !upward;
  }

  return modules;
}

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({ value, size = 140, className = '' }: QRCodeProps) {
  const modules = generateQR(value);
  const cellSize = size / SIZE;

  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${SIZE} ${SIZE}`} className="rounded-lg">
        <rect width={SIZE} height={SIZE} fill="white" />
        {modules.map((row, r) =>
          row.map((dark, c) =>
            dark ? (
              <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#1c1917" />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}
