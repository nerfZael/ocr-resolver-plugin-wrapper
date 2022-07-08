import {
  Client,
  Module,
  Args_tryResolveUri,
  Args_getFile,
  UriResolver_MaybeUriOrManifest,
  Bytes,
  manifest,
} from "./wrap";

import { PluginFactory } from "@polywrap/core-js";
import { constants, DEFAULT_OCR_NETWORK_PROVIDER, WRAP_MANIFEST_FILE_NAME } from "./constants";
import { ethers } from "ethers";
import { OcrId, decodeOcrIdFromContenthash } from "@nerfzael/ocr-core";
import { deserializeOcrPath, getFilesFromOcrId, getFileFromPath } from "./utils";
import { InMemoryFile } from "@nerfzael/encoding";

export type Address = string;

export interface Addresses {
  [network: string]: Address;
}

export interface OcrResolverPluginConfig {
  addresses?: Addresses;
  provider?: ethers.providers.Provider;
}

export class OcrResolverPlugin extends Module<OcrResolverPluginConfig> {
  public static defaultAddress = constants.networks.polygon.address;

  constructor(config?: OcrResolverPluginConfig) {
    super(config ?? {});

    if (this.config.addresses) {
      this._setAddresses(this.config.addresses);
    }
  }

  async tryResolveUri(
    args: Args_tryResolveUri,
    client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    let ocrId: OcrId;

    if (args.authority === "contenthash") {
      const result = decodeOcrIdFromContenthash(args.path);

      if (!result) {
        return this.notFound();
      }

      ocrId = result;
    } else if(args.authority === "ocr") {
      const result = deserializeOcrPath(args.path);

      if (!result) {
        return this.notFound();
      }

      ocrId = result.ocrId;
    } else {
      return this.notFound();
    }

    try {
      const provider = this.config.provider ?? ethers.getDefaultProvider(DEFAULT_OCR_NETWORK_PROVIDER);

      const files = await getFilesFromOcrId(ocrId, provider);
      
      if(!files || !files.length) { 
        return { uri: null, manifest: null };
      }

      const manifestBytes = files.find((x: InMemoryFile) => x.path === WRAP_MANIFEST_FILE_NAME)?.content;

      return {
        manifest: manifestBytes,
      };
    } catch (e) {
      return { uri: null, manifest: null };
    }
  }

  async getFile(args: Args_getFile, _client: Client): Promise<Bytes | null> {
    let ocrId: OcrId;
    let rest: string;

    if (args.path.startsWith("0x")) {
      const parts = args.path.split("/");
      rest = parts.slice(1, parts.length).join("/");

      const result = decodeOcrIdFromContenthash(parts[0]);

      if (!result) {
        return null;
      }

      ocrId = result;
    } else {
      const result = deserializeOcrPath(args.path);

      if (!result) {
        return null;
      }

      ocrId = result.ocrId;
      rest = result.rest;
    }

    const provider = this.config.provider ?? ethers.getDefaultProvider("https://polygon-rpc.com");
   
    const file = await getFileFromPath(ocrId, rest, provider);
    
    if(!file) { 
      return null;
    }
   
    return file.content
      ? new Uint8Array(file.content)
      : null;
  }

  private _setAddresses(addresses: Addresses): void {
    this.config.addresses = {};

    for (const network of Object.keys(addresses)) {
      this.config.addresses[network] = addresses[network];
    }
  }

  private notFound(): UriResolver_MaybeUriOrManifest {
    return { uri: null, manifest: null };
  }
}

export const ocrResolverPlugin: PluginFactory<OcrResolverPluginConfig> = (
  config?: OcrResolverPluginConfig
) => {
  return {
    factory: () => new OcrResolverPlugin(config),
    manifest,
  };
};

export const plugin = ocrResolverPlugin;
