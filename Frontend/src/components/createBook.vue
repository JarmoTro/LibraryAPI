<template>


<div class="m-3 text-center row">

<h1>Create a new book</h1>

    <div :class="errorClass" role="alert" >
    {{errorMsg}}
    </div>

<div class="col">
</div>

<div class="col-7">
    <form v-on:submit.prevent="createBook">
            <div class="input-group m-3">
  <span class="input-group-text" id="basic-addon1">Title</span>
  <input type="text" name="title" v-model="title" class="form-control" placeholder="Title" aria-label="Username" aria-describedby="basic-addon1">
</div>

        <p v-for="error of v$.$errors"
                :key="error.$uid">
                  <strong class="text-danger" v-if="error.$property == 'title'">{{ error.$message }}</strong>
                </p>

<div class="input-group m-3">
  <span class="input-group-text" id="basic-addon1">Author</span>
  <input type="text" name="author" v-model="author" class="form-control" placeholder="Author" aria-label="Username" aria-describedby="basic-addon1">
</div>

<p v-for="error of v$.$errors"
                :key="error.$uid">
                  <strong class="text-danger" v-if="error.$property == 'author'">{{ error.$message }}</strong>
                </p>

<div class="input-group m-3">
  <span class="input-group-text">Description</span>
  <textarea class="form-control" name="description" v-model="description" aria-label="With textarea" placeholder="Description"></textarea>
</div>

<p v-for="error of v$.$errors"
                :key="error.$uid">
                  <strong class="text-danger" v-if="error.$property == 'description'">{{ error.$message }}</strong>
                </p>

<div class="input-group m-3">
  <span class="input-group-text" id="basic-addon1">Length</span>
  <input type="number" v-model="length" name="length" class="form-control" placeholder="Length" aria-label="Username" aria-describedby="basic-addon1">
</div>

<p v-for="error of v$.$errors"
                :key="error.$uid">
                  <strong class="text-danger" v-if="error.$property == 'length'">{{ error.$message }}</strong>
                </p>

<div class="input-group m-3">
  <span class="input-group-text" id="basic-addon1">Stock</span>
  <input type="number" name="stock" v-model="stock" class="form-control" placeholder="Stock" aria-label="Username" aria-describedby="basic-addon1">
</div>

<p v-for="error of v$.$errors"
                :key="error.$uid">
                  <strong class="text-danger" v-if="error.$property == 'stock'">{{ error.$message }}</strong>
                </p>

<div class="input-group m-3">
  <span class="input-group-text" id="basic-addon1">ISBN</span>
  <input type="text" name="isbn" v-model="isbn" class="form-control" placeholder="ISBN" aria-label="Username" aria-describedby="basic-addon1">
</div>

<p v-for="error of v$.$errors"
                :key="error.$uid">
                  <strong class="text-danger" v-if="error.$property == 'isbn'">{{ error.$message }}</strong>
                </p>

<div class="input-group m-3">
  <span class="input-group-text" id="basic-addon1">Date</span>
  <input type="date" name="date" v-model="date" class="form-control" placeholder="Date" aria-label="Username" aria-describedby="basic-addon1" max="31">
</div>

<p v-for="error of v$.$errors"
                :key="error.$uid">
                  <strong class="text-danger" v-if="error.$property == 'date'">{{ error.$message }}</strong>
                </p>


<div class="input-group m-3">
  <label class="input-group-text" for="inputGroupFile01">Book cover</label>
  <input type="file" name="coverImg" v-on:change="coverImg" accept="image/png, image/jpg, image/jpeg, image/webp" class="form-control" id="inputGroupFile01">
</div>

<p v-for="error of v$.$errors"
                :key="error.$uid">
                  <strong class="text-danger" v-if="error.$property == 'coverImg'">{{ error.$message }}</strong>
                </p>

<button type="submit" class="btn btn-primary">CREATE</button>

    </form>
</div>

<div class="col">
</div>

</div>
</template>

<script>
import axios from 'axios'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue} from '@vuelidate/validators'
export default {
  name: 'createBook',
    setup () {
    return { v$: useVuelidate() }
  },
  created() {
    this.getCurrentUser()
  },
  data() {
    return {
      title: '',
      author: '',
      isbn: '',
      length: '',
      description: '',
      stock: '',
      date: '',
      errorMsg: '',
      errorClass: 'alert alert-danger d-none'
    }
  },
    validations: {
    title:{
        required
    },
    author:{
        required
    },
    isbn:{
        required
    },
    length:{
        required,
        minValue: minValue(1),
    },
    description:{
        required
    },
    stock:{
        required,
        minValue: minValue(0),
    },
    date:{
        required
    },
  },
  methods: {
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
          if (!response.data.admin) {
              this.$router.push('/login') 
          }
          console.log(response);
        })
        .catch((error) => {
          this.$router.push('/login') 
          console.log(error)
        })
    },
    async createBook(submitEvent){
        const result = await this.v$.$validate()
        if(result){
            const coverImg = submitEvent.target.elements.coverImg.value
            const fileExtension = coverImg.split('.').pop();
            if(!coverImg){
                this.errorMsg = "Cover image is required."
                this.errorClass = "alert alert-danger"
            }
            else if(fileExtension != 'jpeg' || fileExtension != 'jpg' || fileExtension != 'webp' || fileExtension != 'png'){
                this.errorMsg = "Invalid file type '"+fileExtension+"'. Valid file types: jpeg, jpg, webp, png"
                this.errorClass = "alert alert-danger"
            }
            console.log(submitEvent.target.elements.coverImg.value);
            axios
            .post('http://localhost:3000/books/',{
                "key":import.meta.env.VITE_API_KEY,
                "title":submitEvent.target.elements.title.value,
                "author":submitEvent.target.elements.author.value,
                "isbn":submitEvent.target.elements.isbn.value,
                "length":submitEvent.target.elements.length.value,
                "stock":submitEvent.target.elements.stock.value,
                "publicationDate":Math.floor(new Date(submitEvent.target.elements.date.value).getTime() / 1000),
                "description":submitEvent.target.elements.description.value,
                "coverImg":submitEvent.target.elements.coverImg.value
        })
        }

    }
  },
  computed: {

  }
}

</script>