<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const services = ref([
  { id: 1, name: 'Corte Degradado', price: 14, duration: 30, description: 'Degradado a máquina con definición y acabado profesional.' },
  { id: 2, name: 'Corte Clásico', price: 14, duration: 35, description: 'Tijera y máquina con un resultado limpio y elegante.' },
  { id: 3, name: 'Corte al Mismo Número', price: 10, duration: 20, description: 'Rapado total o parcial al mismo número en toda la cabeza.' },
  { id: 4, name: 'Corte Jubilado', price: 7, duration: 20, description: 'Corte especial para mayores, con atención personalizada.' },
  { id: 5, name: 'Corte Niños', price: 10, duration: 20, description: 'Para los más pequeños, con paciencia y mimo.' },
  { id: 6, name: 'Arreglo de Barba', price: 8, duration: 20, description: 'Perfilado y definición de barba con navaja y acabados.' },
  { id: 7, name: 'Barba Completa', price: 16, duration: 45, description: 'Tratamiento completo de barba con vaporizador y aceites.' },
  { id: 8, name: 'Corte + Barba', price: 22, duration: 55, description: 'Pack completo: corte a tu gusto y arreglo de barba.' },
])

const testimonials = ref([
  { name: 'Carlos M.', text: 'El mejor barbero de la zona. Siempre salgo encantado con el resultado.', rating: 5 },
  { name: 'Javi P.', text: 'Ambiente super agradable y precio justo. Lo recomiendo a todo el mundo.', rating: 5 },
  { name: 'Rubén A.', text: 'Profesional, rápido y con mucho detalle. Desde que descubrí Chic\'s no voy a ningún otro sitio.', rating: 5 },
])
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero__bg"></div>
      <div class="hero__overlay"></div>
      <div class="container hero__content">
        <div class="hero__badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          5,0 · 37 reseñas en Booksy
        </div>
        <h1 class="hero__title">Tu estilo,<br><em>nuestra obsesión</em></h1>
        <p class="hero__subtitle">
          Barbería premium en Montserrat, Valencia. Cortes precisos,
          barba perfecta y una experiencia que querrás repetir cada semana.
        </p>
        <div class="hero__ctas">
          <RouterLink to="/reservar" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Reservar cita
          </RouterLink>
          <RouterLink to="/tienda" class="btn-outline">Ver tienda</RouterLink>
        </div>
        <div class="hero__scroll">
          <span></span>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="services" id="servicios">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Servicios</span>
          <h2 class="section-title">Cuidado experto,<br>resultados memorables</h2>
          <p class="section-subtitle">
            Cada corte es una obra de arte. Elige el servicio que mejor se adapte a tu estilo
            y déjate llevar por manos expertas.
          </p>
        </div>
        <div class="services__grid">
          <div
            v-for="service in services"
            :key="service.id"
            class="service-card"
          >
            <div class="service-card__header">
              <h3>{{ service.name }}</h3>
              <span class="service-card__price">{{ service.price }}€</span>
            </div>
            <p class="service-card__desc">{{ service.description }}</p>
            <div class="service-card__footer">
              <span class="service-card__duration">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ service.duration }} min
              </span>
              <RouterLink to="/reservar" class="service-card__cta">
                Reservar <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Us -->
    <section class="features">
      <div class="container features__inner">
        <div class="features__text">
          <span class="section-tag">Por qué elegirnos</span>
          <h2 class="section-title">Más que una barbería,<br>una experiencia</h2>
          <p class="section-subtitle">
            En Chic's nos tomamos muy en serio tu imagen. Combinamos técnica tradicional
            con tendencias actuales para que salgas siempre impecable.
          </p>
          <ul class="features__list">
            <li v-for="feat in [
              'Barberos con más de 10 años de experiencia',
              'Productos de alta gama para el cuidado del cabello',
              'Ambiente tranquilo y atención personalizada',
              'Citas online sin esperas innecesarias',
            ]" :key="feat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ feat }}
            </li>
          </ul>
          <RouterLink to="/reservar" class="btn-primary" style="margin-top:28px">Reservar ahora</RouterLink>
        </div>
        <div class="features__image">
          <div class="features__img-wrap">
            <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80" alt="Barbería interior" />
            <div class="features__badge">
              <span class="features__badge-number">+500</span>
              <span class="features__badge-label">clientes<br>satisfechos</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials">
      <div class="container">
        <div class="section-header" style="margin-bottom:48px">
          <span class="section-tag">Opiniones</span>
          <h2 class="section-title">Lo que dicen nuestros clientes</h2>
        </div>
        <div class="testimonials__grid">
          <div v-for="t in testimonials" :key="t.name" class="testimonial-card">
            <div class="testimonial-card__stars">
              <svg v-for="i in t.rating" :key="i" width="15" height="15" viewBox="0 0 24 24" fill="#c9a96e">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p class="testimonial-card__text">"{{ t.text }}"</p>
            <span class="testimonial-card__name">— {{ t.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact / Hours -->
    <section class="contact-section" id="contacto">
      <div class="container contact-section__inner">
        <div class="contact-section__info">
          <span class="section-tag">Encuéntranos</span>
          <h2 class="section-title">Un rincón de calma<br>en Montserrat</h2>
          <div class="contact-details">
            <div class="contact-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div>
                <p>Av. Jaume I, 17</p>
                <p>46192 Montserrat, Valencia</p>
              </div>
            </div>
            <div class="contact-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 9.79 19.79 19.79 0 01.08 1.18 2 2 0 012 .11h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
              <a href="tel:607461357">607 46 13 57</a>
            </div>
          </div>
          <a href="https://maps.google.com/?q=Av.+Jaume+I,+17,+46192+Montserrat+Valencia" target="_blank" rel="noopener" class="btn-dark" style="margin-top:24px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Cómo llegar
          </a>
        </div>
        <div class="contact-section__hours">
          <h3>Horario de apertura</h3>
          <table class="hours-table">
            <tbody>
              <tr v-for="row in [
                { day: 'Lunes', hours: '9:00 – 20:00' },
                { day: 'Martes', hours: '9:00 – 20:00' },
                { day: 'Miércoles', hours: '9:00 – 20:00' },
                { day: 'Jueves', hours: '9:00 – 20:00' },
                { day: 'Viernes', hours: '9:00 – 20:00' },
                { day: 'Sábado', hours: '9:00 – 14:00' },
                { day: 'Domingo', hours: 'Cerrado', closed: true },
              ]" :key="row.day">
                <td>{{ row.day }}</td>
                <td :class="{ closed: row.closed }">{{ row.hours }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="cta-banner">
      <div class="container cta-banner__inner">
        <div>
          <h2>¿Listo para tu próxima visita?</h2>
          <p>Reserva en menos de 2 minutos. Sin esperas, sin complicaciones.</p>
        </div>
        <RouterLink to="/reservar" class="btn-primary btn-primary--large">
          Reservar mi cita
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ─── Hero ─── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
.hero__bg {
  position: absolute;
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1800&q=85');
  background-size: cover;
  background-position: center 30%;
  z-index: 0;
}
.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(15, 10, 5, 0.72) 0%,
    rgba(20, 14, 8, 0.55) 60%,
    rgba(30, 20, 10, 0.38) 100%
  );
  z-index: 1;
}
.hero__content {
  position: relative;
  z-index: 2;
  padding-top: 100px;
  padding-bottom: 80px;
  max-width: 680px;
}
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(201, 169, 110, 0.15);
  border: 1px solid rgba(201, 169, 110, 0.35);
  color: #e8c97a;
  padding: 7px 14px;
  border-radius: 100px;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  margin-bottom: 24px;
}
.hero__title {
  font-family: var(--font-serif);
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}
.hero__title em {
  font-style: italic;
  color: #e8c97a;
}
.hero__subtitle {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.78);
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 480px;
}
.hero__ctas { display: flex; gap: 14px; flex-wrap: wrap; }
.hero__scroll {
  margin-top: 64px;
  display: flex;
  justify-content: flex-start;
}
.hero__scroll span {
  display: block;
  width: 1px;
  height: 56px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent);
  animation: scrollPulse 1.8s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.6; transform: scaleY(1); }
  50% { opacity: 1; transform: scaleY(1.1); }
}

/* ─── Services ─── */
.services { padding: 96px 0; }
.section-header { text-align: center; margin-bottom: 56px; }
.section-header .section-subtitle { max-width: 540px; margin: 0 auto; }
.services__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 20px;
}
.service-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow var(--transition), transform var(--transition), border-color var(--transition);
}
.service-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
  border-color: var(--color-accent);
}
.service-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.service-card__header h3 {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.3;
}
.service-card__price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-accent);
  white-space: nowrap;
}
.service-card__desc {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  flex: 1;
}
.service-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.service-card__duration {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}
.service-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-accent);
  transition: gap var(--transition);
}
.service-card__cta:hover { gap: 8px; }

/* ─── Features ─── */
.features { padding: 96px 0; background: var(--color-surface); }
.features__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.features__text { max-width: 520px; }
.features__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}
.features__list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--color-text);
}
.features__list li svg { color: var(--color-accent); flex-shrink: 0; margin-top: 2px; }
.features__image { position: relative; }
.features__img-wrap { position: relative; border-radius: var(--radius-lg); overflow: visible; }
.features__img-wrap img { border-radius: var(--radius-lg); width: 100%; object-fit: cover; aspect-ratio: 4/5; }
.features__badge {
  position: absolute;
  bottom: -20px;
  left: -20px;
  background: var(--color-accent);
  color: #fff;
  padding: 18px 22px;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: var(--shadow-lg);
}
.features__badge-number {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}
.features__badge-label { font-size: 0.75rem; opacity: 0.85; margin-top: 4px; line-height: 1.3; }

/* ─── Testimonials ─── */
.testimonials { padding: 96px 0; }
.testimonials__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.testimonial-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
}
.testimonial-card__stars { display: flex; gap: 3px; margin-bottom: 14px; }
.testimonial-card__text {
  font-size: 0.925rem;
  line-height: 1.7;
  color: var(--color-text);
  font-style: italic;
  margin-bottom: 16px;
}
.testimonial-card__name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.03em;
}

/* ─── Contact ─── */
.contact-section { padding: 96px 0; background: var(--color-surface); }
.contact-section__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}
.contact-details { display: flex; flex-direction: column; gap: 18px; margin-top: 28px; }
.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.contact-item svg { color: var(--color-accent); flex-shrink: 0; margin-top: 2px; }
.contact-item a { color: var(--color-accent); font-weight: 500; }
.contact-item a:hover { text-decoration: underline; }
.contact-section__hours h3 {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 24px;
}
.hours-table { width: 100%; border-collapse: collapse; }
.hours-table td {
  padding: 10px 0;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}
.hours-table td:last-child { text-align: right; color: var(--color-text-muted); }
.hours-table td.closed { color: #ccc; }

/* ─── CTA Banner ─── */
.cta-banner { padding: 80px 0; background: var(--color-primary); }
.cta-banner__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}
.cta-banner__inner h2 {
  font-family: var(--font-serif);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}
.cta-banner__inner p { color: rgba(255,255,255,0.6); font-size: 0.95rem; }
.btn-primary--large { padding: 16px 36px; font-size: 1rem; white-space: nowrap; }

/* ─── Responsive ─── */
@media (max-width: 960px) {
  .features__inner,
  .contact-section__inner { grid-template-columns: 1fr; gap: 48px; }
  .features__image { order: -1; }
  .features__img-wrap img { aspect-ratio: 16/9; }
  .features__badge { bottom: -16px; left: 16px; }
  .testimonials__grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .services { padding: 64px 0; }
  .testimonials { padding: 64px 0; }
  .contact-section { padding: 64px 0; }
  .testimonials__grid { grid-template-columns: 1fr; }
  .hero__title { font-size: 2.6rem; }
  .cta-banner__inner { flex-direction: column; text-align: center; }
}
</style>
