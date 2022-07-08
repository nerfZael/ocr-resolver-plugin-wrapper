import { ethers } from "ethers";
import { OcrId } from "@nerfzael/ocr-core";

export const deserializeOcrPath = (path: string): {
  ocrId: OcrId,
  rest: string
} | undefined => {
  const parts = path.split("/");
  const [version, chainId, contractAddress, packageIndex, startBlock, endBlock] = parts;

  if (version && chainId && contractAddress && packageIndex) {
    const rest = parts.slice(6, parts.length);
    
    return {
      ocrId: {
        protocolVersion: parseInt(version),
        chainId: parseInt(chainId),
        contractAddress: contractAddress,
        packageIndex: ethers.BigNumber.from(packageIndex).toNumber(),
        startBlock: ethers.BigNumber.from(startBlock).toNumber(),
        endBlock: ethers.BigNumber.from(endBlock).toNumber(),
      },
      rest: rest.join("/")
    };
  }

  return undefined;
};
