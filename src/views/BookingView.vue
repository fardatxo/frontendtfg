<script setup>
import { ref, computed } from 'vue'
import api from '../api'

const services = [
  { id: 1, name: 'Corte Degradado', price: 14, duration: 30 },
  { id: 2, name: 'Corte Clásico', price: 14, duration: 35 },
  { id: 3, name: 'Corte al Mismo Número', price: 10, duration: 20 },
  { id: 4, name: 'Corte Jubilado', price: 7, duration: 20 },
  { id: 5, name: 'Corte Niños', price: 10, duration: 20 },
  { id: 6, name: 'Arreglo de Barba', price: 8, duration: 20 },
  { id: 7, name: 'Barba Completa', price: 16, duration: 45 },
  { id: 8, name: 'Corte + Barba', price: 22, duration: 55 },
]

const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30']

const step = ref(1)
const form = ref({
  service: null,
  date: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  notes: '',
})
const submitted = ref(false)
const loading = ref(false)
const apiError = ref('')

const today = new Date().toISOString().split('T')[0]

const selectedService = computed(() => services.find(s => s.id === form.value.service))

const canNext = computed(() => {
  if (step.value === 1) return !!form.value.service
  if (step.value === 2) return form.value.date && form.value.time
  if (step.value === 3) return form.value.name && form.value.phone && form.value.email
  return false
})

const nextStep = () => { if (canNext.value && step.value < 3) step.value++ }
const prevStep = () => { if (step.value > 1) step.value-- }

const submitBooking = async () => {
  if (!canNext.value) return
  loading.value = true
  apiError.value = ''
  try {
    await api.post('/appointments', {
      service_name:     selectedService.value.name,
      service_price:    selectedService.value.price,
      service_duration: selectedService.value.duration,
      date:             form.value.date,
      time:             form.value.time,
      client_name:      form.value.name,
      client_phone:     form.value.phone,
      client_email:     form.value.email,
      notes:            form.value.notes,
    })
    submitted.value = true
  } catch (e) {
    apiError.value = 'No se pudo guardar la reserva. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  submitted.value = false
  step.value = 1
  form.value = { service: null, date: '', time: '', name: '', phone: '', email: '', notes: '' }
  apiError.value = ''
}

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="booking-page">
    <div class="booking-page__hero">
      <div class="container">
        <span class="section-tag">Reservas online</span>
        <h1 class="section-title">Reserva tu cita</h1>
        <p class="section-subtitle">Elige tu servicio, día y hora en pocos pasos.</p>
      </div>
    </div>

    <div class="container booking-page__body">
      <!-- Success State -->
      <div v-if="submitted" class="booking-success">
        <div class="booking-success__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2>¡Cita reservada!</h2>
        <p>Hemos recibido tu reserva. Te enviaremos un recordatorio por email.</p>
        <div class="booking-success__summary">
          <div class="bs-row"><span>Servicio</span><strong>{{ selectedService?.name }}</strong></div>
          <div class="bs-row"><span>Fecha</span><strong>{{ formatDate(form.date) }}</strong></div>
          <div class="bs-row"><span>Hora</span><strong>{{ form.time }}</strong></div>
          <div class="bs-row"><span>Nombre</span><strong>{{ form.name }}</strong></div>
        </div>
        <button class="btn-primary" @click="resetForm">Hacer otra reserva</button>
      </div>

      <!-- Booking Form -->
      <div v-else class="booking-form">
        <!-- Progress -->
        <div class="booking-progress">
          <div v-for="n in 3" :key="n" :class="['bp-step', { active: step === n, done: step > n }]">
            <div class="bp-step__dot">
              <svg v-if="step > n" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else>{{ n }}</span>
            </div>
            <span class="bp-step__label">{{ ['Servicio', 'Fecha y hora', 'Tus datos'][n-1] }}</span>
          </div>
          <div class="bp-line"></div>
        </div>

        <!-- Step 1: Service -->
        <div v-if="step === 1" class="step-panel">
          <h2 class="step-title">Elige tu servicio</h2>
          <div class="services-select-grid">
            <button
              v-for="s in services"
              :key="s.id"
              :class="['service-option', { selected: form.service === s.id }]"
              @click="form.service = s.id"
            >
              <div class="service-option__check">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div class="service-option__info">
                <span class="service-option__name">{{ s.name }}</span>
                <span class="service-option__meta">{{ s.duration }} min</span>
              </div>
              <span class="service-option__price">{{ s.price }}€</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Date & Time -->
        <div v-if="step === 2" class="step-panel">
          <h2 class="step-title">Elige fecha y hora</h2>
          <div class="datetime-layout">
            <div class="field-group">
              <label class="field-label">Fecha</label>
              <input v-model="form.date" type="date" class="field-input" :min="today" />
            </div>
            <div class="field-group" v-if="form.date">
              <label class="field-label">Hora disponible</label>
              <div class="time-slots">
                <button
                  v-for="t in timeSlots"
                  :key="t"
                  :class="['time-slot', { selected: form.time === t }]"
                  @click="form.time = t"
                >{{ t }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Personal data -->
        <div v-if="step === 3" class="step-panel">
          <h2 class="step-title">Tus datos</h2>
          <div class="personal-form">
            <div class="field-group">
              <label class="field-label">Nombre completo *</label>
              <input v-model="form.name" type="text" class="field-input" placeholder="Ej: Juan García" />
            </div>
            <div class="field-group">
              <label class="field-label">Teléfono *</label>
              <input v-model="form.phone" type="tel" class="field-input" placeholder="600 000 000" />
            </div>
            <div class="field-group field-group--full">
              <label class="field-label">Email *</label>
              <input v-model="form.email" type="email" class="field-input" placeholder="tu@email.com" />
            </div>
            <div class="field-group field-group--full">
              <label class="field-label">Notas (opcional)</label>
              <textarea v-model="form.notes" class="field-input" rows="3" placeholder="Cuéntanos algo sobre tu corte ideal..."></textarea>
            </div>
          </div>

          <!-- Summary -->
          <div class="booking-summary">
            <h4>Resumen de tu reserva</h4>
            <div class="bs-row"><span>Servicio</span><strong>{{ selectedService?.name }}</strong></div>
            <div class="bs-row"><span>Precio</span><strong>{{ selectedService?.price }}€</strong></div>
            <div class="bs-row"><span>Duración</span><strong>{{ selectedService?.duration }} min</strong></div>
            <div class="bs-row"><span>Fecha</span><strong>{{ formatDate(form.date) }}</strong></div>
            <div class="bs-row"><span>Hora</span><strong>{{ form.time }}</strong></div>
          </div>

          <div v-if="apiError" class="api-error">{{ apiError }}</div>
        </div>

        <!-- Navigation -->
        <div class="booking-nav">
          <button v-if="step > 1" class="btn-back" @click="prevStep">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Atrás
          </button>
          <div v-else></div>
          <button v-if="step < 3" class="btn-primary" :disabled="!canNext" @click="nextStep">
            Continuar
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button v-else class="btn-primary" :disabled="!canNext || loading" @click="submitBooking">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Confirmar reserva</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-page__hero {
  background: var(--color-primary);
  padding: 120px 0 48px;
  color: #fff;
}
.booking-page__hero .section-title { color: #fff; }
.booking-page__hero .section-subtitle { color: rgba(255,255,255,0.65); }

.booking-page__body {
  padding: 56px 24px 96px;
}

.booking-success {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.booking-success__icon {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: var(--color-accent-light);
  color: var(--color-accent);
  display: flex; align-items: center; justify-content: center;
}
.booking-success h2 { font-family: var(--font-serif); font-size: 1.8rem; color: var(--color-primary); }
.booking-success p { color: var(--color-text-muted); }
.booking-success__summary {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin: 8px 0;
}

.booking-form { max-width: 640px; margin: 0 auto; }

.booking-progress {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-bottom: 48px;
}
.bp-line {
  position: absolute;
  top: 18px; left: 10%; right: 10%;
  height: 1px;
  background: var(--color-border);
  z-index: 0;
}
.bp-step { display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 1; }
.bp-step__dot {
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-bg);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: all var(--transition);
}
.bp-step.active .bp-step__dot { border-color: var(--color-accent); background: var(--color-accent); color: #fff; }
.bp-step.done .bp-step__dot { border-color: var(--color-accent); background: var(--color-accent-light); color: var(--color-accent); }
.bp-step__label { font-size: 0.78rem; color: var(--color-text-muted); font-weight: 500; }
.bp-step.active .bp-step__label { color: var(--color-accent); }

.step-title { font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-primary); margin-bottom: 28px; }

.services-select-grid { display: flex; flex-direction: column; gap: 10px; }
.service-option {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  padding: 16px 20px;
  text-align: left;
  transition: all var(--transition);
  cursor: pointer;
}
.service-option:hover { border-color: var(--color-accent); background: var(--color-accent-light); }
.service-option.selected { border-color: var(--color-accent); background: var(--color-accent-light); }
.service-option__check {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: flex; align-items: center; justify-content: center;
  color: transparent;
  flex-shrink: 0;
  transition: all var(--transition);
}
.service-option.selected .service-option__check { background: var(--color-accent); border-color: var(--color-accent); color: #fff; }
.service-option__info { flex: 1; }
.service-option__name { display: block; font-weight: 600; font-size: 0.9rem; color: var(--color-primary); }
.service-option__meta { font-size: 0.78rem; color: var(--color-text-muted); }
.service-option__price { font-weight: 700; font-size: 1rem; color: var(--color-accent); }

.datetime-layout { display: flex; flex-direction: column; gap: 28px; }
.field-group { display: flex; flex-direction: column; gap: 8px; }
.field-label { font-size: 0.82rem; font-weight: 600; color: var(--color-text-muted); letter-spacing: 0.05em; text-transform: uppercase; }
.field-input {
  padding: 12px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-family: var(--font-sans);
  background: var(--color-surface);
  color: var(--color-text);
  outline: none;
  transition: border-color var(--transition);
}
.field-input:focus { border-color: var(--color-accent); }
textarea.field-input { resize: vertical; }
.time-slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.time-slot {
  padding: 10px 6px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
  transition: all var(--transition);
  cursor: pointer;
}
.time-slot:hover { border-color: var(--color-accent); color: var(--color-accent); }
.time-slot.selected { background: var(--color-accent); border-color: var(--color-accent); color: #fff; }

.personal-form { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 32px; }
.field-group--full { grid-column: 1 / -1; }

.booking-summary {
  background: var(--color-accent-light);
  border: 1px solid rgba(201, 169, 110, 0.3);
  border-radius: var(--radius-lg);
  padding: 22px 24px;
  margin-bottom: 8px;
}
.booking-summary h4 { font-family: var(--font-serif); font-size: 1rem; color: var(--color-primary); margin-bottom: 14px; }
.bs-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  padding: 6px 0;
  border-bottom: 1px solid rgba(201, 169, 110, 0.2);
  color: var(--color-text);
}
.bs-row:last-child { border-bottom: none; }
.bs-row span { color: var(--color-text-muted); }

.api-error {
  background: #fff0f0;
  border: 1px solid #fcc;
  color: #c00;
  font-size: 0.82rem;
  padding: 10px 14px;
  border-radius: var(--radius);
  margin-top: 12px;
}

.booking-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: none;
  border: 1.5px solid var(--color-border);
  padding: 12px 20px;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: all var(--transition);
  cursor: pointer;
}
.btn-back:hover { border-color: var(--color-text); color: var(--color-text); }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.spinner {
  display: inline-block;
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .personal-form { grid-template-columns: 1fr; }
  .field-group--full { grid-column: auto; }
  .time-slots { grid-template-columns: repeat(3, 1fr); }
  .bp-step__label { display: none; }
}
</style>
