<template>
  <div class="m-3 text-center row">
    <h1>Create a new loan for {{ this.$route.query.title }}</h1>

    <div :class="errorClass" role="alert">
      {{ errorMsg }}
    </div>

    <div class="col"></div>

    <div class="col-7">
      <form v-on:submit.prevent="createLoan">
        <div class="input-group m-3">
          <span class="input-group-text" id="basic-addon1">Loan Start</span>
          <input
            type="date"
            name="loanStart"
            v-model="loanStart"
            class="form-control"
            placeholder="Loan Start"
          />
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'loanStart'">{{
            error.$message
          }}</strong>
        </p>

        <div class="input-group m-3">
          <span class="input-group-text" id="basic-addon1">Loan End</span>
          <input
            type="date"
            name="loanEnd"
            v-model="loanEnd"
            class="form-control"
            placeholder="Loan End"
          />
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'loanEnd'">{{
            error.$message
          }}</strong>
        </p>

        <div class="input-group m-3">
          <span class="input-group-text" id="basic-addon1">User</span>
          <input
            type="text"
            name="user"
            v-model="user"
            class="form-control"
            placeholder="User"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>

        <p v-for="error of v$.$errors" :key="error.$uid">
          <strong class="text-danger" v-if="error.$property == 'user'">{{
            error.$message
          }}</strong>
        </p>

        <button type="submit" class="btn btn-primary">CREATE</button>
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
    this.getCurrentUser();
  },
  data() {
    return {
      loanStart: "",
      loanEnd: "",
      user: "",
      errorMsg: "",
      errorClass: "alert alert-danger d-none",
    };
  },
  validations: {
    loanStart: {
      required,
    },
    loanEnd: {
      required,
    },
    user: {
      required,
    },
  },
  methods: {
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
    async createLoan(submitEvent) {
      const isFormValid = await this.v$.$validate();
      if (isFormValid) {
        let data = new FormData();
        data.append("book", this.$route.query.id);
        data.append("user", submitEvent.target.elements.user.value);
        data.append("key", import.meta.env.VITE_API_KEY);
        data.append(
          "loanEnd",
          Math.floor(
            new Date(submitEvent.target.elements.loanEnd.value).getTime()
          )
        );
        data.append(
          "loanStart",
          Math.floor(
            new Date(submitEvent.target.elements.loanStart.value).getTime()
          )
        );

        axios
          .post(import.meta.env.VITE_BACKEND_URL +"loans/", data)
          .then((response) => {
            this.$router.push("/book/"+this.$route.query.id);
          })
          .catch((error) => {
            this.errorMsg = error.response.data.error;
            this.errorClass = "alert alert-danger";
          });
      }
    },
  },
  computed: {},
};
</script>
