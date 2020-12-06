import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';

const app = express();
const port = 8888;
const path = require('path');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () => {
  console.log('start on port 8888');
});