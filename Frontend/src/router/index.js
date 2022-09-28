import { createWebHistory, createRouter } from "vue-router";
import Home from "../components/card.vue";
import singleBook from "../components/singleCard.vue";


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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;