<template>
    <div class="card-group m-3" v-for="row in formattedBooks" :key="row.id">

        <div class="card m-3" style="width: 19rem; max-width: 25%;" v-for="book in row" :key="book.id">
        <router-link :to="{ name: 'book', params: {id: book._id}}" class="text-decoration-none text-dark"> <img class="card-img-top" v-bind:src=book.imgSource alt="Card image cap">  </router-link>
        <div class="card-body text-center">
            <router-link :to="{ name: 'book', params: {id: book._id}}" class="text-decoration-none text-dark"> <h1 class="card-title hoverBlue">{{book.title}}</h1>  </router-link>
            <router-link :to="{ name: 'author', params: {name: book.author}}"  class="text-decoration-none text-dark"><h4 class="card-text hoverBlue">{{book.author}}</h4> </router-link>
          <h2 style="margin-top: 0.5rem;">Stock: {{book.stock}}</h2>
        </div>
    </div>

    </div>

    <div v-if="error404" class="text-center m-3">
    <h1>404</h1>
    <h2>Looks like we couldn't find what you were looking for :(</h2>
    </div>

</template>

<script>
import axios from 'axios'
export default {
  name: 'book',
  created() {
    if (this.$route.params.name) {
      this.getAuthorBooks(this.$route.params.name)
    }
    if(this.$route.params.keyword){
      this.getBooksByKeyword(this.$route.params.keyword)
    }
    if(!this.$route.params.name && !this.$route.params.keyword) {
          this.getBooks()
    }
  },
  data() {
    return {
      books: [],
      errorMsg: '',
      error404: false
    }
  },
  methods: {
    getBooks() {
      axios
        .get('http://localhost:3000/books/?key='+import.meta.env.VITE_API_KEY)
        .then((response) => {
          console.log(response)
          this.books = response.data
        })
        .catch((error) => {
          console.log(error)
          this.errorMsg = 'Error retrieving data'
        })
    },
    getBooksByKeyword(keyword) {
      axios
        .get('http://localhost:3000/books/search/'+keyword+'?key='+import.meta.env.VITE_API_KEY)
        .then((response) => {
          console.log(response)
          this.books = response.data
          if(this.books.length == 0){this.error404 = true}
        })
        .catch((error) => {
          console.log(error)
          this.errorMsg = 'Error retrieving data'
        })
    },
    getAuthorBooks(author){
          axios
        .get('http://localhost:3000/books/author/'+author+'?key='+import.meta.env.VITE_API_KEY)
        .then((response) => {
          console.log(response)
          this.books = response.data
          if(this.books.length == 0){this.error404 = true}
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

<style>
.hoverBlue:hover{
color:  #0d6efd;
}
</style>