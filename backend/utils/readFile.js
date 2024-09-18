import officeParser from "officeparser";
import fs from "fs";
async function readFileType(path, format) {
  try {
    let finalPath = fs.readFileSync(`./${path}`);
    let file;

    if (
      format === "docx" ||
      format === "pptx" ||
      format === "xlsx" ||
      format === "pdf"
    ) {
      file = await officeParser.parseOfficeAsync(finalPath);
    }

    console.log(file);
  } catch (error) {
    console.log(error);
  }
}

export default readFileType;
