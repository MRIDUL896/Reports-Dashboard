const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());

app.get('/api/interviews', async (req, res) => {
    try {
      const response = await axios.get('https://api.althire.ai/assignment/fullstack01');
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data' });
    }
  });

const port = process.env.PORT;
app.listen(port, ()=> {
    console.log(`server started on port ${port}`);
})