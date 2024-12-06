const PORT = 8000
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post('/gemini', async (req, res) => {
  console.log('body', req.body)
  const model = genAI.getGenerativeModel({
    model: "gemini-pro", generationConfig: {
      // candidateCount: 1,
      // stopSequences: ["x"],
      // // maxOutputTokens: 20,
      // temperature: 1.0,
    },
  });

  const chat = model.startChat({
    history: req.body.history,
  });
  const msg = req.body.message;

  const result = await chat.sendMessage(msg);

  // res.header('content-type', 'text/plain')
  // for await (const chunk of result.stream) {
  //   res.write(chunk.text())
  //   // console.log('fizh', chunk.text())
  // }
  // res.end();
  const response = result.response
  const text = response.text();
  res.send(text);
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));