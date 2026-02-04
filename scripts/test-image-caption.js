const { initDatabase } = require('../database/db');
const { createQuestion, getQuestionById, answerQuestionWithImage, getAnsweredQuestions } = require('../database/questionService');

async function run() {
  await initDatabase();

  const prompt = 'A small test image prompt';
  const id = createQuestion(prompt, 'image');
  console.log('Created question id', id);

  // Small transparent 1x1 webp base64-ish placeholder doesn't need to be a valid image for DB test
  const sampleImage = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBwAAAAwAQCdASoEAAQAAVAfFI0AA3AA/vuUAAA=';
  const caption = 'A short caption for the test image';

  answerQuestionWithImage(id, sampleImage, caption);

  const answered = getAnsweredQuestions();
  console.log('Answered questions:', answered.filter(q => q.id === id));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});