const PNG = /^data:image\/png;base64,[A-Za-z0-9+/]+=*$/;
const MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** A PNG the signature pad made: a PNG's own header, and not absurdly large. */
export function validSignature(image: string): boolean {
  if (image.length > 700_000 || !PNG.test(image)) return false;
  return Buffer.from(image.slice(image.indexOf(",") + 1), "base64").subarray(0, 8).equals(MAGIC);
}
