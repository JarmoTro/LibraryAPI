const { faker } = require('@faker-js/faker');
const partialBookDTO = require('../models/DTOs/partialBookDTO')
const partialUserDTO = require('../models/DTOs/partialUserDTO');
const bookSchema = require('../models/book');
const loanSchema = require('../models/loan');
const reviewSchema = require('../models/review');
const userSchema = require('../models/user');
const reviewDTO = require('../models/DTOs/reviewDTO');
const loanDTO = require('../models/DTOs/loanDTO');
const passport = require('passport');
const user = require('../models/user');
var mongoose = require('mongoose');

module.exports = {
    convertUser: function(users){
        const DTOArray = [];
        users.forEach(user => {
            const DTO = partialUserDTO(user);
            DTOArray.push(DTO)
        });
          return DTOArray;
      },
      convertBook: function(books){
        const DTOArray = [];
        books.forEach(book => {
            const DTO = partialBookDTO(book);
            DTOArray.push(DTO)
        });
          return DTOArray;
      },
      convertLoan: function(loans){
        const DTOArray = [];
        loans.forEach(loan => {
            const DTO = loanDTO(loan);
            DTOArray.push(DTO)
        });
          return DTOArray;
      },
      convertReview: function(reviews){
        const DTOArray = [];
        reviews.forEach(review => {
            const DTO = reviewDTO(review);
            DTOArray.push(DTO)
        });
          return DTOArray;
      },
      seedDB: function(){
                const user = new userSchema({
                    username: faker.name.firstName()
                })
                userSchema.register(user, "123");
                for(let i = 0; i<5; i++){
                    const newBook = new bookSchema({
                        title: faker.word.verb(),
                        author: faker.name.fullName(),
                        length: faker.random.numeric(3),
                        stock: faker.random.numeric(),
                        ISBN: faker.random.numeric(7),
                        genre: faker.music.genre(),
                        imgSource: faker.image.imageUrl(),
                        description: faker.lorem.sentences(20),
                        publicationDate: faker.date.future()              
                    })
                    newBook.save();

                    for(let j = 0; j<5; j++){
                        const newLoan = new loanSchema({
                            loanStart: faker.date.between(),
                            loanEnd: faker.date.future(),
                            user: user._id.toString(),
                            book: newBook._id.toString()
                        })
                        newLoan.save();
                    }

                    
                    for(let l = 0; l<5; l++){
                        const newReview = new reviewSchema({
                            title: faker.word.verb(),
                            body: faker.lorem.paragraph(),
                            rating: faker.random.numeric(1),
                            author: mongoose.Types.ObjectId(user._id),
                            book: newBook._id.toString()
                        })
                        newReview.save();
                    }
                    
                }
      }
}