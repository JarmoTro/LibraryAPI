<template>
    <div v-for="book in 1" :key="book.id">
      <div class="text-center">
      <div class="d-inline-block m-5 text-start">
        <div class="row">
          <div class="col text-center">
            <img class="d-inline-block" style=" max-width: 50rem; max-height: 40rem; margin-bottom: 5; margin-left: 5; margin-right: 5;" v-bind:src=books.imgSource alt="">
          </div>
          <div class="col">
            <h2 class="m-3">{{books.title}}</h2>
            <h4 class="m-3">{{books.author}}</h4>
            <h5 class="m-3">{{books.description}}</h5>
            <h3 class="m-3">Additonal info</h3>
            <div class="m-3">ISBN: {{books.ISBN}}</div>
            <div class="m-3">Genre: {{books.genre}}</div>
            <div class="m-3">Publication date: {{books.publicationDate}}</div>
            <div class="m-3">Length: {{books.length}} pages</div>
            <h3 class="m-3">Stock: {{books.stock}}</h3>
            <div>
              <button class="m-3 btn btn-success">Loan now</button>
              <button class="m-3 btn btn-primary">Edit book</button>
              <button class="m-3 btn btn-danger">Delete book</button>


            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'book',
  created() {
    this.getBook()
  },
  data() {
    return {
      books: [],
      errorMsg: '',
    }
  },
  methods: {
    getBook() {
      axios
        .get('http://localhost:3000/books/'+ this.$route.params.id + '?key=93cfcb80-2db6-11ed-8d13-cdfedc6a1662')
        .then((response) => {
          console.log(response)
          this.books = response.data
          console.log(this.books);
        })
        .catch((error) => {
          console.log(error)
          this.errorMsg = 'Error retrieving data'
        })
    },
  },
  computed: {
  }
}

</script>