<script setup>
import { ref } from 'vue'
import api from '../api'

const form = ref({ name: '', email: '', phone: '', message: '' })
const submitted = ref(false)
const loading = ref(false)
const error = ref('')

const submit = async () => {
  if (!form.value.name || !form.value.email || !form.value.message) return
  loading.value = true
  error.value = ''
  try {
    await api.post('/contact', form.value)
    submitted.value = true
  } catch (e) {
    error.value = 'No se pudo enviar el mensaje. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}

const reset = () => {
  submitted.value = false
  form.value = { name: '', email: '', phone: '', message: '' }
  error.value = ''
}
</script>

<template>
  <div class="contact-page">
    <div class="contact-page__hero">
      <div class="container">
        <span class="section-tag">Contacto</span>
        <h1 class="section-title">Estamos aquí para ti</h1>
        <p class="section-subtitle">¿Tienes alguna pregunta? Escríbenos o llámanos directamente.</p>
      </div>
    </div>

    <div class="container contact-page__body">
      <div class="contact-layout">
        <!-- Info -->
        <div class="contact-info">
          <h2 class="contact-info__title">Información de contacto</h2>
          <div class="info-cards">
            <div class="info-card">
              <div class="info-card__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <h4>Dirección</h4>
                <p>Av. Jaume I, 17<br>46192 Montserrat, Valencia</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-card__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 9.79 19.79 19.79 0 01.08 1.18 2 2 0 012 .11h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
              </div>
              <div>
                <h4>Teléfono</h4>
                <a href="tel:607461357">607 46 13 57</a>
              </div>
            </div>
            <div class="info-card">
              <div class="info-card__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <h4>Horario</h4>
                <p>Lun – Vie: 9:00 – 20:00<br>Sábado: 9:00 – 14:00<br>Domingo: Cerrado</p>
              </div>
            </div>
          </div>

          <div class="map-placeholder">
            <iframe
              title="Ubicación Chic's Barber Club"
              width="100%" height="100%"
              frameborder="0" style="border:0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3074.0!2d-0.6036!3d39.3625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDIxJzQ1LjAiTiAwwrAzNicxMy4wIlc!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses"
              allowfullscreen loading="lazy"
            ></iframe>
          </div>
        </div>

        <!-- Form -->
        <div class="contact-form-wrap">
          <div v-if="submitted" class="contact-success">
            <div class="contact-success__icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3>¡Mensaje enviado!</h3>
            <p>Te responderemos lo antes posible.</p>
            <button class="btn-primary" @click="reset">Enviar otro mensaje</button>
          </div>
          <form v-else @submit.prevent="submit" class="contact-form">
            <h2>Envíanos un mensaje</h2>
            <div class="field-group">
              <label class="field-label">Nombre *</label>
              <input v-model="form.name" type="text" class="field-input" placeholder="Tu nombre" required />
            </div>
            <div class="field-group">
              <label class="field-label">Email *</label>
              <input v-model="form.email" type="email" class="field-input" placeholder="tu@email.com" required />
            </div>
            <div class="field-group">
              <label class="field-label">Teléfono (opcional)</label>
              <input v-model="form.phone" type="tel" class="field-input" placeholder="600 000 000" />
            </div>
            <div class="field-group">
              <label class="field-label">Mensaje *</label>
              <textarea v-model="form.message" class="field-input" rows="5" placeholder="¿En qué podemos ayudarte?" required></textarea>
            </div>
            <div v-if="error" class="form-error">{{ error }}</div>
            <button type="submit" class="btn-primary" :disabled="loading" style="width:100%; justify-content:center">
              <span v-if="loading" class="spinner"></span>
              <span v-else>Enviar mensaje</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page__hero {
  background: var(--color-primary);
  padding: 120px 0 48px;
  color: #fff;
}
.contact-page__hero .section-title { color: #fff; }
.contact-page__hero .section-subtitle { color: rgba(255,255,255,0.65); }
.contact-page__body { padding: 64px 24px 96px; }

.contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }

.contact-info__title { font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-primary); margin-bottom: 28px; }
.info-cards { display: flex; flex-direction: column; gap: 18px; margin-bottom: 32px; }
.info-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.info-card__icon {
  width: 44px; height: 44px;
  background: var(--color-accent-light);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-accent);
  flex-shrink: 0;
}
.info-card h4 { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 6px; }
.info-card p { font-size: 0.875rem; line-height: 1.7; color: var(--color-text); }
.info-card a { font-size: 0.875rem; color: var(--color-accent); font-weight: 600; }
.info-card a:hover { text-decoration: underline; }
.map-placeholder { border-radius: var(--radius-lg); overflow: hidden; height: 220px; border: 1px solid var(--color-border); }

.contact-form-wrap { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 36px; }
.contact-form h2 { font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-primary); margin-bottom: 28px; }
.contact-form { display: flex; flex-direction: column; gap: 18px; }
.field-group { display: flex; flex-direction: column; gap: 7px; }
.field-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); }
.field-input {
  padding: 12px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  outline: none;
  transition: border-color var(--transition);
}
.field-input:focus { border-color: var(--color-accent); background: #fff; }
textarea.field-input { resize: vertical; }

.form-error { background: #fff0f0; border: 1px solid #fcc; color: #c00; font-size: 0.82rem; padding: 10px 14px; border-radius: var(--radius); }

.contact-success { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; padding: 32px 0; }
.contact-success__icon { width: 64px; height: 64px; border-radius: 50%; background: var(--color-accent-light); color: var(--color-accent); display: flex; align-items: center; justify-content: center; }
.contact-success h3 { font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-primary); }
.contact-success p { color: var(--color-text-muted); font-size: 0.9rem; }

.spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

@media (max-width: 860px) { .contact-layout { grid-template-columns: 1fr; gap: 40px; } }
</style>
