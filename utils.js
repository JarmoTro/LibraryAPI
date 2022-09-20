
const partialBookDTO = require('./models/DTOs/partialBookDTO')
const partialUserDTO = require('./models/DTOs/partialUserDTO');



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
}