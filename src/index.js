const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes/route');
const app = express();

app.use(express.json());


mongoose.connect("mongodb+srv://avinash01:avikumarsingh@avinash.qmdqwkw.mongodb.net/test", { useNewUrlParser: true})
.then(() => console.log('MongoDb is connected.'))
    .catch(err => console.log(err));

app.use('/', route);

app.use((req, res) => res.status(400).send({ status: false, message: 'Invalid URL' }));
app.listen(3000, () => console.log('Express app is running on port 3000.'));
