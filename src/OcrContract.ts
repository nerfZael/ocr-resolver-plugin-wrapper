import { Provider } from "@ethersproject/abstract-provider";
import { Contract, Signer } from "ethers";

export class OcrContract extends Contract {
  static create(contractAddress: string, providerOrSigner: Provider | Signer): Contract {
    return new Contract(contractAddress, [
      "event PackagePart(uint256 indexed packageId, bytes data)",
      "event StartPublish(address indexed author, uint256 indexed packageId)",
      "function startPublish(bytes memory data, bool end) public returns(uint256)",
      "function publishPart(uint256 id, bytes memory data, bool end) public",
      "function package(uint256 id) public view returns(tuple(uint256 partCount, uint256 startBlock, uint256 endBlock, address author))"
    ], providerOrSigner);
  }
}