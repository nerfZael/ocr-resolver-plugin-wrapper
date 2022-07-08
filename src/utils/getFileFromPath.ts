import { ethers } from "ethers";
import { OcrId } from "@nerfzael/ocr-core";
import { fetchPackageFiles } from "./fetchPackageFiles";
import { InMemoryFile } from "@nerfzael/encoding";

export const getFileFromPath = async (ocrId: OcrId, path: string, provider: ethers.providers.Provider): Promise<InMemoryFile | undefined> => {
  const files = await fetchPackageFiles(
    ocrId,
    provider
  );

  return files.find(x => x.path === path);
};
