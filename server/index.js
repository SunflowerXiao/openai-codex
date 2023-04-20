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
    res.status(200).send('hello world')
})
app.post('/', async (req, res) => {
    const {prompt} = req.body
    console.log(prompt)
    try{
      const completion = await openai.createCompletion(
        {
          "prompt": prompt,
          model:"text-davinci-003",
          temperature: 0.5,
          max_tokens: 6400,
          top_p: 1.0,
          frequency_penalty:0.0,
          presence_penalty:0.0,
          stop:["\"\"\""]
        }
      );
      // console.log(completion)
      res.status(200).send({ result: completion.data.choices[0].text });
    } catch(e) {
      res.status(500).send({ error: e });
    }
    
})




app.listen(5000, ()=>{
    console.log('app now is runnint on 5000 port');
})