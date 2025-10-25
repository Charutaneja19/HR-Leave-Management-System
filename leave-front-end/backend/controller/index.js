const express = require('express');
const app = express();
const cors =  require('cors');
const mongoose = require('mongoose');
const leaveRouter = require('../router/leaveRouter');
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/LEAVE')
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log(err));

app.use('/leave',leaveRouter);

app.listen(8000, () => {
    console.log('app started');
});