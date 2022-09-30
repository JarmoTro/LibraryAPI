<template>
<div class="text-center m-4 p-4">
    <div class="row">
        <div class="col"></div>
        <div class="col">
            <div v-if=" this.$route.name == 'login'">
            <h1 class="mb-4">Login</h1>
            </div>
            <div v-if=" this.$route.name == 'register'">
            <h1 class="mb-4">Register</h1>
            </div>


    <form action="/Login" method="POST" class="m-3">
        <div class="form-group mb-3">
          <label for="exampleInputEmail1"><h4>Username</h4></label>
          <input type="text" name="username" class="form-control" id="exampleInputEmail1" placeholder="Username">
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1"><h4>Password</h4></label>
          <input type="password" name = "password" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>
        <div v-if=" this.$route.name == 'register'">
        <div class="form-group mt-3">
          <label for="exampleInputPassword1"><h4>Confrim password</h4></label>
          <input type="password" name = "password" class="form-control" id="exampleInputPassword1" placeholder="Confirm password">
        </div>
        </div>
        <div v-if=" this.$route.name == 'login'">
         <button class="btn btn-primary mt-3 w-100" type="submit">LOG IN</button>
        </div>
        <div v-if=" this.$route.name == 'register'">
         <button class="btn btn-primary mt-3 w-100" type="submit">SIGN UP</button>
        </div>
      </form>
        <div v-if=" this.$route.name == 'login'">
         <router-link :to="{name: 'register'}"> Don't have an account? Sign up </router-link>
        </div>
        <div v-if=" this.$route.name == 'register'">
         <router-link :to="{name: 'login'}"> Already have an account? Log in </router-link>
        </div>
        </div>
        <div class="col"></div>
    </div>

    
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'auth',
  created() {
  },
  data() {
    return {
      errorMsg: '',
    }
  },
  methods: {
  },
  computed: {

  }
}

</script>