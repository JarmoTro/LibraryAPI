import { createWebHistory, createRouter } from "vue-router";
import Home from "../components/card.vue";
import singleBook from "../components/singleCard.vue";
import auth from "../components/auth.vue"
import welcome from "../components/welcome.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
  path: "/author/:name",
  name: "author",
  component: Home,
},
{
  path: "/book/:id",
  name: "book",
  component: singleBook,
},
{
  path: "/book/search/:keyword",
  name: "keywordSearch",
  component: Home,
},
{
  path: "/login",
  name: "login",
  component: auth,
},
{
  path: "/register",
  name: "register",
  component: auth,
},
{
  path: "/welcome",
  name: "welcome",
  component: welcome,
},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;