const { faker } = require('@faker-js/faker');
const partialBookDTO = require('./models/DTOs/partialBookDTO')
const partialUserDTO = require('./models/DTOs/partialUserDTO');
const bookSchema = require('./models/book');
const loanSchema = require('./models/loan');
const reviewSchema = require('./models/review');
const reviewDTO = require('./models/DTOs/reviewDTO');
const loanDTO = require('./models/DTOs/loanDTO');

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
        bookSchema.countDocuments({}, (err, count) => {
            if(count == 0){
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
                        publicationDate: faker.random.numeric(20)               
                    })
                    newBook.save();
                }
            }
        })
      }
}