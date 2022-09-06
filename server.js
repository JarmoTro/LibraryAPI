const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes');
const app = express();
require('dotenv').config()

mongoose.connect(process.env.DB_CONNECTION);

app.use(cors());        
app.use(express.json()) 

app.use(bookRoutes);
app.use(loanRoutes);



app.listen(process.env.PORT || 3000 , () => {
    console.log("API is now running.")
});