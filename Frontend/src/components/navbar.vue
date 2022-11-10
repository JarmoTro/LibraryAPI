<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <a
        href="/"
        style="margin-left: 1rem"
        class="text-decoration-none text-dark fs-3"
        >Library</a
      >
      <form v-on:submit.prevent="search" class="d-flex w-50">
        <div style="width: 95%">
          <input
            class="form-control me-2"
            v-model="keywordInput"
            type="search"
            name="keywordInput"
            placeholder="Search by ISBN, title, genre or author"
            aria-label="Search"
          />
        </div>
          <button type="submit" class="btn btn-secondary">
            <i class="fas fa-search"></i>
          </button>
      </form>
      <form class="d-flex">
        <div v-if="isAdmin == true" class="dropdown me-3">
          <a
            class="btn btn-secondary dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Admin
          </a>

          <ul class="dropdown-menu">
            <li>
              <router-link class="dropdown-item" :to="{ name: 'createBook' }"
                >Create book</router-link
              >
            </li>
            <li>
              <router-link class="dropdown-item" :to="{ name: 'adminpanel' }"
                >Admin panel</router-link
              >
            </li>
          </ul>
        </div>
        <router-link
          v-if="isLoggedIn == true"
          :to="{ name: 'user', params: { id: userId } }"
        >
          <button
            class="btn btn-outline-dark"
            style="margin-right: 1rem"
            type="submit"
          >
            <i class="fa-solid fa-user fa-2x"></i>
          </button>
        </router-link>
        <button
          v-if="isLoggedIn == true"
          @click="logout()"
          class="btn btn-outline-dark"
          style="margin-right: 1rem"
          type="submit"
        >
          <i class="fa-solid fa-right-from-bracket fa-2x"></i>
        </button>
        <router-link v-if="isLoggedIn == false" :to="{ name: 'login' }">
          <button
            class="btn btn-outline-dark"
            style="margin-right: 1rem"
            type="submit"
          >
            <i class="fa-solid fa-right-to-bracket fa-2x"></i>
          </button>
        </router-link>
      </form>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
export default {
  created() {
    this.checkAuth();
    this.getKeyword();
  },
  data() {
    return {
      keywordInput: "",
      userId: "placeholder",
      isLoggedIn: false,
      isAdmin: false,
    };
  },
  methods: {
    checkAuth() {
      if (localStorage.token) {
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
      }
    },
    search(submitEvent) {
      this.$router.push("/book/search/" + submitEvent.target.elements.keywordInput.value)
    },
    getKeyword() {
      this.keywordInput = this.$route.params.keyword
      this.keywordInput = this.$route.params.name
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
  },
};
</script>
