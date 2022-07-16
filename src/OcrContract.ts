import { Provider } from "@ethersproject/abstract-provider";
import { buildOcrContractAbi } from "@nerfzael/ocr-core";
import { Contract, Signer } from "ethers";

export class OcrContract extends Contract {
  static create(protocolVersion: number, contractAddress: string, providerOrSigner: Provider | Signer): Contract {
    const abi = buildOcrContractAbi(protocolVersion);
    if (!abi) {
      throw new Error(`Unsupported OCR protocol version: ${protocolVersion}`);
    }
    
    return new Contract(contractAddress, abi, providerOrSigner);
  }
}