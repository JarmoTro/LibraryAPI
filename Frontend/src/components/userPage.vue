<template> 
<div class="text-center">
<h1>{{username}}</h1>
<h2 v-if="reviews.length == 0"> Looks like this user doesn't have any reviews :(</h2>
<div class="row" style="margin-top:3rem">
<div class="col">
<h1 style="margin-bottom:2rem" v-if="reviews.length > 0"> Reviews </h1>
<div v-for="review in reviews">
  <div class="modal fade" v-bind:id="'_'+review._id" tabindex="-1">
  <div class="modal-dialog" style="padding-top: 15%">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete review</h5>
        <button type="fbutton" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Are you sure you want to delete the review with the title "{{review.title}}"?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteReview(review._id)">Delete review</button>
      </div>
    </div>
  </div>
</div>
            <h2 v-if="userId == review.user._id && !isAdmin" class="d-inline fw-bold" style="margin-left:2rem" > "{{review.title}}"</h2>
            <h2 v-if="userId != review.user._id && !isAdmin" class="d-inline fw-bold" >{{review.title}}</h2>
            <h2 v-if="userId == review.user._id && isAdmin" class="d-inline fw-bold" style="margin-left:4rem">"{{review.title}}"</h2>
            <h2 v-if="isAdmin && userId != review.user._id" class="d-inline fw-bold" style="margin-left:2rem" >"{{review.title}}"</h2>
            <router-link v-if="userId == review.user._id || isAdmin" class="text-dark text-decoration-none float-end" style="margin-left:1rem" :to="{}" data-bs-toggle="modal" v-bind:data-bs-target="'#_'+review._id"><i class="fa-solid fa-trash d-inline fa-xl text-danger"></i> </router-link>
            <router-link v-if="userId == review.user._id" class="text-dark text-decoration-none float-end"  :to="{name: 'login'}"><i class="fa-solid fa-pen-to-square d-inline fa-xl text-primary"></i> </router-link>
            <router-link class="text-dark text-decoration-none" :to="{ name: 'book', params: {id: review.book._id}}"><h4 class="m-3 hoverBlue"> {{review.book.title}}</h4></router-link>
            <h4 class="m-3">By {{review.user.username}}</h4>
            <p class="m-3 text-muted">{{review.createdAt}}</p>
            <div class="d-inline" v-for="star in review.rating">
              <i class="fa-solid fa-star fa-2x" style="color:#D4AF37;"></i>
            </div>
            <h5 class="m-3">{{review.body}}</h5>
            <hr>
            </div>
            </div>
        <div v-if="isAdmin == true || userId == this.$route.params.id" class="col"> 
        <h1 style="margin-bottom:2rem" v-if="loans.length > 0"> My loans </h1> 
        <div v-for="loan in loans">
        <router-link :to="{ name: 'book', params: {id: loan.book[0]._id}}" class="text-dark text-decoration-none"><h2 class="hoverBlue">{{loan.book[0].title}}</h2></router-link>
        <h2> {{loan.loanStart}}-{{loan.loanEnd}} </h2>
        <hr>
        </div>
        </div>
</div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'user',
  created() {
    this.getReviews(),
    this.getCurrentUser(),
    this.getUser(),
    this.getLoans()
  },
  data() {
    return {
      reviews: [],
      loans: [],
      errorMsg: '',
      userId: '',
      isLoggedIn: false,
      isAdmin: false,
      error: false,
      modalText: '',
      username: ''
    }
  },
  methods: {
    getReviews() {
      axios
        .get('http://localhost:3000/reviews/author/'+this.$route.params.id+'?key='+import.meta.env.VITE_API_KEY)
        .then((response) => {
        console.log(response);
          this.reviews = response.data
        })
        .catch((error) => {
          this.errorMsg = 'Error retrieving data'
        })
    },
    getLoans() {
      axios
        .get('http://localhost:3000/loans/user/'+this.$route.params.id+'?key='+import.meta.env.VITE_API_KEY)
        .then((response) => {
        console.log(response);
          this.loans = response.data
        })
        .catch((error) => {
          this.errorMsg = 'Error retrieving data'
        })
    },
    getCurrentUser(){
        let token = localStorage.getItem("token");
         axios
        .get('http://localhost:3000/users/currentuser/?key='+import.meta.env.VITE_API_KEY,{
          headers: {
            Authorization: `Bearer ${token}`,
            token: token
          }
        })
        .then((response) => {
          this.isLoggedIn = true
          this.userId = response.data._id
          if (response.data.admin) {
            this.isAdmin = true
          }
          console.log(response);
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getUser(){
        axios
        .get('http://localhost:3000/users/'+this.$route.params.id+'?key='+import.meta.env.VITE_API_KEY)
        .then((response) => {
            console.log(response);
            this.username = response.data.username
        })
        .catch((error) => {
            console.log(error);
        })
    },
    deleteReview(id){
      axios
      .delete('http://localhost:3000/reviews/'+id+'?key='+import.meta.env.VITE_API_KEY)
      .then((response) => {
        this.$router.go('/user/'+this.$route.params.id) 
        
      })
      .catch((error) => {
        console.log(error);
        this.error = true
      })
    },
  },
  computed: {

  }
}

</script>