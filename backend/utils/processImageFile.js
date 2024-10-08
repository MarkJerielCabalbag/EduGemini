export async function processImageFile(uploadResult, model, mimeType) {
  const result = await model.generateContent([
    "Analyze and describe the image provided as this serves as the answer of the student.",
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType,
      },
    },
  ]);

  return result.response.text();
}
// if (studentFiles.length > 1) {
//     let filesToBeprompted = [];
//     const classworkPath = workIndex.classwork_folder_path;
//     const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
//     studentFiles.forEach(async (file) => {
//       let instructionFile;
//       let instructionPath = fs.readFileSync(
//         `./${classworkPath}/instruction/${classworkAttachFile}`
//       );
//       const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
//       let instructionFormat = classworkAttachFile.split(".").pop();

//       if (
//         instructionFormat === "docx" ||
//         instructionFormat === "pdf" ||
//         instructionFormat === "txt"
//       ) {
//         instructionFile = await officeParser.parseOfficeAsync(instructionPath);
//       } else if (instructionFormat === "png") {
//         const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

//         const uploadResult = await fileManager.uploadFile(
//           `${classworkPath}/instruction/${classworkAttachFile}`,
//           {
//             mimeType: "image/png",
//             displayName: `${file.filename}`,
//           }
//         );

//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//         const result = await model.generateContent([
//           "I want you to copy the text of this image because this will serve as instruction, if any visual elements are included in this image, i want you to describe it accurately without changing the instructions.",
//           {
//             fileData: {
//               fileUri: uploadResult.file.uri,
//               mimeType: uploadResult.file.mimeType,
//             },
//           },
//         ]);

//         instructionFile = result.response.text();
//       } else if (instructionFormat === "jpg") {
//         const uploadResult = await fileManager.uploadFile(
//           `${classworkPath}/instruction/${classworkAttachFile}`,
//           {
//             mimeType: "image/jpeg",
//             displayName: `${file.filename}`,
//           }
//         );

//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//         const result = await model.generateContent([
//           "I want you to copy the text of this image because this will serve as instruction, if any visual elements are included in this image, i want you to describe it accurately without changing the instructions.",
//           {
//             fileData: {
//               fileUri: uploadResult.file.uri,
//               mimeType: uploadResult.file.mimeType,
//             },
//           },
//         ]);

//         instructionFile = result.response.text();
//       }
//       try {
//         let fileFormat = file.filename.split(".").pop();
//         let studentFiles;
//         let answerPath = fs.readFileSync(
//           `${classworkPath}/answers${file.path}/${file.filename}`
//         );
//         if (
//           fileFormat === "docx" ||
//           fileFormat === "pptx" ||
//           fileFormat === "xlsx" ||
//           fileFormat === "pdf"
//         ) {
//           studentFiles = await officeParser.parseOfficeAsync(answerPath);
//         } else if (fileFormat === "png") {
//           const uploadResult = await fileManager.uploadFile(
//             `${classworkPath}/answers${file.path}/${file.filename}`,
//             {
//               mimeType: "image/png",
//               displayName: `${file.filename}`,
//             }
//           );
//           const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//           const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//           studentFiles = fileToGenerativePart(answerPath, "image/png");
//           const result = await model.generateContent([
//             "Analyze and describe the image provided as this serves as the answer of the student.",
//             {
//               fileData: {
//                 fileUri: uploadResult.file.uri,
//                 mimeType: uploadResult.file.mimeType,
//               },
//             },
//           ]);
//           studentFiles = result.response.text();
//         } else if (fileFormat === "jpg") {
//           const uploadResult = await fileManager.uploadFile(
//             `${classworkPath}/answers${file.path}/${file.filename}`,
//             {
//               mimeType: "image/png",
//               displayName: `${file.filename}`,
//             }
//           );
//           const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//           const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//           studentFiles = fileToGenerativePart(answerPath, "image/jpeg");
//           const result = await model.generateContent([
//             "Analyze and describe the image provided as this serves as the answer of the student.",
//             {
//               fileData: {
//                 fileUri: uploadResult.file.uri,
//                 mimeType: uploadResult.file.mimeType,
//               },
//             },
//           ]);
//           studentFiles = result.response.text();
//         }

//         filesToBeprompted.push(studentFiles);
//         console.log("Files to be prompted", filesToBeprompted.toString());
//         console.log("INSTRUCTION FILE", instructionFile);

//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         async function runGemini() {
//           const studentFeedbackPrompt = `Evaluate the submissions [${filesToBeprompted.toString()}] against the guidelines set in the instruction file [${instructionFile}]. Highlight effective elements and provide recommendations for improving coherence and argumentation.`;
//           const generateStudentFeedback = await model.generateContent([
//             studentFeedbackPrompt,
//             ...filesToBeprompted.toString(),
//           ]);
//           const geminiResponseStudentFeedback =
//             await generateStudentFeedback.response;
//           const studentFeedbackResult = geminiResponseStudentFeedback.text();
//           // console.log(studentFeedbackResult);

//           // Request a numerical score
//           const scorePrompt = `Based on the feedback provided [${studentFeedbackResult}], assign a total score provided in the [${instructionFile}] for the student's submission. Return only a number, dont include any explanations, i just want the exact number or total score. Additionally, if the answers of student does not aligned to the instruction provided, the score should automatically zero (0) `;
//           const generateStudentScore = await model.generateContent(scorePrompt);
//           const geminiStudentScoreResponse =
//             await generateStudentScore.response;

//           // Ensure the score is parsed as a number
//           const studentScoreResult = parseFloat(
//             geminiStudentScoreResponse.text().trim()
//           );
//           // console.log("Student Score:", studentScoreResult);

//           const teacherFeedbackPrompt = `As you generate a feedback for students submission feedback [${studentFeedbackResult}], based on this student feedback, what or how do I improved my teaching to student based on the student submission feedback [${studentFeedbackResult}]. Suggest improvements to further nurture my student`;
//           const generateTeacherFeedback = await model.generateContent(
//             teacherFeedbackPrompt
//           );
//           const geminiTeacherFeedbackResponse =
//             await generateTeacherFeedback.response;
//           const teacherFeedbackResult = geminiTeacherFeedbackResponse.text();
//           // console.log(teacherFeedbackResult);

//           studentExist.studentFeedback = studentFeedbackResult;
//           studentExist.score = studentScoreResult;
//           studentExist.teacherFeedback = teacherFeedbackResult;
//           roomExist.classwork[findClasswork] = workIndex;

//           await roomExist.save();
//         }
//         runGemini();
//       } catch (error) {
//         console.log(error);
//       }
//     });
//   } else {
//     const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
//     studentFiles.forEach(async (file) => {
//       let instructionFile;
//       let instructionPath = fs.readFileSync(
//         `./${classworkPath}/instruction/${classworkAttachFile}`
//       );

//       let instructionFormat = classworkAttachFile.split(".").pop();

//       if (
//         instructionFormat === "docx" ||
//         instructionFormat === "pdf" ||
//         instructionFormat === "txt"
//       ) {
//         instructionFile = await officeParser.parseOfficeAsync(instructionPath);
//       } else if (instructionFormat === "png") {
//         const uploadResult = await fileManager.uploadFile(
//           `${classworkPath}/instruction/${classworkAttachFile}`,
//           {
//             mimeType: "image/png",
//             displayName: `${file.filename}`,
//           }
//         );

//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//         const result = await model.generateContent([
//           "I want you to copy the text of this image because this will serve as instruction, if any visual elements are included in this image, i want you to describe it accurately without changing the instructions.",
//           {
//             fileData: {
//               fileUri: uploadResult.file.uri,
//               mimeType: uploadResult.file.mimeType,
//             },
//           },
//         ]);

//         instructionFile = result.response.text();
//       } else if (instructionFormat === "jpg") {
//         const uploadResult = await fileManager.uploadFile(
//           `${classworkPath}/instruction/${classworkAttachFile}`,
//           {
//             mimeType: "image/jpeg",
//             displayName: `${file.filename}`,
//           }
//         );

//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//         const result = await model.generateContent([
//           "I want you to copy the text of this image because this will serve as instruction, if any visual elements are included in this image, i want you to describe it accurately without changing the instructions.",
//           {
//             fileData: {
//               fileUri: uploadResult.file.uri,
//               mimeType: uploadResult.file.mimeType,
//             },
//           },
//         ]);

//         instructionFile = result.response.text();
//       }
//       try {
//         let fileFormat = file.filename.split(".").pop();
//         let studentFiles;
//         let answerPath = fs.readFileSync(
//           `${classworkPath}/answers${file.path}/${file.filename}`
//         );
//         if (
//           fileFormat === "docx" ||
//           fileFormat === "pptx" ||
//           fileFormat === "xlsx" ||
//           fileFormat === "pdf"
//         ) {
//           studentFiles = await officeParser.parseOfficeAsync(answerPath);
//         } else if (fileFormat === "png") {
//           const uploadResult = await fileManager.uploadFile(
//             `${classworkPath}/answers${file.path}/${file.filename}`,
//             {
//               mimeType: "image/png",
//               displayName: `${file.filename}`,
//             }
//           );
//           const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//           const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//           studentFiles = fileToGenerativePart(answerPath, "image/png");
//           const result = await model.generateContent([
//             "Analyze and describe the image provided as this serves as the answer of the student.",
//             {
//               fileData: {
//                 fileUri: uploadResult.file.uri,
//                 mimeType: uploadResult.file.mimeType,
//               },
//             },
//           ]);
//           studentFiles = result.response.text();
//         } else if (fileFormat === "jpg") {
//           const uploadResult = await fileManager.uploadFile(
//             `${classworkPath}/answers${file.path}/${file.filename}`,
//             {
//               mimeType: "image/png",
//               displayName: `${file.filename}`,
//             }
//           );
//           const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//           const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//           studentFiles = fileToGenerativePart(answerPath, "image/jpeg");
//           const result = await model.generateContent([
//             "Analyze and describe the image provided as this serves as the answer of the student.",
//             {
//               fileData: {
//                 fileUri: uploadResult.file.uri,
//                 mimeType: uploadResult.file.mimeType,
//               },
//             },
//           ]);
//           studentFiles = result.response.text();
//         }

//         console.log("INSTRUCTION FILE", instructionFile);

//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         async function runGemini() {
//           const studentFeedbackPrompt = `Evaluate the submissions [${studentFiles}] against the guidelines set in the instruction file [${instructionFile}]. Highlight effective elements and provide recommendations for improving coherence and argumentation.`;
//           const generateStudentFeedback = await model.generateContent([
//             studentFeedbackPrompt,
//             studentFiles,
//           ]);
//           const geminiResponseStudentFeedback =
//             await generateStudentFeedback.response;
//           const studentFeedbackResult = geminiResponseStudentFeedback.text();
//           // console.log(studentFeedbackResult);

//           // Request a numerical score
//           const scorePrompt = `Based on the feedback provided [${studentFeedbackResult}], assign a total score provided in the [${instructionFile}] for the student's submission. Return only a number, dont include any explanations, i just want the exact number or total score. Additionally, if the answers of student does not aligned to the instruction provided, the score should automatically zero (0) `;
//           const generateStudentScore = await model.generateContent(scorePrompt);
//           const geminiStudentScoreResponse =
//             await generateStudentScore.response;

//           // Ensure the score is parsed as a number
//           const studentScoreResult = parseFloat(
//             geminiStudentScoreResponse.text().trim()
//           );
//           // console.log("Student Score:", studentScoreResult);

//           const teacherFeedbackPrompt = `As you generate a feedback for students submission feedback [${studentFeedbackResult}], based on this student feedback, what or how do I improved my teaching to student based on the student submission feedback [${studentFeedbackResult}]. Suggest improvements to further nurture my student`;
//           const generateTeacherFeedback = await model.generateContent(
//             teacherFeedbackPrompt
//           );
//           const geminiTeacherFeedbackResponse =
//             await generateTeacherFeedback.response;
//           const teacherFeedbackResult = geminiTeacherFeedbackResponse.text();
//           // console.log(teacherFeedbackResult);

//           studentExist.studentFeedback = studentFeedbackResult;
//           studentExist.score = studentScoreResult;
//           studentExist.teacherFeedback = teacherFeedbackResult;
//           roomExist.classwork[findClasswork] = workIndex;

//           await roomExist.save();
//         }
//         runGemini();
//       } catch (error) {
//         console.log(error);
//       }
//     });
//   }
