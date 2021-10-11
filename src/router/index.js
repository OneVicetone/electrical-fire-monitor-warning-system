import VueRouter from "vue-router";
import routes from "./routes";

const router = new VueRouter({
  mode: 'history',
  routes,
});

// router.afterEach(toRoute => {
//   const { title } = toRoute.meta
//   document.title = title
// })

export default router