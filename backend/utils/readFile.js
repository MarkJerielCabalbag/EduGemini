import officeParser from "officeparser";
import fs from "fs";
export async function readFileType(path, format) {
  let files;
  try {
    let finalPath = fs.readFileSync(`./${path}`);

    if (
      format === "docx" ||
      format === "pptx" ||
      format === "xlsx" ||
      format === "pdf"
    ) {
      files = await officeParser.parseOfficeAsync(finalPath);
    }
    console.log(files);
  } catch (error) {
    console.log(error);
  }
}
