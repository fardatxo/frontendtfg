<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { useCart } from './composables/useCart'

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()
const { cartCount } = useCart()

const mobileOpen = ref(false)
const scrolled = ref(false)

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Reservar cita', to: '/reservar' },
  { label: 'Tienda', to: '/tienda' },
  { label: 'Contacto', to: '/contacto' },
]

const isActive = (path) => route.path === path

const handleScroll = () => { scrolled.value = window.scrollY > 40 }

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const closeMobile = () => { mobileOpen.value = false }

const handleLogout = async () => {
  await logout()
  closeMobile()
  router.push('/')
}
</script>

<template>
  <div id="app-root">
    <!-- Navbar -->
    <header :class="['navbar', { 'navbar--scrolled': scrolled }]">
      <div class="container navbar__inner">
        <!-- Logo -->
        <RouterLink to="/" class="navbar__logo" @click="closeMobile">
          <span class="logo-text">Chic's</span>
          <span class="logo-sub">Barber Club</span>
        </RouterLink>

        <!-- Desktop Nav -->
        <nav class="navbar__links">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="['nav-link', { 'nav-link--active': isActive(link.to) }]"
          >{{ link.label }}</RouterLink>
        </nav>

        <!-- Actions -->
        <div class="navbar__actions">
          <template v-if="user">
            <span class="nav-user">{{ user.name }}</span>
            <button class="btn-nav" @click="handleLogout">Cerrar sesión</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="btn-nav">Acceder</RouterLink>
          </template>
          <RouterLink to="/carrito" class="cart-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </RouterLink>
          <!-- Mobile toggle -->
          <button class="mobile-toggle" @click="mobileOpen = !mobileOpen" aria-label="Menu">
            <span :class="['burger', { 'burger--open': mobileOpen }]"></span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <Transition name="mobile-menu">
        <div v-if="mobileOpen" class="mobile-menu">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="['mobile-link', { 'mobile-link--active': isActive(link.to) }]"
            @click="closeMobile"
          >{{ link.label }}</RouterLink>
          <div class="mobile-divider"></div>
          <template v-if="user">
            <span class="mobile-link mobile-user">{{ user.name }}</span>
            <button class="mobile-link mobile-logout" @click="handleLogout">Cerrar sesión</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="mobile-link" @click="closeMobile">Acceder</RouterLink>
          </template>
          <RouterLink to="/carrito" class="mobile-link" @click="closeMobile">Carrito</RouterLink>
        </div>
      </Transition>
    </header>

    <!-- Main content -->
    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <div class="footer__logo">Chic's <span>Barber Club</span></div>
          <p>Tu estilo, nuestra obsesión. Barbería premium en el corazón de Montserrat, Valencia.</p>
        </div>
        <div class="footer__col">
          <h4>Horario</h4>
          <div class="footer__hours">
            <div class="hours-row"><span>Lun – Vie</span><span>9:00 – 20:00</span></div>
            <div class="hours-row"><span>Sábado</span><span>9:00 – 14:00</span></div>
            <div class="hours-row closed"><span>Domingo</span><span>Cerrado</span></div>
          </div>
        </div>
        <div class="footer__col">
          <h4>Contacto</h4>
          <p>Av. Jaume I, 17<br>46192 Montserrat, Valencia</p>
          <a href="tel:607461357" class="footer__phone">607 46 13 57</a>
        </div>
        <div class="footer__col">
          <h4>Navegación</h4>
          <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" class="footer__nav-link">
            {{ link.label }}
          </RouterLink>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="container">
          <p>© 2026 Chic's Barber Club. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ─── Navbar ─── */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: transparent;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.navbar--scrolled {
  background: rgba(250, 249, 247, 0.97);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 var(--color-border);
}
.navbar__inner {
  display: flex;
  align-items: center;
  height: 72px;
  gap: 32px;
}
.navbar__logo {
  display: flex;
  flex-direction: column;
  line-height: 1;
  flex-shrink: 0;
}
.logo-text {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: -0.02em;
}
.logo-sub {
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  font-weight: 500;
}
.navbar--scrolled .logo-sub,
.navbar--scrolled .logo-text { color: var(--color-accent); }
.navbar:not(.navbar--scrolled) .logo-sub { color: rgba(255,255,255,0.7); }
.navbar:not(.navbar--scrolled) .logo-text { color: #e8c97a; }

.navbar__links {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}
.nav-link {
  padding: 8px 14px;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255,255,255,0.85);
  transition: color var(--transition), background var(--transition);
}
.nav-link:hover { color: #fff; background: rgba(255,255,255,0.1); }
.nav-link--active { color: #fff; }
.navbar--scrolled .nav-link { color: var(--color-text-muted); }
.navbar--scrolled .nav-link:hover { color: var(--color-primary); background: var(--color-accent-light); }
.navbar--scrolled .nav-link--active { color: var(--color-accent); }

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.nav-user {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255,255,255,0.85);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.navbar--scrolled .nav-user { color: var(--color-text); }

.btn-nav {
  padding: 8px 18px;
  border-radius: var(--radius);
  font-size: 0.88rem;
  font-weight: 500;
  border: 1.5px solid rgba(255,255,255,0.55);
  color: rgba(255,255,255,0.9);
  background: none;
  cursor: pointer;
  font-family: var(--font-sans);
  transition: all var(--transition);
}
.btn-nav:hover { background: rgba(255,255,255,0.12); border-color: #fff; color: #fff; }
.navbar--scrolled .btn-nav {
  border-color: var(--color-border);
  color: var(--color-text);
}
.navbar--scrolled .btn-nav:hover { background: var(--color-accent-light); border-color: var(--color-accent); }

.cart-btn {
  position: relative;
  display: flex;
  align-items: center;
  color: rgba(255,255,255,0.85);
  transition: color var(--transition);
  padding: 6px;
}
.cart-btn:hover { color: #fff; }
.navbar--scrolled .cart-btn { color: var(--color-text-muted); }
.navbar--scrolled .cart-btn:hover { color: var(--color-primary); }
.cart-badge {
  position: absolute;
  top: 0; right: 0;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.6rem;
  width: 16px; height: 16px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  padding: 6px;
  align-items: center;
  justify-content: center;
}
.burger {
  display: block;
  width: 22px;
  height: 2px;
  background: rgba(255,255,255,0.85);
  border-radius: 2px;
  position: relative;
  transition: all 0.25s;
}
.burger::before,
.burger::after {
  content: '';
  position: absolute;
  left: 0; width: 100%; height: 2px;
  background: inherit;
  border-radius: 2px;
  transition: all 0.25s;
}
.burger::before { top: -7px; }
.burger::after { top: 7px; }
.burger--open { background: transparent; }
.burger--open::before { top: 0; transform: rotate(45deg); background: var(--color-text); }
.burger--open::after { top: 0; transform: rotate(-45deg); background: var(--color-text); }
.navbar--scrolled .burger { background: var(--color-text); }

.mobile-menu {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mobile-link {
  padding: 12px 16px;
  border-radius: var(--radius);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
  transition: background var(--transition), color var(--transition);
  text-align: left;
}
.mobile-link:hover { background: var(--color-accent-light); color: var(--color-accent); }
.mobile-link--active { color: var(--color-accent); }
.mobile-divider { height: 1px; background: var(--color-border); margin: 8px 0; }
.mobile-user { color: var(--color-text-muted); font-size: 0.85rem; }
.mobile-logout {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  color: #c00;
}
.mobile-logout:hover { background: #fff0f0; color: #c00; }

.mobile-menu-enter-active,
.mobile-menu-leave-active { transition: opacity 0.2s, transform 0.2s; }
.mobile-menu-enter-from,
.mobile-menu-leave-to { opacity: 0; transform: translateY(-8px); }

/* ─── Footer ─── */
.footer {
  background: var(--color-primary);
  color: rgba(255,255,255,0.75);
  margin-top: 0;
}
.footer__inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  padding: 64px 24px 48px;
}
.footer__logo {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 12px;
}
.footer__logo span { font-size: 1rem; font-weight: 400; }
.footer__brand p { font-size: 0.9rem; line-height: 1.7; max-width: 280px; }
.footer__col h4 {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin-bottom: 16px;
}
.footer__hours { display: flex; flex-direction: column; gap: 6px; }
.hours-row { display: flex; justify-content: space-between; gap: 16px; font-size: 0.88rem; }
.hours-row.closed { opacity: 0.45; }
.footer__col p { font-size: 0.88rem; line-height: 1.7; }
.footer__phone {
  display: inline-block;
  margin-top: 8px;
  font-size: 0.88rem;
  color: var(--color-accent);
}
.footer__phone:hover { text-decoration: underline; }
.footer__nav-link {
  display: block;
  font-size: 0.88rem;
  padding: 4px 0;
  color: rgba(255,255,255,0.65);
  transition: color var(--transition);
}
.footer__nav-link:hover { color: var(--color-accent); }
.footer__bottom {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 20px 24px;
}
.footer__bottom p { font-size: 0.8rem; color: rgba(255,255,255,0.35); }

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .navbar__links { display: none; }
  .btn-nav { display: none; }
  .nav-user { display: none; }
  .mobile-toggle { display: flex; }
  .footer__inner { grid-template-columns: 1fr 1fr; gap: 32px; }
}
@media (max-width: 600px) {
  .footer__inner { grid-template-columns: 1fr; gap: 28px; padding: 40px 24px 32px; }
}
</style>
