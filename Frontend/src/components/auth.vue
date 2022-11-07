<template>
  <div class="text-center m-4 p-4">
    <div class="row">
      <div class="col"></div>
      <div class="col">
        <div v-if="this.$route.name == 'login'">
          <h1 class="mb-4">Login</h1>
        </div>
        <div v-if="this.$route.name == 'register'">
          <h1 class="mb-4">Register</h1>
        </div>

        <div :class="errorClass" role="alert">
          {{ errorMsg }}
        </div>

        <form
          v-if="this.$route.name == 'register'"
          v-on:submit.prevent="register"
          class="m-3"
        >
          <div class="form-group mb-3">
            <label for="exampleInputEmail1"><h4>Username</h4></label>
            <input
              type="text"
              v-model="username"
              name="username"
              class="form-control"
              id="exampleInputEmail1"
              placeholder="Username"
            />
          </div>
          <p v-for="error of v$.$errors" :key="error.$uid">
            <strong class="text-danger" v-if="error.$property == 'username'">{{
              error.$message
            }}</strong>
          </p>
          <div class="form-group">
            <label for="exampleInputPassword1"><h4>Password</h4></label>
            <input
              type="password"
              ref="password"
              v-model="password"
              name="password"
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
            />
          </div>
          <p v-for="error of v$.$errors" :key="error.$uid">
            <strong class="text-danger" v-if="error.$property == 'password'">{{
              error.$message
            }}</strong>
          </p>
          <div>
            <div class="form-group mt-3">
              <label for="exampleInputPassword1"
                ><h4>Confirm password</h4></label
              >
              <input
                type="password"
                v-model="passwordConfirm"
                name="confirmPassword"
                class="form-control"
                id="exampleInputPassword1"
                placeholder="Confirm password"
              />
            </div>
            <p v-for="error of v$.$errors" :key="error.$uid">
              <strong
                class="text-danger"
                v-if="error.$property == 'passwordConfirm'"
                >{{ error.$message }}</strong
              >
            </p>
            <strong class="text-danger">{{ passwordConfirmError }}</strong>
          </div>
          <div>
            <button class="btn btn-primary mt-3 w-100" type="submit">
              SIGN UP
            </button>
          </div>
        </form>

        <form
          v-if="this.$route.name == 'login'"
          v-on:submit.prevent="login"
          class="m-3"
        >
          <div class="form-group mb-3">
            <label for="exampleInputEmail1"><h4>Username</h4></label>
            <input
              type="text"
              v-model="username"
              name="username"
              class="form-control"
              id="exampleInputEmail1"
              placeholder="Username"
            />
          </div>
          <p v-for="error of v$.$errors" :key="error.$uid">
            <strong class="text-danger" v-if="error.$property == 'username'">{{
              error.$message
            }}</strong>
          </p>
          <div class="form-group">
            <label for="exampleInputPassword1"><h4>Password</h4></label>
            <input
              type="password"
              v-model="password"
              name="password"
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
            />
          </div>
          <p v-for="error of v$.$errors" :key="error.$uid">
            <strong class="text-danger" v-if="error.$property == 'password'">{{
              error.$message
            }}</strong>
          </p>
          <div>
            <button class="btn btn-primary mt-3 w-100" type="submit">
              LOG IN
            </button>
          </div>
        </form>
        <div v-if="this.$route.name == 'login'">
          <router-link :to="{ name: 'register' }">
            Don't have an account? Sign up
          </router-link>
        </div>
        <div v-if="this.$route.name == 'register'">
          <router-link :to="{ name: 'login' }">
            Already have an account? Log in
          </router-link>
        </div>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, between, sameAs } from "@vuelidate/validators";
import axios from "axios";
export default {
  name: "auth",
  setup() {
    return { v$: useVuelidate() };
  },
  created() {
    this.getCurrentUser();
  },
  data() {
    return {
      errorMsg: "",
      username: "",
      password: "",
      passwordConfirmError: "",
      errorClass: "alert alert-danger d-none",
    };
  },
  validations: {
    username: {
      required,
    },
    password: {
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
          this.$router.push("/user/" + response.data._id);
        })
        .catch((error) => {});
    },
    async register(submitEvent) {
      const isFormValid = await this.v$.$validate();
      if (isFormValid) {
        const password = submitEvent.target.elements.password.value;
        const passwordConfirm =
          submitEvent.target.elements.confirmPassword.value;
        if (passwordConfirm == password) {
          axios
            .post(import.meta.env.VITE_BACKEND_URL +"register", {
              key: import.meta.env.VITE_API_KEY,
              username: submitEvent.target.elements.username.value,
              password: password,
            })
            .then((response) => {
              this.$router.push("/welcome");
            })
            .catch((error) => {
              this.errorMsg = "Username is already taken";
              this.errorClass = "alert alert-danger";
            });
        } else {
          this.passwordConfirmError = "Passwords must match";
        }
      }
    },

    async login(submitEvent) {
      const isFormValid = await this.v$.$validate();
      if (isFormValid) {
        axios
          .post(import.meta.env.VITE_BACKEND_URL +"login", {
            key: import.meta.env.VITE_API_KEY,
            username: submitEvent.target.elements.username.value,
            password: submitEvent.target.elements.password.value,
          })
          .then((response) => {
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + response.data.token;
            localStorage.setItem("token", response.data.token);
            this.$router.push("/");
          })
          .catch((error) => {
            this.errorMsg = "Invalid credentials";
            this.errorClass = "alert alert-danger";
          });
      }
    },
  },
  computed: {},
};
</script>
