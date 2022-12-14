<template>
  <div class="m-3 text-center row">
    <h1>Update a book</h1>

    <div :class="errorClass" role="alert">
      {{ errorMsg }}
    </div>

    <div class="col"></div>

    <div class="col-7">
      <form v-on:submit.prevent="updateBook">
        <div class="input-group m-3">
          <span class="input-group-text" id="basic-addon1">Title</span>
          <input
            type="text"
            name="title"
            v-model="title"
            class="form-control"
            placeholder="Title"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'title'">{{
            error.$message
          }}</strong>
        </p>

        <div class="input-group m-3">
          <span class="input-group-text" id="basic-addon1">Author</span>
          <input
            type="text"
            name="author"
            v-model="author"
            class="form-control"
            placeholder="Author"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'author'">{{
            error.$message
          }}</strong>
        </p>

        <div class="input-group m-3">
          <span class="input-group-text" id="basic-addon1">Genre</span>
          <input
            type="text"
            name="genre"
            v-model="genre"
            class="form-control"
            placeholder="Genre"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'genre'">{{
            error.$message
          }}</strong>
        </p>

        <div class="input-group m-3">
          <span class="input-group-text">Description</span>
          <textarea
            class="form-control"
            name="description"
            v-model="description"
            aria-label="With textarea"
            placeholder="Description"
          ></textarea>
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'description'">{{
            error.$message
          }}</strong>
        </p>

        <div class="input-group m-3">
          <span class="input-group-text" id="basic-addon1">Length</span>
          <input
            type="number"
            v-model="booklength"
            name="booklength"
            class="form-control"
            placeholder="Length"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'booklength'">{{
            error.$message
          }}</strong>
        </p>

        <div class="input-group m-3">
          <span class="input-group-text" id="basic-addon1">Stock</span>
          <input
            type="number"
            name="stock"
            v-model="stock"
            class="form-control"
            placeholder="Stock"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'stock'">{{
            error.$message
          }}</strong>
        </p>

        <div class="input-group m-3">
          <span class="input-group-text" id="basic-addon1">ISBN</span>
          <input
            type="text"
            name="isbn"
            v-model="isbn"
            class="form-control"
            placeholder="ISBN"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'isbn'">{{
            error.$message
          }}</strong>
        </p>

        <div class="input-group m-3">
          <span class="input-group-text" id="basic-addon1">Date</span>
          <input type="date" name="date" v-model="date" class="form-control" />
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'date'">{{
            error.$message
          }}</strong>
        </p>

        <div class="input-group m-3">
          <label class="input-group-text" for="inputGroupFile01"
            >Book cover</label
          >
          <input
            type="file"
            name="coverImg"
            v-on:change="coverImg"
            accept="image/png, image/jpg, image/jpeg, image/webp"
            class="form-control"
            id="inputGroupFile01"
          />
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'coverImg'">{{
            error.$message
          }}</strong>
        </p>

        <button type="submit" class="btn btn-primary">UPDATE</button>
      </form>
    </div>

    <div class="col"></div>
  </div>
</template>

<script>
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
export default {
  name: "createBook",
  setup() {
    return { v$: useVuelidate() };
  },
  created() {
    this.getCurrentUser(), this.getBook();
  },
  data() {
    return {
      title: "",
      author: "",
      isbn: "",
      booklength: "",
      description: "",
      stock: "",
      date: "",
      genre: "",
      errorMsg: "",
      errorClass: "alert alert-danger d-none",
    };
  },
  validations: {
    title: {
      required,
    },
    author: {
      required,
    },
    isbn: {
      required,
    },
    booklength: {
      required,
      minValue: minValue(1),
    },
    description: {
      required,
    },
    stock: {
      required,
      minValue: minValue(0),
    },
    date: {
      required,
    },
    genre: {
      required,
    },
  },
  methods: {
    isValidFileExtension(extension) {
      switch (extension) {
        case "jpg":
          return true;
        case "jpeg":
          return true;
        case "png":
          return true;
        case "webp":
          return true;
        default:
          return false;
      }
    },
    getCurrentUser() {
      let token = localStorage.getItem("token");
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +"users/currentuser/?key=" +
            import.meta.env.VITE_API_KEY,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              token: token,
            },
          }
        )
        .then((response) => {
          if (!response.data.admin) {
            this.$router.push("/login");
          }
        })
        .catch((error) => {
          this.$router.push("/login");
        });
    },
    getBook() {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +"books/" +
            this.$route.params.id +
            "?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          this.title = response.data.title;
          this.author = response.data.author;
          this.genre = response.data.genre;
          this.description = response.data.description;
          this.booklength = response.data.length;
          this.stock = response.data.stock;
          this.isbn = response.data.ISBN;
          this.date = response.data.publicationDate;
        })
        .catch((error) => {
          this.errorMsg = "Error retrieving data";
        });
    },
    async updateBook(submitEvent) {
      const isFormValid = await this.v$.$validate();
      if (isFormValid) {
        const coverImg = submitEvent.target.elements.coverImg.value;
        const fileExtension = coverImg.split(".").pop();

        let data = new FormData();
        let coverImgFile = submitEvent.target.elements.coverImg.files[0];
        data.append("id", this.$route.params.id);
        if (coverImg) {
          if (!this.isValidFileExtension(fileExtension)) {
            this.errorMsg =
              "Invalid file type '" +
              fileExtension +
              "'. Valid file types: jpeg, jpg, webp, png";
            this.errorClass = "alert alert-danger";
          }
          data.append("coverImg", coverImgFile);
        }
        data.append("key", import.meta.env.VITE_API_KEY);
        data.append("title", submitEvent.target.elements.title.value);
        data.append("author", submitEvent.target.elements.author.value);
        data.append("ISBN", submitEvent.target.elements.isbn.value);
        data.append("length", submitEvent.target.elements.booklength.value);
        data.append("stock", submitEvent.target.elements.stock.value);
        data.append(
          "publicationDate",
          Math.floor(new Date(submitEvent.target.elements.date.value).getTime())
        );
        data.append(
          "description",
          submitEvent.target.elements.description.value
        );
        data.append("genre", submitEvent.target.elements.genre.value);

        axios
          .put(import.meta.env.VITE_BACKEND_URL +"books/", data)
          .then((response) => {
            this.$router.push("/book/"+this.$route.params.id);
          })
          .catch((error) => {
            this.errorMsg = "Something went wrong";
            this.errorClass = "alert alert-danger";
          });
      }
    },
  },
  computed: {},
};
</script>
