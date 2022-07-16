import { ethers } from "ethers";
import { OcrId } from "@nerfzael/ocr-core";
import { InMemoryFile } from "@nerfzael/encoding";
import { getFilesByOcrId } from "./getFilesByOcrId";

export const getFileFromPath = async (ocrId: OcrId, path: string, provider: ethers.providers.Provider): Promise<InMemoryFile | undefined> => {
  const files = await getFilesByOcrId(
    ocrId,
    provider
  );

  return files.find(x => x.path === path);
};
