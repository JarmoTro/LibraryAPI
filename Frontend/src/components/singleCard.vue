<template>
<h1 v-if="bookExists == false" class="text-center"> Error! Book does not exist. </h1>
<div v-if="bookExists == true">
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" style="padding-top: 15%">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Delete book</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">Are you sure you want to delete the book?</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="deleteBook()"
          >
            Delete book
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="add_review_model" tabindex="-1">
    <div class="modal-dialog" style="padding-top: 15%">
      <div class="modal-content">
        <form v-on:submit.prevent="createReview">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add a review</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <input
              name="title"
              v-model="title"
              class="d-block mb-3 w-100"
              placeholder="Review title"
              type="text"
            />
            <p v-for="error of v$.$errors" :key="error.$uid">
              <strong class="text-danger" v-if="error.$property == 'title'">{{
                error.$message
              }}</strong>
            </p>
            <textarea
              name="body"
              v-model="body"
              placeholder="Review body"
              class="w-100"
              type="text"
            ></textarea>
            <p v-for="error of v$.$errors" :key="error.$uid">
              <strong class="text-danger" v-if="error.$property == 'body'">{{
                error.$message
              }}</strong>
            </p>
            <select
              class="form-select mt-3"
              name="rating"
              aria-label="Default select example"
            >
              <option value="1">Hated it!</option>
              <option value="2">Didn't like it.</option>
              <option selected value="3">It was alright.</option>
              <option value="4">It was good!</option>
              <option value="5">It was perfect!</option>
            </select>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="submit" class="btn btn-success">Add review</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div v-if="error" class="alert alert-danger text-center" role="alert">
    Can not delete a book with active loans! Please dismiss the active loans and
    try again.
  </div>
  <div v-for="book in 1" :key="book.id">
    <div class="text-center">
      <div class="d-inline-block m-5 text-start">
        <div class="row">
          <div class="col text-center">
            <img
              class="d-inline-block"
              style="
                min-width: 30rem;
                min-height: 30rem;
                margin-bottom: 5;
                margin-left: 5;
                margin-right: 5;
              "
              v-bind:src="books.imgSource"
              alt=""
            />
            <h1 v-if="reviews.length == 0" class="m-3">
              This book has no reviews.
            </h1>
            <h2 v-if="reviews.length > 0" class="m-3">Reviews</h2>
            <div v-for="review in reviews">
              <div
                class="modal fade"
                v-bind:id="'_' + review._id"
                tabindex="-1"
              >
                <div class="modal-dialog" style="padding-top: 15%">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        Delete review
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      Are you sure you want to delete the review with the title
                      "{{ review.title }}"?
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger"
                        data-bs-dismiss="modal"
                        @click="deleteReview(review._id)"
                      >
                        Delete review
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="modal fade"
                v-bind:id="'edit_' + review._id"
                tabindex="-1"
              >
                <div class="modal-dialog" style="padding-top: 15%">
                  <div class="modal-content">
                    <form v-on:submit.prevent="updateReview">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                          Edit a review
                        </h5>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <input name="editId" v-model="editId" type="hidden" />
                        <input
                          name="editTitle"
                          v-model="editTitle"
                          class="d-block mb-3 w-100"
                          placeholder="Review title"
                          type="text"
                        />
                        <p v-for="error of v$.$errors" :key="error.$uid">
                          <strong
                            class="text-danger"
                            v-if="error.$property == 'editTitle'"
                            >{{ error.$message }}</strong
                          >
                        </p>
                        <textarea
                          name="editBody"
                          v-model="editBody"
                          placeholder="Review body"
                          class="w-100"
                          type="text"
                        ></textarea>
                        <p v-for="error of v$.$errors" :key="error.$uid">
                          <strong
                            class="text-danger"
                            v-if="error.$property == 'editBody'"
                            >{{ error.$message }}</strong
                          >
                        </p>
                        <select
                          class="form-select mt-3"
                          name="editRating"
                          aria-label="Default select example"
                        >
                          <option v-if="editRating == 1" selected value="1">
                            Hated it!
                          </option>
                          <option v-if="editRating != 1" value="1">
                            Hated it!
                          </option>
                          <option v-if="editRating == 2" selected value="2">
                            Didn't like it.
                          </option>
                          <option v-if="editRating != 2" value="2">
                            Didn't like it.
                          </option>
                          <option v-if="editRating == 3" selected value="3">
                            It was alright.
                          </option>
                          <option v-if="editRating != 3" value="3">
                            It was alright.
                          </option>
                          <option v-if="editRating == 4" selected value="4">
                            It was good!
                          </option>
                          <option v-if="editRating != 4" value="4">
                            It was good!
                          </option>
                          <option v-if="editRating == 5" selected value="5">
                            It was perfect!
                          </option>
                          <option v-if="editRating != 5" value="5">
                            It was perfect!
                          </option>
                        </select>
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="submit" class="btn btn-primary">
                          Edit review
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <h2>
                {{ review.title }}
              </h2>
              <router-link
                v-if="userId == review.user._id || isAdmin"
                class="text-dark text-decoration-none"
                style="margin-left: 1rem"
                :to="{}"
                data-bs-toggle="modal"
                v-bind:data-bs-target="'#_' + review._id"
                ><i class="fa-solid fa-trash fa-xl text-danger"></i>
              </router-link>
              <router-link
                @click="
                  getReviewDetails(
                    review.title,
                    review.body,
                    review.rating,
                    review._id
                  )
                "
                data-bs-toggle="modal"
                v-bind:data-bs-target="'#edit_' + review._id"
                v-if="userId == review.user._id"
                class="ms-3 text-dark text-decoration-none"
                :to="{ name: 'login' }"
                ><i
                  class="fa-solid fa-pen-to-square d-inline fa-xl text-primary"
                ></i>
              </router-link>
              <router-link
                :to="{ name: 'user', params: { id: review.user._id } }"
                class="text-dark text-decoration-none hoveBlue"
                ><h4 class="m-3 hoverBlue">
                  {{ review.user.username }}
                </h4></router-link
              >
              <p class="m-3 text-muted">{{ review.createdAt }}</p>
              <div class="d-inline" v-for="star in review.rating">
                <i class="fa-solid fa-star fa-2x" style="color: #d4af37"></i>
              </div>
              <h5 class="m-3">{{ review.body }}</h5>
              <hr />
            </div>
          </div>
          <div class="col">
            <h1 class="m-3">{{ books.title }}</h1>
            <h3 class="m-3">{{ books.author }}</h3>
            <div class="m-3">
              <h4 v-for="index in averageRating" class="d-inline">
                <i class="fa-solid fa-star fa-xl" style="color: #d4af37"></i>
              </h4>
            </div>
            <h5 class="m-3">{{ books.description }}</h5>
            <h3 class="m-3">Additonal info</h3>
            <div class="m-3">ISBN: {{ books.ISBN }}</div>
            <div class="m-3">Genre: {{ books.genre }}</div>
            <div class="m-3">Publication date: {{ books.publicationDate }}</div>
            <div class="m-3">Length: {{ books.length }} pages</div>
            <h3 class="m-3">Stock: {{ books.stock }}</h3>

            <div v-if="isLoggedIn">
              <button
                class="m-3 btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#add_review_model"
              >
                Add review
              </button>
              <div v-if="isAdmin" class="d-inline">
                <router-link
                  v-if="books.stock > 0"
                  :to="{
                    name: 'createLoan',
                    query: { id: books._id, title: books.title },
                  }"
                >
                  <button class="m-3 btn btn-warning">
                    Create a loan
                  </button>
                </router-link>
                <router-link
                  :to="{ name: 'editBook', params: { test: books._id } }" 
                  > <!-- Change test param back to id if stuff breaks again -->
                  <button class="m-3 btn btn-primary">
                    Edit book
                  </button></router-link
                >
                <button
                  class="m-3 btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Delete book
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
export default {
  name: "book",
  setup() {
    return { v$: useVuelidate() };
  },
  created() {
    this.getBook(), this.getReviews(), this.getCurrentUser();
  },
  data() {
    return {
      books: [],
      reviews: [],
      errorMsg: "",
      userId: "",
      isLoggedIn: false,
      isAdmin: false,
      error: false,
      title: "",
      body: "",
      editTitle: "",
      editBody: "",
      editRating: "",
      editId: "",
      averageRating: "",
      bookExists: true,
    };
  },
  validations: {
    title: {
      required,
    },
    body: {
      required,
    },
    editTitle: {
      required,
    },
    editBody: {
      required,
    },
  },
  methods: {
    getReviewDetails(title, body, rating, id) {
      (this.editTitle = title),
        (this.editBody = body),
        (this.editRating = rating);
      this.editId = id;
    },
    getBook() {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +
            "books/" +
            this.$route.params.id +
            "?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          this.books = response.data;
        })
        .catch((error) => {
          this.bookExists = false
          this.errorMsg = "Error retrieving data";
        });
    },
    getReviews() {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +
            "reviews/book/" +
            this.$route.params.id +
            "?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          this.reviews = response.data.reverse();
          let ratings = [];
          this.reviews.forEach((review) => {
            ratings.push(review.rating);
          });
          this.averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
          this.averageRating = Math.round(this.averageRating);
        })
        .catch((error) => {
          this.errorMsg = "Error retrieving data";
        });
    },
    async getCurrentUser() {
      let token = localStorage.getItem("token");
      await axios
        .get(
          import.meta.env.VITE_BACKEND_URL +
            "users/currentuser/?key=" +
            import.meta.env.VITE_API_KEY,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              token: token,
            },
          }
        )
        .then((response) => {
          this.isLoggedIn = true;
          this.userId = response.data._id;
          if (response.data.admin) {
            this.isAdmin = true;
          }
        })
        .catch((error) => {});
    },
    deleteBook() {
      axios
        .delete(
          import.meta.env.VITE_BACKEND_URL +
            "books/" +
            this.$route.params.id +
            "?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          this.$router.push("/");
        })
        .catch((error) => {
          this.error = true;
        });
    },
    deleteReview(id) {
      axios
        .delete(
          import.meta.env.VITE_BACKEND_URL +
            "reviews/" +
            id +
            "?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          this.$router.go();
        })
        .catch((error) => {
          this.error = true;
        });
    },
    async createReview(submitEvent) {
      const titleIsValid = await this.v$.title.$validate();
      const bodyIsValid = await this.v$.body.$validate();
      if (titleIsValid && bodyIsValid) {
        let data = new FormData();
        data.append("title", submitEvent.target.elements.title.value);
        data.append("body", submitEvent.target.elements.body.value);
        data.append("rating", submitEvent.target.elements.rating.value);
        data.append("key", import.meta.env.VITE_API_KEY);
        data.append("author", this.userId);
        data.append("book", this.$route.params.id);
        axios
          .post(import.meta.env.VITE_BACKEND_URL + "reviews/", data)
          .then((response) => {
            this.$router.go();
          })
          .catch((error) => {});
      }
    },
    async updateReview(submitEvent) {
      const editTitleIsValid = await this.v$.editTitle.$validate();
      const editBodyIsValid = await this.v$.editBody.$validate();
      if (editTitleIsValid && editBodyIsValid) {
        let data = new FormData();
        data.append("title", submitEvent.target.elements.editTitle.value);
        data.append("body", submitEvent.target.elements.editBody.value);
        data.append("rating", submitEvent.target.elements.editRating.value);
        data.append("key", import.meta.env.VITE_API_KEY);
        data.append("id", submitEvent.target.elements.editId.value);
        axios
          .put(import.meta.env.VITE_BACKEND_URL + "reviews/", data)
          .then((response) => {
            this.$router.go();
          })
          .catch((error) => {});
      }
    },
  },
  computed: {},
};
</script>
