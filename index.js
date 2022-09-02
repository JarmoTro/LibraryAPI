const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bookRoutes = require('../LibraryAPI/routes/bookRoutes');
const loanRoutes = require('../LibraryAPI/routes/loanRoutes');
const app = express();

require('dotenv').config()

app.use(bookRoutes);
app.use(loanRoutes);
app.use(cors());        
app.use(express.json()) 

mongoose.connect(process.env.DB_CONNECTION);


app.listen(process.env.PORT || 3000);