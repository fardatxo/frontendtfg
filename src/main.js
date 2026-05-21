import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import BookingView from './views/BookingView.vue'
import ShopView from './views/ShopView.vue'
import ContactView from './views/ContactView.vue'
import LoginView from './views/LoginView.vue'
import CartView from './views/CartView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/reservar', component: BookingView },
    { path: '/tienda', component: ShopView },
    { path: '/contacto', component: ContactView },
    { path: '/login', component: LoginView },
    { path: '/carrito', component: CartView },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
