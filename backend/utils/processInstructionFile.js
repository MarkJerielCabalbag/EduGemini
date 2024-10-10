import fs from "fs-extra";
export async function processInstrcutionFile(
  studentFiles,
  classworkPath,
  classworkAttachFile
) {
  let instructionFile = fs.readFileSync(
    `classworks/${classworkPath}/${classworkAttachFile}`
  );

  return instructionFile;
}
