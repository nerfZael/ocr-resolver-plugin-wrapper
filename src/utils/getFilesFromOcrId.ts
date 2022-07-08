import { ethers } from "ethers";
import { fetchPackageFiles } from "./fetchPackageFiles";
import { OcrId } from "@nerfzael/ocr-core";
import { InMemoryFile } from "@nerfzael/encoding";

export const getFilesFromOcrId = async (ocrId: OcrId, provider: ethers.providers.Provider): Promise<InMemoryFile[] | undefined> => {
  const files = await fetchPackageFiles(
    ocrId,
    provider
  );

  return files;
};