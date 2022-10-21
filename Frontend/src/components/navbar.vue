<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <a
        href="/"
        style="margin-left: 1rem"
        class="text-decoration-none text-dark fs-3"
        >Library</a
      >
      <form class="d-flex w-50">
        <div style="width: 95%">
          <input
            class="form-control me-2"
            v-model="keywordInput"
            type="search"
            placeholder="Search by ISBN, title, genre or author"
            aria-label="Search"
            onkeydown="return event.key != 'Enter';"
          />
        </div>
        <router-link
          v-if="keywordInput"
          :to="{ name: 'keywordSearch', params: { keyword: keywordInput } }"
          class="text-decoration-none text-dark"
        >
          <button type="button" class="btn btn-secondary">
            <i class="fas fa-search"></i>
          </button>
        </router-link>
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

        <!--<router-link v-if="isLoggedIn == true && isAdmin == true" :to="{name: 'createBook'}">
            <button  class="btn btn-outline-dark" style="margin-right: 1rem;" type="submit"><i class="fa-solid fa-plus fa-2x"></i></button>
            </router-link>-->
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
            "http://localhost:3000/users/currentuser/?key=" +
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
            console.log(response);
            if (response.data.admin) {
              this.isAdmin = true;
            }
          })
          .catch((error) => {console.log(error);});
      }
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
  },
};
</script>
