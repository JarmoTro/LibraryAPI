const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const invalidRoute = require('./routes/404route');
const mockBookRoutes = require('./routes/mockBookRoutes');
const mockLoanRoutes = require('./routes/mockLoanRoutes');
const mockUserRoutes = require('./routes/mockUserRoutes');
const app = express();
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger.json')
const utils = require('./utils/utils');
const multer = require('multer');
const bodyParser = require('body-parser');

require('dotenv').config()

mongoose.connect(process.env.DB_CONNECTION);

app.use(cors());
app.use(express.json());
app.use(express.static('data'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './data/bookCovers');
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
      cb(null, true);
  } else {
      cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
      fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


app.post('/stats',  function (req, res) {
  console.log(req.file)
  console.log(req.body)
  let uploadCover = upload.single('coverImg')
  uploadCover(req, res, function(err){
  })

});


app.use(bookRoutes);
app.use(loanRoutes);
app.use(userRoutes);
app.use(reviewRoutes);

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

app.use(invalidRoute)
//app.use(mockBookRoutes);
//app.use(mockLoanRoutes);
//app.use(mockUserRoutes);




//utils.seedDB();


app.listen(process.env.PORT || 3000 , () => {
    console.log("API is now running.")
});