import express from 'express';
import * as dotenv from 'dotenv'; // Loads environment variables from .env file
import { Configuration, OpenAIApi } from "openai";
import cors from 'cors';
const app = new express()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
app.use(cors())
app.use(express.json())
app.get('/', async (req, res) => {
    res.status(200).send('ok')
})
app.post('/', async (req, res) => {
    const {prompt} = req.body
    const completion = await openai.createCompletion(
        {
          "prompt":prompt,
          "temperature":0.7,
          "max_tokens": 60,
          "top_p":1,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
//   stop: ["You:"],
          "model": "text-davinci-003",
        //   "stream":true
        }
      );

      console.log(completion)
    res.status(200).json({ result: completion.data.choices[0].text });
})




app.listen(5000, ()=>{
    console.log('app now is runnint on 5000 port');
})