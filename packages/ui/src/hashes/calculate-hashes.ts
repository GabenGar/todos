import {
  createMD5,
  createSHA1,
  createSHA3,
  createSHA256,
  createSHA512,
  type IHasher,
} from "hash-wasm";
import type { IProgressFunction } from "#progress";
import type { IHashData } from "./types";

export async function calculateHashes(
  input: File,
  onProgress?: IProgressFunction,
): Promise< IHashData > {
  const hasherDictionary: Record< keyof IHashData, IHasher > = {
    md5: await createMD5(),
    sha1: await createSHA1(),
    sha256: await createSHA256(),
    sha512: await createSHA512(),
    sha3: await createSHA3(),
  };

  const hashers = Object.values( hasherDictionary );

  for ( const hasher of hashers ) {
    hasher.init();
  }

  const readableStream = input.stream();
  const total = input.size;
  let current = 0;

  for await ( const chunk of readableStream ) {
    for ( const hasher of hashers ) {
      hasher.update( chunk );
    }

    current += chunk.byteLength;

    if ( onProgress ) {
      await onProgress( current, total );
    }
  }

  const hashData: IHashData = {
    md5: hasherDictionary.md5.digest( "hex" ),
    sha1: hasherDictionary.sha1.digest( "hex" ),
    sha256: hasherDictionary.sha256.digest( "hex" ),
    sha512: hasherDictionary.sha512.digest( "hex" ),
    sha3: hasherDictionary.sha3.digest( "hex" ),
  };

  return hashData;
}
