<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, register } = useAuth()

const mode = ref('login')
const loading = ref(false)
const form = ref({ name: '', email: '', password: '', confirmPassword: '' })
const error = ref('')

const submit = async () => {
  error.value = ''
  if (!form.value.email || !form.value.password) {
    error.value = 'Por favor, completa todos los campos.'
    return
  }
  if (mode.value === 'register' && !form.value.name) {
    error.value = 'El nombre es obligatorio.'
    return
  }
  if (mode.value === 'register' && form.value.password !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  loading.value = true
  try {
    if (mode.value === 'login') {
      await login(form.value.email, form.value.password)
    } else {
      await register(form.value.name, form.value.email, form.value.password)
    }
    router.push('/')
  } catch (e) {
    const msg = e?.response?.data?.message || e?.response?.data?.errors?.email?.[0]
    error.value = msg || 'Ha ocurrido un error. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__bg"></div>
    <div class="login-page__overlay"></div>
    <div class="login-card">
      <div class="login-card__logo">
        <span class="logo-text">Chic's</span>
        <span class="logo-sub">Barber Club</span>
      </div>

      <div class="login-tabs">
        <button :class="['tab', { active: mode === 'login' }]" @click="mode = 'login'; error = ''">Iniciar sesión</button>
        <button :class="['tab', { active: mode === 'register' }]" @click="mode = 'register'; error = ''">Registrarse</button>
      </div>

      <form @submit.prevent="submit" class="login-form">
        <div v-if="mode === 'register'" class="field-group">
          <label class="field-label">Nombre completo</label>
          <input v-model="form.name" type="text" class="field-input" placeholder="Tu nombre" />
        </div>
        <div class="field-group">
          <label class="field-label">Email</label>
          <input v-model="form.email" type="email" class="field-input" placeholder="tu@email.com" />
        </div>
        <div class="field-group">
          <label class="field-label">Contraseña</label>
          <input v-model="form.password" type="password" class="field-input" placeholder="••••••••" />
        </div>
        <div v-if="mode === 'register'" class="field-group">
          <label class="field-label">Confirmar contraseña</label>
          <input v-model="form.confirmPassword" type="password" class="field-input" placeholder="••••••••" />
        </div>

        <div v-if="error" class="login-error">{{ error }}</div>

        <div v-if="mode === 'login'" class="login-forgot">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" class="btn-primary login-submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>{{ mode === 'login' ? 'Entrar' : 'Crear cuenta' }}</span>
        </button>
      </form>

      <p class="login-alt">
        {{ mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <button @click="mode = mode === 'login' ? 'register' : 'login'; error = ''" class="link-btn">
          {{ mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión' }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 80px 24px;
}
.login-page__bg {
  position: fixed;
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=80');
  background-size: cover;
  background-position: center;
  z-index: 0;
}
.login-page__overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,10,5,0.70);
  z-index: 1;
}
.login-card {
  position: relative;
  z-index: 2;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 40px 40px 36px;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-lg);
}
.login-card__logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
}
.logo-text {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
}
.logo-sub {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  font-weight: 500;
}

.login-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 4px;
  margin-bottom: 28px;
}
.tab {
  padding: 10px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: all var(--transition);
  cursor: pointer;
}
.tab.active {
  background: #fff;
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.login-form { display: flex; flex-direction: column; gap: 16px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); }
.field-input {
  padding: 12px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-family: var(--font-sans);
  color: var(--color-text);
  outline: none;
  transition: border-color var(--transition);
}
.field-input:focus { border-color: var(--color-accent); }

.login-error {
  background: #fff0f0;
  border: 1px solid #fcc;
  color: #c00;
  font-size: 0.82rem;
  padding: 10px 14px;
  border-radius: var(--radius);
}
.login-forgot { text-align: right; }
.login-forgot a { font-size: 0.82rem; color: var(--color-accent); }
.login-forgot a:hover { text-decoration: underline; }

.login-submit { width: 100%; justify-content: center; margin-top: 4px; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.login-alt { text-align: center; margin-top: 20px; font-size: 0.85rem; color: var(--color-text-muted); }
.link-btn {
  background: none;
  border: none;
  color: var(--color-accent);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
}
.link-btn:hover { text-decoration: underline; }

.spinner {
  display: inline-block;
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 480px) { .login-card { padding: 28px 24px; } }
</style>
