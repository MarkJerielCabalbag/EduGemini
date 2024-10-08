export function generateAI(filesToBePrompted, model) {
  try {
    async function runGemini() {
      const studentFeedbackPrompt = `Evaluate the submissions [${filesToBePrompted.toString()}] against the guidelines set in the instruction file [${instructionFile}]. Highlight effective elements and provide recommendations for improving coherence and argumentation.`;
      const generateStudentFeedback = await model.generateContent([
        studentFeedbackPrompt,
        ...filesToBePrompted.toString(),
      ]);
      const geminiResponseStudentFeedback =
        await generateStudentFeedback.response;
      const studentFeedbackResult = geminiResponseStudentFeedback.text();
      // console.log(studentFeedbackResult);

      // Request a numerical score
      const scorePrompt = `Based on the feedback provided [${studentFeedbackResult}], assign a total score provided in the [${instructionFile}] for the student's submission. Return only a number, dont include any explanations, i just want the exact number or total score. Additionally, if the answers of student does not aligned to the instruction provided, the score should automatically zero (0) `;
      const generateStudentScore = await model.generateContent(scorePrompt);
      const geminiStudentScoreResponse = await generateStudentScore.response;

      // Ensure the score is parsed as a number
      const studentScoreResult = parseFloat(
        geminiStudentScoreResponse.text().trim()
      );
      console.log("Student Score:", studentScoreResult);

      const teacherFeedbackPrompt = `As you generate a feedback for students submission feedback [${studentFeedbackResult}], based on this student feedback, what or how do I improved my teaching to student based on the student submission feedback [${studentFeedbackResult}]. Suggest improvements to further nurture my student`;
      const generateTeacherFeedback = await model.generateContent(
        teacherFeedbackPrompt
      );
      const geminiTeacherFeedbackResponse =
        await generateTeacherFeedback.response;
      const teacherFeedbackResult = geminiTeacherFeedbackResponse.text();
      console.log(teacherFeedbackResult);
    }
    runGemini();
  } catch (error) {
    console.log(error);
  }
}
