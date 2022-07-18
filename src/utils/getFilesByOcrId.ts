import { ethers } from "ethers";
import { fetchPackageDataV1 } from "./fetchPackageDataV1";
import { decodeFiles } from "@nerfzael/encoding";
import { OcrId } from "@nerfzael/ocr-core";
import { InMemoryFile } from "@nerfzael/memory-fs";
import { BYTES_FOR_FILE_PATH, BYTES_FOR_FILE_SIZE } from "../constants";

export const getFilesByOcrId = async (
  ocrId: OcrId,
  provider: ethers.providers.Provider
): Promise<InMemoryFile[]> => {
  if (ocrId.protocolVersion !== 1) {
    throw new Error(`Unsupported OCR version: ${ocrId.protocolVersion}`);
  }

  const data = await fetchPackageDataV1(ocrId, provider);

  return decodeFiles(data, BYTES_FOR_FILE_PATH, BYTES_FOR_FILE_SIZE);
};

