<script setup>

</script>

<template>
  <navbar :key="$route.fullPath"></navbar>

  <main>

    <router-view :key="$route.fullPath"></router-view>
    
  </main>

  <foot>

  </foot>


  
</template>

<script>
import navbar from "../src/components/navbar.vue"
import foot from "../src/components/footer.vue"
import card from "../src/components/card.vue"


export default {
  name: "App",
  components: {
    navbar,
    foot,
    card
  }
};
</script>

