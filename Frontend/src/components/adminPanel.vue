<template>
  <h1 class="text-center">Admin panel</h1>

  <div class="row">
    <div class="col"></div>

    <div class="col text-center">
      <h2>Find loans by username</h2>
      <div :class="errorClassLoans" role="alert">
        {{ errorMsgLoans }}
      </div>
      <form v-on:submit.prevent="findLoans">
        <input
          type="text"
          v-model="LoanUsername"
          name="LoanUsername"
          class="form-control mt-3"
          id="exampleInputEmail1"
          placeholder="Username"
        />
        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong
            class="text-danger"
            v-if="error.$property == 'LoanUsername'"
            >{{ error.$message }}</strong
          >
        </p>
        <button type="submit" class="btn btn-primary m-3">FIND LOANS</button>
      </form>
    </div>

    <div class="col"></div>
  </div>

  <div class="text-center">
    <h1>{{LoansText}}</h1>
    <div class="card-group m-3" v-for="row in formattedLoans" :key="row.id">
      <div
        class="card card-body m-3"
        style="max-width: 436px"
        v-for="loan in row"
        :key="loan.id"
      >
        <div class="d-inline">
          <div class="modal fade" v-bind:id="'_' + loan._id" tabindex="-1">
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
                  Are you sure you want to delete the loan belonging to
                  {{ loan.aggregatedUser.username }} who is loaning the book
                  {{ loan.aggregatedBook.title }}
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
                    @click="deleteLoan(loan._id)"
                  >
                    Delete loan
                  </button>
                </div>
              </div>
            </div>
          </div>

          <router-link
            class="text-dark text-decoration-none d-inline"
            :to="{ name: 'editLoan', params: { id: loan._id } }"
            ><i
              class="fa-solid fa-pen-to-square d-inline fa-xl text-primary"
            ></i>
          </router-link>
          <router-link
            class="text-dark text-decoration-none d-inline"
            style="margin-left: 1rem"
            :to="{}"
            data-bs-toggle="modal"
            v-bind:data-bs-target="'#_' + loan._id"
            ><i class="fa-solid fa-trash d-inline fa-xl text-danger"></i>
          </router-link>
        </div>

        <router-link
          :to="{ name: 'book', params: { id: loan.aggregatedBook._id } }"
          class="text-dark text-decoration-none"
          ><h2 class="hoverBlue">
            {{ loan.aggregatedBook.title }}
          </h2></router-link
        >
        <router-link
          :to="{ name: 'user', params: { id: loan.aggregatedUser._id } }"
          class="text-dark text-decoration-none"
          ><h2 class="hoverBlue">
            {{ loan.aggregatedUser.username }}
          </h2></router-link
        >
        <h2>{{ loan.loanEnd }}</h2>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col"></div>
    <div class="col">
      <div class="col text-center">
        <h2>Give users admin privileges</h2>
        <div :class="errorClass" role="alert">
          {{ errorMsg }}
        </div>
        <form v-on:submit.prevent="makeUserAdmin">
          <input
            type="text"
            v-model="username"
            name="username"
            class="form-control mt-3"
            id="exampleInputEmail1"
            placeholder="Username"
          />
          <p v-for="error of v$.$errors" :key="error.$uid">
            <strong class="text-danger" v-if="error.$property == 'username'">{{
              error.$message
            }}</strong>
          </p>
          <button type="submit" class="btn btn-primary m-3">
            MAKE USER ADMIN
          </button>
        </form>
      </div>
    </div>
    <div class="col"></div>
  </div>
</template>

<script>
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default {
  name: "adminPanel",
  setup() {
    return { v$: useVuelidate() };
  },
  created() {
    this.getCurrentUser(), this.getLoans();
  },
  data() {
    return {
      username: "",
      errorMsg: "",
      errorClass: "alert alert-danger d-none",
      errorMsgLoans: "",
      errorClassLoans: "alert alert-danger d-none",
      loans: [],
      LoanUsername: "",
      userId: "",
      LoansText: "Upcoming loans:",
    };
  },
  validations: {
    username: {
      required,
    },
    LoanUsername: {
      required,
    },
  },
  methods: {
    getCurrentUser() {
      let token = localStorage.getItem("token");
      axios
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
          if (!response.data.admin) {
            this.$router.push("/login");
          }
        })
        .catch((error) => {
          this.$router.push("/login");
        });
    },

    async findLoans (submitEvent) {
      const  loanNameIsValid = await this.v$.LoanUsername.$validate();
      if (loanNameIsValid) {
        axios
          .get(
            import.meta.env.VITE_BACKEND_URL +
              "users/username/" +
              submitEvent.target.elements.LoanUsername.value +
              "?key=" +
              import.meta.env.VITE_API_KEY
          )
          .then((response) => {
            this.userId = response.data._id;
            this.LoansText = response.data.username + " loans:"
            axios
              .get(
                import.meta.env.VITE_BACKEND_URL +
                  "loans/user/" +
                  this.userId +
                  "?key=" +
                  import.meta.env.VITE_API_KEY
              )
              .then((response) => {
                this.loans = response.data;
              });
          })
          .catch((error) => {
            this.errorMsgLoans = error.response.data.error;
            this.errorClassLoans = "alert alert-danger";
          });
      }
    },

    async makeUserAdmin(submitEvent) {
      const usernameIsValid = await this.v$.username.$validate();
      if (usernameIsValid) {
        let data = new FormData();
        data.append("username", submitEvent.target.elements.username.value);
        data.append("key", import.meta.env.VITE_API_KEY);
        data.append("admin", true);

        axios
          .put(import.meta.env.VITE_BACKEND_URL + "users/", data)
          .then((response) => {
            this.errorMsg = "Privileges granted!";
            this.errorClass = "alert alert-success";
          })
          .catch((error) => {
            this.errorMsg = error.response.data.error;
            this.errorClass = "alert alert-danger";
          });
      }
    },
    getLoans() {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +
            "loans/?key=" +
            import.meta.env.VITE_API_KEY
        )
        .then((response) => {
          for (let index = 0; index < 8; index++) {
            this.loans.push(response.data[index]);
          }
        })
        .catch((error) => {});
    },
    deleteLoan(id) {
      axios
        .delete(
          import.meta.env.VITE_BACKEND_URL +
            "loans/" + id+ "?key=" +
            import.meta.env.VITE_API_KEY 
            
        )
        .then((response) => {
          this.$router.go("/adminpanel");
        })
        .catch((error) => {
          this.error = true;
        });
    },
  },
  computed: {
    formattedLoans() {
      return this.loans.reduce((c, n, i) => {
        if (i % 4 === 0) c.push([]);
        c[c.length - 1].push(n);
        return c;
      }, []);
    },
  },
};
</script>
