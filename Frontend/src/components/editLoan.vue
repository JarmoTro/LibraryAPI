<template>
  <div class="m-3 text-center row">
    <h3>{{ title }}</h3>

    <div :class="errorClass" role="alert">
      {{ errorMsg }}
    </div>

    <div class="col"></div>

    <div class="col-7">
      <form v-on:submit.prevent="editLoan">
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
    this.getCurrentUser(), this.getLoan();
  },
  data() {
    return {
      loanStart: "",
      loanEnd: "",
      title: "",
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
    getLoan() {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +"loans/" +
            this.$route.params.id +
            "?key=" +
            import.meta.env.VITE_API_KEY,
          {}
        )
        .then((response) => {
          this.loanStart = response.data[0].loanStart;
          this.loanEnd = response.data[0].loanEnd;
          this.title =
            "Editing the loan belonging to " +
            response.data[0].aggregatedUser.username +
            ' who is loaning the book "' +
            response.data[0].aggregatedBook.title +
            '" ';
        })
        .catch((error) => {
          this.errorMsg = error.response.data.error;
          this.errorClass = "alert alert-danger";
        });
    },
    async editLoan(submitEvent) {
      const isFormValid = await this.v$.$validate();
      if (isFormValid) {
        let data = new FormData();
        data.append("id", this.$route.params.id);
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
          .put(import.meta.env.VITE_BACKEND_URL +"loans/", data)
          .then((response) => {
            this.$router.push("/adminpanel");
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
