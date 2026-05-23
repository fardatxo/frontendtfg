<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { useCart } from '../composables/useCart'

const router = useRouter()
const { items, cartCount, cartTotal, addToCart: addItem, removeFromCart, updateQty } = useCart()

const products = ref([])
const loading = ref(true)
const loadError = ref('')
const categories = ['Todos', 'Cabello', 'Barba']
const activeCategory = ref('Todos')
const addedId = ref(null)

const fetchProducts = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const { data } = await api.get('/products')
    products.value = data
  } catch {
    loadError.value = 'No se pudieron cargar los productos. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

const filtered = computed(() => {
  if (activeCategory.value === 'Todos') return products.value
  return products.value.filter(p => p.category === activeCategory.value)
})

const addToCart = (product) => {
  addItem(product)
  addedId.value = product.id
  setTimeout(() => { addedId.value = null }, 1200)
}
</script>

<template>
  <div class="shop-page">
    <div class="shop-page__hero">
      <div class="container">
        <span class="section-tag">Tienda</span>
        <h1 class="section-title">Productos de barbería</h1>
        <p class="section-subtitle">Los mejores productos de las marcas más prestigiosas, disponibles para ti.</p>
      </div>
    </div>

    <div class="container shop-page__body">
      <!-- Filters -->
      <div class="shop-filters">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['filter-btn', { active: activeCategory === cat }]"
          @click="activeCategory = cat"
        >{{ cat }}</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-grid">
        <div v-for="n in 8" :key="n" class="skeleton-card"></div>
      </div>

      <!-- Load error -->
      <div v-else-if="loadError" class="load-error">
        <p>{{ loadError }}</p>
        <button class="btn-primary" @click="fetchProducts">Reintentar</button>
      </div>

      <div v-else class="shop-layout">
        <!-- Products -->
        <div class="products-grid">
          <div v-for="p in filtered" :key="p.id" class="product-card">
            <div class="product-card__img-wrap">
              <img :src="p.image" :alt="p.name" />
              <span class="product-card__category">{{ p.category }}</span>
            </div>
            <div class="product-card__body">
              <span class="product-card__brand">{{ p.brand }}</span>
              <h3 class="product-card__name">{{ p.name }}</h3>
              <div class="product-card__footer">
                <span class="product-card__price">{{ Number(p.price).toFixed(2) }}€</span>
                <button
                  :class="['btn-add', { added: addedId === p.id }]"
                  @click="addToCart(p)"
                >
                  <svg v-if="addedId !== p.id" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ addedId === p.id ? 'Añadido' : 'Añadir' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart sidebar -->
        <div v-if="items.length > 0" class="cart-sidebar">
          <h3 class="cart-sidebar__title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Carrito ({{ cartCount }})
          </h3>
          <div class="cart-items">
            <div v-for="item in items" :key="item.id" class="cart-item">
              <img :src="item.image" :alt="item.name" />
              <div class="cart-item__info">
                <span class="cart-item__name">{{ item.name }}</span>
                <div class="cart-item__controls">
                  <button @click="updateQty(item.id, -1)">−</button>
                  <span>{{ item.qty }}</span>
                  <button @click="updateQty(item.id, 1)">+</button>
                </div>
              </div>
              <span class="cart-item__total">{{ (item.price * item.qty).toFixed(2) }}€</span>
            </div>
          </div>
          <div class="cart-total">
            <span>Total</span>
            <strong>{{ cartTotal.toFixed(2) }}€</strong>
          </div>
          <button class="btn-primary" style="width:100%; justify-content:center" @click="router.push('/carrito')">Finalizar compra</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-page__hero {
  background: var(--color-primary);
  padding: 120px 0 48px;
  color: #fff;
}
.shop-page__hero .section-title { color: #fff; }
.shop-page__hero .section-subtitle { color: rgba(255,255,255,0.65); }
.shop-page__body { padding: 48px 24px 96px; }

.shop-filters { display: flex; gap: 10px; margin-bottom: 40px; flex-wrap: wrap; }
.filter-btn {
  padding: 8px 20px;
  border-radius: 100px;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: all var(--transition);
  cursor: pointer;
}
.filter-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
.filter-btn.active { background: var(--color-accent); border-color: var(--color-accent); color: #fff; }

.load-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 0;
  text-align: center;
  color: var(--color-text-muted);
}

/* Skeleton loader */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
.skeleton-card {
  border-radius: var(--radius-lg);
  background: linear-gradient(90deg, var(--color-border) 25%, var(--color-surface) 50%, var(--color-border) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  height: 300px;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.shop-layout { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: start; }

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
.product-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: box-shadow var(--transition), transform var(--transition);
}
.product-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
.product-card__img-wrap { position: relative; }
.product-card__img-wrap img { width: 100%; aspect-ratio: 1; object-fit: cover; }
.product-card__category {
  position: absolute;
  top: 10px; left: 10px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
  color: var(--color-accent);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 100px;
}
.product-card__body { padding: 18px; }
.product-card__brand { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-muted); }
.product-card__name {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 6px 0 14px;
  line-height: 1.3;
}
.product-card__footer { display: flex; align-items: center; justify-content: space-between; }
.product-card__price { font-size: 1.05rem; font-weight: 700; color: var(--color-accent); }
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border-radius: var(--radius);
  border: 1.5px solid var(--color-accent);
  background: transparent;
  color: var(--color-accent);
  font-size: 0.8rem;
  font-weight: 600;
  transition: all var(--transition);
  cursor: pointer;
}
.btn-add:hover, .btn-add.added { background: var(--color-accent); color: #fff; }

.cart-sidebar {
  width: 300px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  position: sticky;
  top: 90px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cart-sidebar__title { display: flex; align-items: center; gap: 8px; font-family: var(--font-serif); font-size: 1.05rem; color: var(--color-primary); }
.cart-items { display: flex; flex-direction: column; gap: 12px; }
.cart-item { display: flex; align-items: center; gap: 10px; }
.cart-item img { width: 44px; height: 44px; object-fit: cover; border-radius: 6px; }
.cart-item__info { flex: 1; }
.cart-item__name { font-size: 0.78rem; font-weight: 600; color: var(--color-primary); display: block; line-height: 1.3; }
.cart-item__controls { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
.cart-item__controls button {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-text);
  line-height: 1;
  cursor: pointer;
}
.cart-item__controls span { font-size: 0.82rem; font-weight: 600; min-width: 16px; text-align: center; }
.cart-item__total { font-size: 0.85rem; font-weight: 700; color: var(--color-accent); }
.cart-total { display: flex; justify-content: space-between; padding-top: 14px; border-top: 1px solid var(--color-border); font-size: 0.9rem; color: var(--color-text); }
.cart-total strong { font-size: 1.1rem; color: var(--color-primary); }

@media (max-width: 900px) {
  .shop-layout { grid-template-columns: 1fr; }
  .cart-sidebar { width: 100%; position: static; }
}
@media (max-width: 500px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
