<template>
<h1 v-if="!this.$route.params.name && !this.$route.params.keyword" class="text-center"> Our latest releases: </h1>
  <div class="card-group m-3" v-for="row in formattedBooks" :key="row.id">
    <div
      class="card m-3"
      style="width: 19rem; max-width: 436px"
      v-for="book in row"
      :key="book.id"
    >
      <router-link
        :to="{ name: 'book', params: { id: book._id } }"
        class="text-decoration-none text-dark"
      >
        <img
          style="max-height: 30rem"
          class="card-img-top"
          v-bind:src="book.imgSource"
          alt="Card image cap"
        />
      </router-link>
      <div class="card-body text-center">
        <router-link
          :to="{ name: 'book', params: { id: book._id } }"
          class="text-decoration-none text-dark"
        >
          <h1 class="card-title hoverBlue">{{ book.title }}</h1>
        </router-link>
        <router-link
          :to="{ name: 'author', params: { name: book.author } }"
          class="text-decoration-none text-dark"
          ><h4 class="card-text hoverBlue">{{ book.author }}</h4>
        </router-link>
        <h2 style="margin-top: 0.5rem">Stock: {{ book.stock }}</h2>
      </div>
    </div>
  </div>

  <div v-if="error404" class="text-center m-3">
    <h1>404</h1>
    <h2>Looks like we couldn't find what you were looking for :(</h2>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "book",
  created() {
    if (this.$route.params.name) {
      this.getAuthorBooks(this.$route.params.name);
    }
    if (this.$route.params.keyword) {
      this.getBooksByKeyword(this.$route.params.keyword);
    }
    if (!this.$route.params.name && !this.$route.params.keyword) {
      this.getBooks();
    }
  },
  data() {
    return {
      books: [],
      errorMsg: "",
      error404: false,
    };
  },
  methods: {
    getBooks() {
      axios
        .get(import.meta.env.VITE_BACKEND_URL +"books/?key=" + import.meta.env.VITE_API_KEY)
        .then((response) => {
          this.books = response.data;
          this.books.reverse()
          this.books.splice(8,this.books.length)
        })
        .catch((error) => {
          this.errorMsg = "Error retrieving data";
        });
    },
    getBooksByKeyword(keyword) {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +"books/search/" +
            keyword +
            "?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          this.books = response.data;
          if (this.books.length == 0) {
            this.error404 = true;
          }
        })
        .catch((error) => {
          this.errorMsg = "Error retrieving data";
        });
    },
    getAuthorBooks(author) {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +"books/author/" +
            author +
            "?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          this.books = response.data;
          if (this.books.length == 0) {
            this.error404 = true;
          }
        })
        .catch((error) => {
          this.errorMsg = "Error retrieving data";
        });
    },
  },
  computed: {
    formattedBooks() {
      return this.books.reduce((c, n, i) => {
        if (i % 4 === 0) c.push([]);
        c[c.length - 1].push(n);
        return c;
      }, []);
    },
  },
};
</script>
