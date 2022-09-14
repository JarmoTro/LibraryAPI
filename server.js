const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes');
const userRoutes = require('./routes/userRoutes');
const mockRoutes = require('./routes/mockBookRoutes');
const passport = require('passport');
const session = require('express-session');
const app = express();
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger.json')
require('dotenv').config()

mongoose.connect(process.env.DB_CONNECTION);

app.use(cors());        
app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(bookRoutes);
app.use(loanRoutes);
app.use(userRoutes);
//app.use(mockRoutes);

const DisableTryItOutPlugin = function() {
    return {
      statePlugins: {
        spec: {
          wrapSelectors: {
            allowTryItOutFor: () => () => false
          }
        }
      }
    }
  }
  
  const options = {
    swaggerOptions: {
        plugins: [
             DisableTryItOutPlugin
        ]
     }
  };

app.use('/docs',swaggerUI.serve, swaggerUI.setup(swaggerDocument, options))


app.listen(process.env.PORT || 3000 , () => {
    console.log("API is now running.")
});