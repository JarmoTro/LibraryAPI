<template>
    <div class="text-center m-3">
        <h1>Welcome!</h1>

        <router-link :to="{name: 'login'}" class="m-3"><h3 class="d-inline m-3">Login</h3></router-link>

        <router-link :to="{name: 'Home'}" class="m-3"><h3 class="d-inline m-3">Home</h3></router-link>


    </div>
</template>

<script>
export default {
  name: 'welcome',
}

</script>