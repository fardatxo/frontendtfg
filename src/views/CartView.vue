<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { useCart } from '../composables/useCart'

const router = useRouter()
const { items, cartTotal, removeFromCart, updateQty, clearCart } = useCart()

const step = ref(1) // 1 = carrito, 2 = envío, 3 = pago, 4 = confirmación

const shipping = computed(() => cartTotal.value >= 40 ? 0 : 4.95)
const orderTotal = computed(() => cartTotal.value + shipping.value)

// Step 2 – shipping form
const form = ref({
  client_name: '',
  client_email: '',
  client_phone: '',
  address: '',
  city: '',
  postal_code: '',
})

// Step 3 – payment simulation
const card = ref({ number: '', expiry: '', cvv: '', name: '' })
const cardError = ref('')
const paying = ref(false)
const confirmedOrder = ref(null)

const formatCardNumber = (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 16)
  card.value.number = v.replace(/(.{4})/g, '$1 ').trim()
}
const formatExpiry = (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4)
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
  card.value.expiry = v
}

const last4 = computed(() => card.value.number.replace(/\s/g, '').slice(-4) || '0000')

const submitOrder = async () => {
  const digits = card.value.number.replace(/\s/g, '')
  if (digits.length < 16) { cardError.value = 'Introduce los 16 dígitos de la tarjeta.'; return }
  if (card.value.expiry.length < 5) { cardError.value = 'Introduce la fecha de caducidad.'; return }
  if (card.value.cvv.length < 3) { cardError.value = 'Introduce el CVV (3 dígitos).'; return }
  if (!card.value.name.trim()) { cardError.value = 'Introduce el nombre del titular.'; return }
  cardError.value = ''
  paying.value = true

  try {
    const payload = {
      ...form.value,
      payment_last4: last4.value,
      items: items.value.map(i => ({
        product_id: i.product_id,
        product_name: i.name,
        product_brand: i.brand,
        price: i.price,
        qty: i.qty,
      })),
    }
    const { data } = await api.post('/orders', payload)
    confirmedOrder.value = data
    clearCart()
    step.value = 4
  } catch (err) {
    cardError.value = err?.response?.data?.message || 'No se pudo procesar el pago. Inténtalo de nuevo.'
  } finally {
    paying.value = false
  }
}

const stepLabel = (n) => ['Carrito', 'Envío', 'Pago', 'Confirmación'][n - 1]
</script>

<template>
  <div class="cart-page">
    <div class="cart-page__hero">
      <div class="container">
        <span class="section-tag">Compra</span>
        <h1 class="section-title">{{ stepLabel(step) }}</h1>
      </div>
    </div>

    <!-- Progress bar -->
    <div v-if="step < 4" class="progress-bar-wrap">
      <div class="container">
        <div class="progress-steps">
          <div v-for="n in 3" :key="n" :class="['progress-step', { active: step >= n, current: step === n }]">
            <div class="progress-step__dot">{{ n }}</div>
            <span>{{ stepLabel(n) }}</span>
            <div v-if="n < 3" class="progress-step__line" :class="{ filled: step > n }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="container cart-page__body">

      <!-- ── STEP 1: Cart ── -->
      <template v-if="step === 1">
        <div v-if="items.length === 0" class="cart-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" color="var(--color-border)"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <h3>Tu carrito está vacío</h3>
          <p>Explora nuestra tienda para encontrar los mejores productos.</p>
          <RouterLink to="/tienda" class="btn-primary">Ir a la tienda</RouterLink>
        </div>
        <div v-else class="cart-layout">
          <div class="cart-items">
            <div v-for="item in items" :key="item.id" class="cart-row">
              <img :src="item.image" :alt="item.name" class="cart-row__img" />
              <div class="cart-row__info">
                <span class="cart-row__brand">{{ item.brand }}</span>
                <h3 class="cart-row__name">{{ item.name }}</h3>
                <span class="cart-row__price-unit">{{ item.price.toFixed(2) }}€ / ud.</span>
              </div>
              <div class="cart-row__controls">
                <button @click="updateQty(item.id, -1)">−</button>
                <span>{{ item.qty }}</span>
                <button @click="updateQty(item.id, 1)">+</button>
              </div>
              <div class="cart-row__subtotal">{{ (item.price * item.qty).toFixed(2) }}€</div>
              <button class="cart-row__remove" @click="removeFromCart(item.id)" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          <div class="cart-summary">
            <h3>Resumen del pedido</h3>
            <div class="cs-row"><span>Subtotal</span><span>{{ cartTotal.toFixed(2) }}€</span></div>
            <div class="cs-row">
              <span>Envío</span>
              <span :class="{ 'free-shipping': shipping === 0 }">{{ shipping === 0 ? 'Gratis' : shipping.toFixed(2) + '€' }}</span>
            </div>
            <p v-if="shipping > 0" class="shipping-note">Envío gratis a partir de 40€</p>
            <div class="cs-row cs-row--total">
              <span>Total</span>
              <strong>{{ orderTotal.toFixed(2) }}€</strong>
            </div>
            <button class="btn-primary" style="width:100%; justify-content:center; margin-top:8px" @click="step = 2">
              Continuar con el envío →
            </button>
            <RouterLink to="/tienda" class="continue-shopping">← Seguir comprando</RouterLink>
          </div>
        </div>
      </template>

      <!-- ── STEP 2: Shipping ── -->
      <template v-if="step === 2">
        <div class="checkout-layout">
          <form class="checkout-form" @submit.prevent="step = 3">
            <div class="form-section">
              <h3>Datos de contacto</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre completo *</label>
                  <input v-model="form.client_name" required placeholder="Juan García" />
                </div>
                <div class="form-group">
                  <label>Email *</label>
                  <input v-model="form.client_email" type="email" required placeholder="juan@email.com" />
                </div>
              </div>
              <div class="form-group">
                <label>Teléfono *</label>
                <input v-model="form.client_phone" required placeholder="600 000 000" />
              </div>
            </div>
            <div class="form-section">
              <h3>Dirección de envío</h3>
              <div class="form-group">
                <label>Dirección *</label>
                <input v-model="form.address" required placeholder="Calle Mayor, 1, 2º A" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Ciudad *</label>
                  <input v-model="form.city" required placeholder="Valencia" />
                </div>
                <div class="form-group">
                  <label>Código postal *</label>
                  <input v-model="form.postal_code" required placeholder="46001" maxlength="5" />
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-outline" @click="step = 1">← Volver</button>
              <button type="submit" class="btn-primary">Continuar al pago →</button>
            </div>
          </form>
          <div class="checkout-summary">
            <h3>Tu pedido</h3>
            <div v-for="item in items" :key="item.id" class="summary-item">
              <img :src="item.image" :alt="item.name" />
              <div class="summary-item__info">
                <span>{{ item.name }}</span>
                <small>× {{ item.qty }}</small>
              </div>
              <span>{{ (item.price * item.qty).toFixed(2) }}€</span>
            </div>
            <div class="summary-divider"></div>
            <div class="cs-row"><span>Subtotal</span><span>{{ cartTotal.toFixed(2) }}€</span></div>
            <div class="cs-row"><span>Envío</span><span :class="{ 'free-shipping': shipping === 0 }">{{ shipping === 0 ? 'Gratis' : shipping.toFixed(2) + '€' }}</span></div>
            <div class="cs-row cs-row--total"><span>Total</span><strong>{{ orderTotal.toFixed(2) }}€</strong></div>
          </div>
        </div>
      </template>

      <!-- ── STEP 3: Payment ── -->
      <template v-if="step === 3">
        <div class="checkout-layout">
          <div class="payment-section">
            <div class="card-preview">
              <div class="card-preview__chip"></div>
              <div class="card-preview__number">{{ card.number || '•••• •••• •••• ••••' }}</div>
              <div class="card-preview__bottom">
                <div>
                  <small>Titular</small>
                  <span>{{ card.name || 'NOMBRE APELLIDO' }}</span>
                </div>
                <div>
                  <small>Caduca</small>
                  <span>{{ card.expiry || 'MM/AA' }}</span>
                </div>
              </div>
            </div>

            <form class="checkout-form" @submit.prevent="submitOrder">
              <div class="form-section">
                <h3>Datos de la tarjeta</h3>
                <p class="payment-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Simulación de pago — no se cargan datos reales
                </p>
                <div class="form-group">
                  <label>Número de tarjeta *</label>
                  <input
                    :value="card.number"
                    @input="formatCardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    inputmode="numeric"
                  />
                </div>
                <div class="form-group">
                  <label>Nombre del titular *</label>
                  <input v-model="card.name" placeholder="Como aparece en la tarjeta" />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Fecha de caducidad *</label>
                    <input
                      :value="card.expiry"
                      @input="formatExpiry"
                      placeholder="MM/AA"
                      maxlength="5"
                      inputmode="numeric"
                    />
                  </div>
                  <div class="form-group">
                    <label>CVV *</label>
                    <input v-model="card.cvv" type="password" placeholder="•••" maxlength="4" inputmode="numeric" />
                  </div>
                </div>
                <p v-if="cardError" class="error-msg">{{ cardError }}</p>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-outline" @click="step = 2">← Volver</button>
                <button type="submit" class="btn-primary" :disabled="paying">
                  <span v-if="paying" class="spinner"></span>
                  {{ paying ? 'Procesando...' : `Pagar ${orderTotal.toFixed(2)}€` }}
                </button>
              </div>
            </form>
          </div>
          <div class="checkout-summary">
            <h3>Tu pedido</h3>
            <div v-for="item in items" :key="item.id" class="summary-item">
              <img :src="item.image" :alt="item.name" />
              <div class="summary-item__info">
                <span>{{ item.name }}</span>
                <small>× {{ item.qty }}</small>
              </div>
              <span>{{ (item.price * item.qty).toFixed(2) }}€</span>
            </div>
            <div class="summary-divider"></div>
            <div class="cs-row"><span>Subtotal</span><span>{{ cartTotal.toFixed(2) }}€</span></div>
            <div class="cs-row"><span>Envío</span><span :class="{ 'free-shipping': shipping === 0 }">{{ shipping === 0 ? 'Gratis' : shipping.toFixed(2) + '€' }}</span></div>
            <div class="cs-row cs-row--total"><span>Total</span><strong>{{ orderTotal.toFixed(2) }}€</strong></div>
          </div>
        </div>
      </template>

      <!-- ── STEP 4: Confirmation ── -->
      <template v-if="step === 4">
        <div class="confirmation">
          <div class="confirmation__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
          </div>
          <h2>¡Pedido confirmado!</h2>
          <p>Gracias por tu compra. Recibirás un email de confirmación en breve.</p>
          <div v-if="confirmedOrder" class="confirmation__details">
            <div class="conf-row"><span>Pedido nº</span><strong>#{{ confirmedOrder.id }}</strong></div>
            <div class="conf-row"><span>Total pagado</span><strong>{{ Number(confirmedOrder.total).toFixed(2) }}€</strong></div>
            <div class="conf-row"><span>Tarjeta</span><strong>•••• {{ confirmedOrder.payment_last4 }}</strong></div>
            <div class="conf-row"><span>Estado</span><strong class="status-paid">Pagado</strong></div>
          </div>
          <div class="confirmation__actions">
            <RouterLink to="/tienda" class="btn-primary">Seguir comprando</RouterLink>
            <RouterLink to="/" class="btn-outline">Ir al inicio</RouterLink>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
.cart-page__hero {
  background: var(--color-primary);
  padding: 120px 0 48px;
  color: #fff;
}
.cart-page__hero .section-title { color: #fff; }
.cart-page__body { padding: 40px 24px 96px; }

/* Progress steps */
.progress-bar-wrap { background: var(--color-surface); border-bottom: 1px solid var(--color-border); padding: 20px 0; }
.progress-steps { display: flex; align-items: center; gap: 0; }
.progress-step { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 500; color: var(--color-text-muted); position: relative; }
.progress-step.active { color: var(--color-accent); }
.progress-step__dot {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.78rem; font-weight: 700;
  background: var(--color-bg);
  color: var(--color-text-muted);
  flex-shrink: 0;
}
.progress-step.active .progress-step__dot { border-color: var(--color-accent); background: var(--color-accent); color: #fff; }
.progress-step__line {
  width: 60px; height: 2px;
  background: var(--color-border);
  margin: 0 8px;
}
.progress-step__line.filled { background: var(--color-accent); }

/* Cart step */
.cart-empty {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 16px; padding: 80px 0;
}
.cart-empty h3 { font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-primary); }
.cart-empty p { color: var(--color-text-muted); }

.cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 40px; align-items: start; }
.cart-items { display: flex; flex-direction: column; gap: 16px; }
.cart-row {
  display: flex; align-items: center; gap: 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
}
.cart-row__img { width: 72px; height: 72px; object-fit: cover; border-radius: var(--radius); flex-shrink: 0; }
.cart-row__info { flex: 1; }
.cart-row__brand { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-muted); }
.cart-row__name { font-family: var(--font-serif); font-size: 0.95rem; font-weight: 600; color: var(--color-primary); margin: 4px 0; }
.cart-row__price-unit { font-size: 0.8rem; color: var(--color-text-muted); }
.cart-row__controls {
  display: flex; align-items: center; gap: 10px;
  background: var(--color-bg); border: 1px solid var(--color-border);
  border-radius: var(--radius); padding: 6px 12px;
}
.cart-row__controls button { background: none; border: none; font-size: 1rem; color: var(--color-text); width: 20px; line-height: 1; cursor: pointer; }
.cart-row__controls span { font-size: 0.9rem; font-weight: 600; min-width: 20px; text-align: center; }
.cart-row__subtotal { font-size: 1rem; font-weight: 700; color: var(--color-accent); min-width: 70px; text-align: right; }
.cart-row__remove {
  background: none; border: none; color: var(--color-text-muted);
  padding: 6px; border-radius: 6px;
  transition: color var(--transition), background var(--transition);
  cursor: pointer;
}
.cart-row__remove:hover { color: #c00; background: #fff0f0; }

/* Summary panel */
.cart-summary, .checkout-summary {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px;
  display: flex; flex-direction: column; gap: 14px;
  position: sticky; top: 90px;
}
.cart-summary h3, .checkout-summary h3 {
  font-family: var(--font-serif); font-size: 1.1rem; color: var(--color-primary);
  padding-bottom: 14px; border-bottom: 1px solid var(--color-border);
}
.cs-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--color-text); }
.cs-row--total { padding-top: 14px; border-top: 1px solid var(--color-border); font-size: 1rem; }
.cs-row--total strong { font-size: 1.2rem; color: var(--color-primary); }
.free-shipping { color: #3a8c4a; font-weight: 600; }
.shipping-note { font-size: 0.78rem; color: var(--color-text-muted); margin-top: -6px; }
.continue-shopping { text-align: center; font-size: 0.85rem; color: var(--color-text-muted); margin-top: 4px; }
.continue-shopping:hover { color: var(--color-accent); }

/* Checkout layout */
.checkout-layout { display: grid; grid-template-columns: 1fr 360px; gap: 40px; align-items: start; }
.checkout-form { display: flex; flex-direction: column; gap: 24px; }
.form-section { display: flex; flex-direction: column; gap: 16px; }
.form-section h3 { font-family: var(--font-serif); font-size: 1rem; color: var(--color-primary); padding-bottom: 12px; border-bottom: 1px solid var(--color-border); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.82rem; font-weight: 600; color: var(--color-text); }
.form-group input {
  padding: 10px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  transition: border-color var(--transition);
  outline: none;
}
.form-group input:focus { border-color: var(--color-accent); }
.form-actions { display: flex; justify-content: space-between; gap: 12px; padding-top: 8px; }
.btn-outline {
  padding: 10px 22px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  background: none;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition);
}
.btn-outline:hover { border-color: var(--color-accent); color: var(--color-accent); }

/* Summary items */
.summary-item { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; }
.summary-item img { width: 40px; height: 40px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
.summary-item__info { flex: 1; }
.summary-item__info span { display: block; font-weight: 500; color: var(--color-primary); line-height: 1.3; }
.summary-item__info small { color: var(--color-text-muted); }
.summary-divider { height: 1px; background: var(--color-border); margin: 4px 0; }

/* Card preview */
.payment-section { display: flex; flex-direction: column; gap: 28px; }
.card-preview {
  background: linear-gradient(135deg, #1a1a2e 0%, var(--color-primary) 100%);
  border-radius: 16px;
  padding: 28px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 160px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
.card-preview__chip {
  width: 36px; height: 28px;
  background: linear-gradient(135deg, #c8a96e, #e8c97a);
  border-radius: 6px;
}
.card-preview__number {
  font-size: 1.25rem;
  letter-spacing: 0.12em;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}
.card-preview__bottom { display: flex; justify-content: space-between; gap: 16px; }
.card-preview__bottom > div { display: flex; flex-direction: column; gap: 2px; }
.card-preview__bottom small { font-size: 0.65rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.1em; }
.card-preview__bottom span { font-size: 0.9rem; font-weight: 600; font-family: 'Courier New', monospace; }

.payment-note {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.8rem; color: var(--color-text-muted);
  background: var(--color-accent-light);
  padding: 8px 12px;
  border-radius: var(--radius);
}
.error-msg { color: #c00; font-size: 0.85rem; font-weight: 500; }

/* Spinner */
.spinner {
  display: inline-block;
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
  margin-right: 6px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Confirmation */
.confirmation {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 20px; padding: 60px 24px;
  max-width: 560px; margin: 0 auto;
}
.confirmation__icon {
  width: 80px; height: 80px;
  border-radius: 50%;
  background: #edf7ef;
  color: #3a8c4a;
  display: flex; align-items: center; justify-content: center;
}
.confirmation h2 { font-family: var(--font-serif); font-size: 2rem; color: var(--color-primary); }
.confirmation > p { color: var(--color-text-muted); font-size: 1rem; }
.confirmation__details {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  display: flex; flex-direction: column; gap: 12px;
}
.conf-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--color-text); }
.conf-row strong { color: var(--color-primary); }
.status-paid { color: #3a8c4a; }
.confirmation__actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

@media (max-width: 860px) {
  .cart-layout, .checkout-layout { grid-template-columns: 1fr; }
  .cart-summary, .checkout-summary { position: static; }
}
@media (max-width: 560px) {
  .cart-row { flex-wrap: wrap; }
  .cart-row__subtotal { order: 3; }
  .form-row { grid-template-columns: 1fr; }
  .progress-step__line { width: 30px; }
}
</style>
