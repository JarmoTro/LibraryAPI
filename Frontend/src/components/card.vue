<template>
    <div class="card-group m-3" v-for="row in formattedBooks" :key="row.id">

        <div class="card m-3" style="width: 19rem; max-width: 25%;" v-for="book in row" :key="book.id">
        <a href="#"><img class="card-img-top" v-bind:src=book.imgSource alt="Card image cap"></a>
        <div class="card-body text-center">
            <a href="#" class="text-decoration-none text-dark"><h1 class="card-title">{{book.title}}</h1></a>
            <a style="cursor: pointer" v-on:click="getAuthorBooks(book.author)" class="text-decoration-none text-dark"><h4 class="card-text">{{book.author}}</h4></a>
          <h2 style="margin-top: 0.5rem;">Stock: {{book.stock}}</h2>
        </div>
    </div>

    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'book',
  created() {
    this.getBooks()
  },
  data() {
    return {
      books: [],
      errorMsg: '',
    }
  },
  methods: {
    getBooks() {
      axios
        .get('http://localhost:3000/books/?key=93cfcb80-2db6-11ed-8d13-cdfedc6a1662')
        .then((response) => {
          console.log(response)
          this.books = response.data
        })
        .catch((error) => {
          console.log(error)
          this.errorMsg = 'Error retrieving data'
        })
    },
    getAuthorBooks(author){
          axios
        .get('http://localhost:3000/books/author/'+author+'?key=93cfcb80-2db6-11ed-8d13-cdfedc6a1662')
        .then((response) => {
          console.log(response)
          this.books = response.data
        })
        .catch((error) => {
          console.log(error)
          this.errorMsg = 'Error retrieving data'
        })
      }
  },
  computed: {
      formattedBooks() {
          return this.books.reduce((c, n, i) => {
              if (i % 4 === 0) c.push([]);
              c[c.length - 1].push(n);
              return c;
          }, []);
      }
  }
}

</script>