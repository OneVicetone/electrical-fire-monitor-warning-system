import VueRouter from "vue-router";
import routes from "./routes";

const router = new VueRouter({
  mode: 'history',
  routes,
});

// router.beforeEach((to, from, next) => {
//   console.log('to ---', to)
//   console.log('from ---', from)
//   console.log('this ---', this)
// })

router.afterEach(toRoute => {
  const { title } = toRoute.meta
  document.title = title
})

export default router