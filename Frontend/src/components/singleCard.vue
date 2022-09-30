<template>
    <div v-for="book in 1" :key="book.id">
      <div class="text-center">
      <div class="d-inline-block m-5 text-start">
        <div class="row">
          <div class="col text-center">
            <img class="d-inline-block" style=" max-width: 50rem; max-height: 40rem; margin-bottom: 5; margin-left: 5; margin-right: 5;" v-bind:src=books.imgSource alt="">
            <h1 class="m-3"> Reviews </h1>
            <div v-for="review in reviews">
            <h2 class="m-3">{{review.title}}</h2>
            <h4 class="m-3">{{review.user.username}}</h4>
            <p class="m-3 text-muted">{{review.createdAt}}</p>
            <div class="d-inline" v-for="star in review.rating">
              <i class="fa-solid fa-star fa-2x" style="color:#D4AF37;"></i>
            </div>
            <h5 class="m-3">{{review.body}}</h5>
            <hr>
            </div>
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
    this.getBook(),
    this.getReviews()
  },
  data() {
    return {
      books: [],
      reviews: [],
      errorMsg: '',
    }
  },
  methods: {
    getBook() {
      axios
        .get('http://localhost:3000/books/'+ this.$route.params.id + '?key='+import.meta.env.VITE_API_KEY)
        .then((response) => {
          this.books = response.data
        })
        .catch((error) => {
          this.errorMsg = 'Error retrieving data'
        })
    },
    getReviews() {
      axios
        .get('http://localhost:3000/reviews/book/'+this.$route.params.id+'?key='+import.meta.env.VITE_API_KEY)
        .then((response) => {
          this.reviews = response.data
        })
        .catch((error) => {
          this.errorMsg = 'Error retrieving data'
        })
    }
  },
  computed: {

  }
}

</script>