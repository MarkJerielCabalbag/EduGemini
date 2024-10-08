import officeParser from "officeparser";
import fs from "fs";
import { processImageFile } from "./processImageFile.js";
export async function processStudentFiles(
  file,
  classworkPath,
  model,
  fileManager
) {
  let studentFiles;
  let fileFormat = file.filename.split(".").pop();
  let answerPath = fs.readFileSync(
    `${classworkPath}/answers${file.path}/${file.filename}`
  );

  try {
    if (
      fileFormat === "docx" ||
      fileFormat === "pptx" ||
      fileFormat === "xlsx" ||
      fileFormat === "pdf"
    ) {
      studentFiles = await officeParser.parseOfficeAsync(answerPath);
    } else if (fileFormat === "jpg") {
      const uploadResult = await fileManager.uploadFile(
        `${classworkPath}/answers${file.path}/${file.filename}`,
        {
          mimeType: "image/png",
          displayName: `${file.filename}`,
        }
      );

      studentFiles = await processImageFile(uploadResult, model, "image/jpeg");
    } else if (fileFormat === "png") {
      const uploadResult = await fileManager.uploadFile(
        `${classworkPath}/answers${file.path}/${file.filename}`,
        {
          mimeType: "image/png",
          displayName: `${file.filename}`,
        }
      );

      studentFiles = await processImageFile(uploadResult, model, "image/png");
    }

    return studentFiles;
  } catch (error) {
    console.log(error);
  }
}

// studentFiles.forEach(async (file) => {
//   let studentAnswers;
//   try {
//     let answerPath = fs.readFileSync(
//       `${classworkPath}/answers${file.path}/${file.filename}`
//     );

//     let answerformat = file.filename.split(".").pop();

//     if (
//       answerformat === "docx" ||
//       answerformat === "pptx" ||
//       answerformat === "xlsx" ||
//       answerformat === "pdf"
//     ) {
//       studentAnswers = await officeParser.parseOfficeAsync(answerPath);
//     } else if (answerformat === "png") {
//       const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

//       const uploadResult = await fileManager.uploadFile(
//         `${classworkPath}/answers${file.path}/${file.filename}`,
//         {
//           mimeType: "image/png",
//           displayName: `${file.filename}`,
//         }
//       );

//       const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       const result = await model.generateContent([
//         "Analyze and describe the image provided. Include details about the subjects present, their appearance, actions, and the setting. Discuss any notable elements such as colors, textures, lighting, and composition. If applicable, explain the cultural, historical, or emotional significance of the image and how it relates to broader themes or contexts. Provide a comprehensive overview that captures the essence of the image and conveys its meaning.",
//         {
//           fileData: {
//             fileUri: uploadResult.file.uri,
//             mimeType: uploadResult.file.mimeType,
//           },
//         },
//       ]);
//       studentAnswers = result.response.text();
//     } else if (answerformat === "jpg") {
//       const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

//       const uploadResult = await fileManager.uploadFile(
//         `${classworkPath}/answers${file.path}/${file.filename}`,
//         {
//           mimeType: "image/jpeg",
//           displayName: `${file.filename}`,
//         }
//       );

//       const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       const result = await model.generateContent([
//         "Analyze and describe the image provided. Include details about the subjects present, their appearance, actions, and the setting. Discuss any notable elements such as colors, textures, lighting, and composition. If applicable, explain the cultural, historical, or emotional significance of the image and how it relates to broader themes or contexts. Provide a comprehensive overview that captures the essence of the image and conveys its meaning.",
//         {
//           fileData: {
//             fileUri: uploadResult.file.uri,
//             mimeType: uploadResult.file.mimeType,
//           },
//         },
//       ]);
//       studentAnswers = result.response.text();
//     }
//     console.log("INSTRUCTION FILE", instructionFile);

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     async function runGemini() {
//       const studentFeedbackPrompt = `Evaluate this submission [${studentAnswers}] based on the provided instructions [${instructionFile}]. Highlight areas of clarity, structure, and content understanding, and suggest improvements, it should be concise and easy to understand`;
//       const generateStudentFeedback = await model.generateContent([
//         studentFeedbackPrompt,
//         studentAnswers,
//       ]);
//       const geminiResponseStudentFeedback =
//         await generateStudentFeedback.response;
//       const studentFeedbackResult = geminiResponseStudentFeedback.text();
//       console.log(studentFeedbackResult);

//       // Request a numerical score
//       const scorePrompt = `Based on the feedback provided [${studentFeedbackResult}], assign a total score provided in the [${instructionFile}] for the student's submission. Return only a number, dont include any explanations, i just want the exact number or total score `;
//       const generateStudentScore = await model.generateContent(scorePrompt);
//       const geminiStudentScoreResponse = await generateStudentScore.response;

//       // Ensure the score is parsed as a number
//       const studentScoreResult = parseFloat(
//         geminiStudentScoreResponse.text().trim()
//       );
//       console.log("Student Score:", studentScoreResult);

//       const teacherFeedbackPrompt = `As you generate a feedback for students submission feedback [${studentFeedbackResult}], based on this student feedback, what or how do I improved my teaching to student based on the student submission feedback [${studentFeedbackResult}]. Suggest improvements to further nurture my student`;
//       const generateTeacherFeedback = await model.generateContent(
//         teacherFeedbackPrompt
//       );
//       const geminiTeacherFeedbackResponse =
//         await generateTeacherFeedback.response;
//       const teacherFeedbackResult = geminiTeacherFeedbackResponse.text();
//       console.log(teacherFeedbackResult);

//       studentExist.studentFeedback = studentFeedbackResult;
//       studentExist.score = studentScoreResult;
//       studentExist.teacherFeedback = teacherFeedbackResult;
//       roomExist.classwork[findClasswork] = workIndex;

//       await roomExist.save();
//     }
//     runGemini();
//   } catch (error) {
//     console.log(error);
//   }
// });
