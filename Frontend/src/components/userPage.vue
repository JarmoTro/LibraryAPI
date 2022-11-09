<template>
  <div class="text-center">
    <h1 v-if="userExists == false"> Error! user not found. </h1>
    <div v-if="userExists == true">
    <h1>{{ username }}</h1>
    <h2 v-if="reviews.length == 0 && isAdmin == false">
      Looks like this user doesn't have any reviews :(
    </h2>
    <div class="row" style="margin-top: 3rem">
      <div class="col">
        <h1 v-if="reviews.length == 0 && isAdmin == true">
          This user has no reviews
        </h1>
        <h1 style="margin-bottom: 2rem" v-if="reviews.length > 0">Reviews</h1>
        <div v-for="review in reviews">
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

          <div class="modal fade" v-bind:id="'_' + review._id" tabindex="-1">
            <div class="modal-dialog" style="padding-top: 15%">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Delete review
                  </h5>
                  <button
                    type="fbutton"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  Are you sure you want to delete the review with the title "{{
                    review.title
                  }}"?
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
          <h2
            v-if="userId == review.user._id && !isAdmin"
            class="d-inline fw-bold"
            style="margin-left: 2rem"
          >
            "{{ review.title }}"
          </h2>
          <h2
            v-if="userId != review.user._id && !isAdmin"
            class="d-inline fw-bold"
          >
            {{ review.title }}
          </h2>
          <h2
            v-if="userId == review.user._id && isAdmin"
            class="d-inline fw-bold"
            style="margin-left: 4rem"
          >
            "{{ review.title }}"
          </h2>
          <h2
            v-if="isAdmin && userId != review.user._id"
            class="d-inline fw-bold"
            style="margin-left: 2rem"
          >
            "{{ review.title }}"
          </h2>
          <router-link
            v-if="userId == review.user._id || isAdmin"
            class="text-dark text-decoration-none float-end"
            style="margin-left: 1rem"
            :to="{}"
            data-bs-toggle="modal"
            v-bind:data-bs-target="'#_' + review._id"
            ><i class="fa-solid fa-trash d-inline fa-xl text-danger"></i>
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
            v-if="userId == review.user._id"
            class="text-dark text-decoration-none float-end"
            :to="{}"
            data-bs-toggle="modal"
            v-bind:data-bs-target="'#edit_' + review._id"
            ><i
              class="fa-solid fa-pen-to-square d-inline fa-xl text-primary"
            ></i>
          </router-link>
          <router-link
            class="text-dark text-decoration-none"
            :to="{ name: 'book', params: { id: review.book._id } }"
            ><h4 class="m-3 hoverBlue">{{ review.book.title }}</h4></router-link
          >
          <h4 class="m-3">By {{ review.user.username }}</h4>
          <p class="m-3 text-muted">{{ review.createdAt }}</p>
          <div class="d-inline" v-for="star in review.rating">
            <i class="fa-solid fa-star fa-2x" style="color: #d4af37"></i>
          </div>
          <h5 class="m-3">{{ review.body }}</h5>
          <hr />
        </div>
      </div>
      <div
        v-if="isAdmin == true || userId == this.$route.params.id"
        class="col"
      >
        <h1 style="margin-bottom: 2rem" v-if="loans.length > 0">Loans</h1>
        <h1
          style="margin-bottom: 2rem"
          v-if="loans.length == 0 && isAdmin == true"
        >
          This user has no loans
        </h1>
        <div v-for="loan in loans">
          <router-link
            :to="{ name: 'book', params: { id: loan.aggregatedBook._id } }"
            class="text-dark text-decoration-none"
            ><h2 class="hoverBlue">
              {{ loan.aggregatedBook.title }}
            </h2></router-link
          >
          <h2>{{ loan.loanStart }} - {{ loan.loanEnd }}</h2>
          <hr />
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default {
  name: "user",
  setup() {
    return { v$: useVuelidate() };
  },
  created() {
    this.getReviews(), this.getCurrentUser(), this.getUser(), this.getLoans();
  },
  data() {
    return {
      reviews: [],
      loans: [],
      errorMsg: "",
      userId: "",
      isLoggedIn: false,
      isAdmin: false,
      error: false,
      modalText: "",
      username: "",
      editTitle: "",
      editBody: "",
      editRating: "",
      editId: "",
      userExists: true,
    };
  },
  validations: {
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
    getReviews() {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +"reviews/author/" +
            this.$route.params.id +
            "?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          this.reviews = response.data;
        })
        .catch((error) => {
          this.errorMsg = "Error retrieving data";
        });
    },
    getLoans() {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +"loans/user/" +
            this.$route.params.id +
            "?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          this.loans = response.data;
        })
        .catch((error) => {
          this.errorMsg = "Error retrieving data";
        });
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
          this.isLoggedIn = true;
          this.userId = response.data._id;
          if (response.data.admin) {
            this.isAdmin = true;
          }
        })
        .catch((error) => {});
    },
    getUser() {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +"users/" +
            this.$route.params.id +
            "?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          this.username = response.data.username;
        })
        .catch((error) => {
          this.userExists = false
        });
    },
    deleteReview(id) {
      axios
        .delete(
          import.meta.env.VITE_BACKEND_URL +"reviews/" +
            id +
            "?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          this.$router.go("/user/" + this.$route.params.id);
        })
        .catch((error) => {
          this.error = true;
        });
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
          .put(import.meta.env.VITE_BACKEND_URL +"reviews/", data)
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
