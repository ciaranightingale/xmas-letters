import { Fr } from '@aztec/aztec.js/fields';
import { AztecAddress } from '@aztec/aztec.js/addresses';

/**
 * Convert a string message to a Field that can be stored on Aztec
 * Max 31 bytes per Field
 */
export function stringToField(message: string): Fr {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(message);

  // Truncate to 31 bytes if needed (Field max size)
  const truncated = bytes.slice(0, 31);

  // Pad to 31 bytes
  const padded = new Uint8Array(31);
  padded.set(truncated);

  return Fr.fromBuffer(Buffer.from(padded));
}

/**
 * Convert a Field back to a string
 */
export function fieldToString(field: Fr | bigint): string {
  const fieldValue = typeof field === 'bigint' ? new Fr(field) : field;
  const buffer = fieldValue.toBuffer();

  // Remove padding (null bytes)
  let end = buffer.length;
  while (end > 0 && buffer[end - 1] === 0) {
    end--;
  }

  const decoder = new TextDecoder();
  return decoder.decode(buffer.slice(0, end));
}

/**
 * Validate if a string is a valid Aztec address
 */
export function isValidAztecAddress(address: string): boolean {
  try {
    AztecAddress.fromString(address);
    return true;
  } catch {
    return false;
  }
}
