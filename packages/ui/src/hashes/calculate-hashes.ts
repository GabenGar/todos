import {
  createMD5,
  createSHA1,
  createSHA3,
  createSHA256,
  createSHA512,
  type IHasher,
} from "hash-wasm";
import type { IHashData } from "./types";

export async function calculteHashes( input: File ): Promise< IHashData > {
  const hashers: Record< keyof IHashData, IHasher > = {
    md5: await createMD5(),
    sha1: await createSHA1(),
    sha256: await createSHA256(),
    sha512: await createSHA512(),
    sha3: await createSHA3(),
  };

  for ( const hasher of Object.values( hashers ) ) {
    hasher.init();
  }

  const readableStream = input.stream();

  for await ( const chunk of readableStream ) {
    hashers.md5.update( chunk );
    hashers.sha1.update( chunk );
    hashers.sha256.update( chunk );
    hashers.sha512.update( chunk );
    hashers.sha3.update( chunk );
  }

  const hashData: IHashData = {
    md5: hashers.md5.digest( "hex" ),
    sha1: hashers.sha1.digest( "hex" ),
    sha256: hashers.sha256.digest( "hex" ),
    sha512: hashers.sha512.digest( "hex" ),
    sha3: hashers.sha3.digest( "hex" ),
  };

  return hashData;
}
