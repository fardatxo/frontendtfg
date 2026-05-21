import { ref, computed } from 'vue'

const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))

const persist = () => localStorage.setItem('cart', JSON.stringify(items.value))

const addToCart = (product) => {
  const existing = items.value.find(i => i.id === product.id)
  if (existing) {
    existing.qty++
  } else {
    items.value.push({
      id: product.id,
      product_id: product.id,
      name: product.name,
      brand: product.brand,
      price: Number(product.price),
      image: product.image,
      qty: 1,
    })
  }
  persist()
}

const removeFromCart = (id) => {
  items.value = items.value.filter(i => i.id !== id)
  persist()
}

const updateQty = (id, delta) => {
  const item = items.value.find(i => i.id === id)
  if (!item) return
  item.qty += delta
  if (item.qty <= 0) removeFromCart(id)
  else persist()
}

const clearCart = () => {
  items.value = []
  localStorage.removeItem('cart')
}

const cartCount = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
const cartTotal = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))

export function useCart() {
  return { items, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart }
}
