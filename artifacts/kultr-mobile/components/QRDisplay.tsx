import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

// GF(256) tables for Reed-Solomon computation
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
let x = 1;
for (let i = 0; i < 255; i++) {
  EXP[i] = x;
  EXP[i + 255] = x;
  LOG[x] = i;
  x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
}

function gmul(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]];
}

function rsEncode(data: number[], ecCount: number): number[] {
  let poly = [1];
  for (let i = 0; i < ecCount; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gmul(poly[j], EXP[i]);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  const res = new Array(data.length + ecCount).fill(0);
  for (let i = 0; i < data.length; i++) res[i] = data[i];
  for (let i = 0; i < data.length; i++) {
    const coef = res[i];
    if (coef !== 0) {
      for (let j = 0; j < poly.length; j++) {
        res[i + j] ^= gmul(poly[j], coef);
      }
    }
  }
  return res.slice(data.length);
}

export function generateQRMatrix(text: string): number[][] {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    bytes.push(text.charCodeAt(i) & 0xff);
  }

  let version = 1;
  let totalCodewords = 26;
  let ecCodewords = 7;
  let dataCapacity = 19;
  let alignmentCenter = 0;

  if (bytes.length > 17) {
    version = 2;
    totalCodewords = 44;
    ecCodewords = 10;
    dataCapacity = 34;
    alignmentCenter = 18;
  }
  if (bytes.length > 32) {
    version = 3;
    totalCodewords = 70;
    ecCodewords = 15;
    dataCapacity = 55;
    alignmentCenter = 22;
  }

  const size = 17 + 4 * version;

  const bitStream: number[] = [];
  function putBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bitStream.push((val >> i) & 1);
    }
  }

  putBits(0b0100, 4); // 8-bit Byte mode
  putBits(bytes.length, 8); // Character count
  for (const b of bytes) {
    putBits(b, 8);
  }
  putBits(0, 4); // Terminator

  while (bitStream.length % 8 !== 0) bitStream.push(0);

  const dataCodewords: number[] = [];
  for (let i = 0; i < bitStream.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bitStream[i + j];
    }
    dataCodewords.push(b);
  }

  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (dataCodewords.length < dataCapacity) {
    dataCodewords.push(padBytes[padIdx]);
    padIdx = (padIdx + 1) % 2;
  }

  const ec = rsEncode(dataCodewords, ecCodewords);
  const allCodewords = [...dataCodewords, ...ec];

  const matrix: (boolean | null)[][] = Array.from({ length: size }, () =>
    new Array(size).fill(null),
  );
  const isFunction: boolean[][] = Array.from({ length: size }, () =>
    new Array(size).fill(false),
  );

  function setFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const tr = row + r;
        const tc = col + c;
        if (tr >= 0 && tr < size && tc >= 0 && tc < size) {
          isFunction[tr][tc] = true;
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            matrix[tr][tc] =
              r === 0 ||
              r === 6 ||
              c === 0 ||
              c === 6 ||
              (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          } else {
            matrix[tr][tc] = false;
          }
        }
      }
    }
  }

  setFinder(0, 0);
  setFinder(0, size - 7);
  setFinder(size - 7, 0);

  if (alignmentCenter > 0) {
    const ar = alignmentCenter;
    const ac = alignmentCenter;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const tr = ar + r;
        const tc = ac + c;
        isFunction[tr][tc] = true;
        matrix[tr][tc] =
          Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
      }
    }
  }

  for (let i = 8; i < size - 8; i++) {
    if (!isFunction[6][i]) {
      isFunction[6][i] = true;
      matrix[6][i] = i % 2 === 0;
    }
    if (!isFunction[i][6]) {
      isFunction[i][6] = true;
      matrix[i][6] = i % 2 === 0;
    }
  }

  matrix[4 * version + 9][8] = true;
  isFunction[4 * version + 9][8] = true;

  for (let i = 0; i < 9; i++) {
    if (!isFunction[8][i]) isFunction[8][i] = true;
    if (!isFunction[i][8]) isFunction[i][8] = true;
  }
  for (let i = size - 8; i < size; i++) {
    if (!isFunction[8][i]) isFunction[8][i] = true;
    if (!isFunction[i][8]) isFunction[i][8] = true;
  }

  const allBits: number[] = [];
  for (const cw of allCodewords) {
    for (let i = 7; i >= 0; i--) {
      allBits.push((cw >> i) & 1);
    }
  }

  let bitIdx = 0;
  let upwards = true;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--;
    const rows = upwards
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const r of rows) {
      for (const c of [right, right - 1]) {
        if (!isFunction[r][c]) {
          const bit = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
          const mask = (r + c) % 2 === 0;
          matrix[r][c] = (bit ^ (mask ? 1 : 0)) === 1;
        }
      }
    }
    upwards = !upwards;
  }

  // Precomputed 15-bit BCH encoded format for L, Mask 0
  const formatBits = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0];
  for (let i = 0; i <= 5; i++) matrix[8][i] = formatBits[i] === 1;
  matrix[8][7] = formatBits[6] === 1;
  matrix[8][8] = formatBits[7] === 1;
  matrix[7][8] = formatBits[8] === 1;
  for (let i = 9; i < 15; i++) matrix[14 - i][8] = formatBits[i] === 1;

  for (let i = 0; i < 8; i++) matrix[8][size - 1 - i] = formatBits[14 - i] === 1;
  for (let i = 0; i < 7; i++) matrix[size - 7 + i][8] = formatBits[i] === 1;

  return matrix.map((row) => row.map((cell) => (cell ? 1 : 0)));
}

interface QRDisplayProps {
  value?: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function QRDisplay({
  value = "KTR-BAR-8X29Q",
  size = 220,
  color = "#000000",
  backgroundColor = "#FFFFFF",
}: QRDisplayProps) {
  const matrix = useMemo(() => {
    try {
      return generateQRMatrix(value);
    } catch {
      return generateQRMatrix("KTR-BAR-DEFAULT");
    }
  }, [value]);

  const moduleCount = matrix.length;
  const cellSize = size / moduleCount;

  // Build SVG path data for dark modules for max rendering performance
  const svgPath = useMemo(() => {
    let d = "";
    matrix.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (cell === 1) {
          d += `M${ci * cellSize},${ri * cellSize}h${cellSize}v${cellSize}h-${cellSize}z `;
        }
      });
    });
    return d;
  }, [matrix, cellSize]);

  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <Svg width={size} height={size}>
        <Path d={svgPath} fill={color} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    borderRadius: 14,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
