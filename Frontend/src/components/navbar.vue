<template>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <a href="/" style="margin-left: 1rem;" class="text-decoration-none text-dark fs-3">Library</a>
          <form class="d-flex w-50">
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  All categories
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </div> 
              <div style="width: 95%">
              <input class="form-control me-2" v-model="keywordInput" type="search" placeholder="Search by ISBN, title, author" aria-label="Search" onkeydown="return event.key != 'Enter';">
              </div>
              <router-link v-if="keywordInput" :to="{name: 'keywordSearch', params: {keyword: keywordInput}}" class="text-decoration-none text-dark">
              <button type="button" class="btn btn-secondary">
              <i class="fas fa-search"></i>
              </button>
              </router-link>
          </form>
          <form class="d-flex">
            <router-link :to="{name: 'user',params: {id: userId}}">
            <button :class="userClass" style="margin-right: 1rem;" type="submit"><i class="fa-solid fa-user fa-2x"></i></button>
            </router-link>
            <button @click="logout()"  :class="logoutClass" style="margin-right: 1rem;" type="submit"><i class="fa-solid fa-right-from-bracket fa-2x"></i></button>
            <router-link :to="{name: 'login'}">
            <button  :class="loginClass" style="margin-right: 1rem;" type="submit"><i class="fa-solid fa-right-to-bracket fa-2x"></i></button>
            </router-link>
          </form>
        </div>
      </nav>
</template>

<script>
import axios from 'axios'
export default {
  created() {
    this.checkAuth()
  },
  data() {
    return {
      keywordInput: '',
      loginClass: 'btn btn-outline-dark',
      logoutClass: 'btn btn-outline-dark d-none',
      userClass: 'btn btn-outline-dark d-none',
      userId: 'placeholder',
    }
  },
  methods: {
    checkAuth() {
      if (localStorage.token) {

              let token = localStorage.getItem("token");
         axios
        .get('http://localhost:3000/users/currentuser/?key='+import.meta.env.VITE_API_KEY,{
          headers: {
            Authorization: `Bearer ${token}`,
            token: token
          }
        })
        .then((response) => {
          this.userId = response.data._id
          this.logoutClass = 'btn btn-outline-dark'
          this.userClass = 'btn btn-outline-dark'
        this.loginClass = 'btn btn-outline-dark d-none'  
        })
        .catch((error) => {

          console.log(error)
        })
    }
    },
    logout(){
      localStorage.removeItem('token');
      this.$router.push('/') 
    },
  }
}

</script>