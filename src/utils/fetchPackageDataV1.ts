import { ethers } from "ethers";
import { OcrId } from "@nerfzael/ocr-core";
import { OcrContract } from "../OcrContract";

export const fetchPackageDataV1 = async (
  ocrId: OcrId,
  provider: ethers.providers.Provider
): Promise<Uint8Array> => {
  const contract = OcrContract.create(ocrId.protocolVersion, ocrId.contractAddress, provider);
  
  const events = await contract.queryFilter(
    contract.filters.PackagePart(ocrId.packageIndex),
    ocrId.startBlock,
    ocrId.endBlock
  );

  const data = events
    .map((x: any) => ethers.utils.arrayify(x.args!.data))
    .reduce((a: any, b: any) => ethers.utils.concat([a, b]));

    return data;
};

