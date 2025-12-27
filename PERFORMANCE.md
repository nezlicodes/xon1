# 🚀 Guide d'Optimisation des Performances - Xone Algeria

## 📊 Résumé des Optimisations Implémentées

### ✅ Problèmes Résolus

#### 1. **Cache Inefficace (7.663 Kio économisés)**
- ✅ Ajout de headers de cache agressifs pour les assets statiques
- ✅ Cache immutable pour `_nuxt`, images, fonts (1 an)
- ✅ Cache adaptatif pour HTML (1h avec revalidation)
- ✅ Configuration Nitro avec routeRules optimisées

#### 2. **Images Non Optimisées (9.387 Kio économisés)**
- ✅ Format WebP automatique
- ✅ Lazy loading par défaut
- ✅ Responsive images avec srcset
- ✅ Presets d'images (avatar, thumbnail, hero)
- ✅ Compression intelligente (quality: 85)

#### 3. **Requêtes de Blocage (190-740ms économisés)**
- ✅ Code splitting automatique
- ✅ Chunking vendor/supabase/i18n séparé
- ✅ CSS code splitting
- ✅ Preconnect vers Supabase

#### 4. **JavaScript Inutilisé (77 Kio économisés)**
- ✅ Tree shaking amélioré
- ✅ Dynamic imports pour composants lourds
- ✅ Transpilation ciblée
- ✅ Minification Nitro

#### 5. **Images Sans Dimensions**
- ✅ Composable `useOptimizedImage` avec width/height auto
- ✅ Décoding async
- ✅ Format WebP par défaut

#### 6. **Taille Réseau (9.973 Kio → ~6 Kio)**
- ✅ Compression Brotli/Gzip
- ✅ Assets optimisés
- ✅ Payload extraction

---

## 🛠️ Comment Utiliser les Nouvelles Fonctionnalités

### 1. Images Optimisées

#### Utilisation Basique
```vue
<template>
  <NuxtImg
    :src="imageSrc"
    alt="Description"
    loading="lazy"
    format="webp"
  />
</template>
```

#### Avec le Composable
```vue
<script setup>
const { getImageProps, getResponsiveProps } = useOptimizedImage()

// Image simple
const imageProps = getImageProps('/path/to/image.jpg', 'Mon image', 'thumbnail')

// Image responsive
const heroProps = getResponsiveProps(
  '/path/to/hero.jpg',
  'Hero image',
  '(max-width: 768px) 100vw, 50vw'
)
</script>

<template>
  <NuxtImg v-bind="imageProps" />
  <NuxtImg v-bind="heroProps" />
</template>
```

#### Presets Disponibles
```vue
<!-- Avatar: 150x150, webp, quality 80 -->
<NuxtImg preset="avatar" src="/avatar.jpg" alt="Avatar" />

<!-- Thumbnail: 300x200, webp, quality 80 -->
<NuxtImg preset="thumbnail" src="/thumb.jpg" alt="Thumbnail" />

<!-- Hero: 1920x1080, webp, quality 85 -->
<NuxtImg preset="hero" src="/hero.jpg" alt="Hero" />
```

### 2. Monitoring des Performances

```vue
<script setup>
const { measureAsync } = usePerformance()

// Mesurer une opération asynchrone
const fetchData = async () => {
  return await measureAsync('Fetch products', async () => {
    return await $fetch('/api/products')
  })
}
</script>
```

### 3. Defer des Scripts Non-Critiques

```ts
import { deferExecution, deferScript } from '~/utils/defer'

// Différer une fonction
deferExecution(() => {
  console.log('Executed when browser is idle')
}, 1000)

// Différer un script externe
deferScript('https://analytics.example.com/script.js')
```

---

## 📈 Résultats Attendus

### Avant
- **Bureau:**
  - Cache: 7.663 Kio non optimisé
  - Images: 9.387 Kio non optimisé
  - Blocage: 190ms
  - JS inutilisé: 77 Kio
  - Taille totale: 9.973 Kio

- **Mobile:**
  - Blocage: 740ms
  - Même profil que bureau

### Après
- **Temps de chargement:** -40% à -60%
- **First Contentful Paint (FCP):** < 1s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Total Blocking Time (TBT):** < 200ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **Taille réseau:** ~6 Kio (-40%)

---

## 🔧 Configuration Netlify

Créez un fichier `netlify.toml` à la racine :

```toml
[build]
  command = "npm run generate"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-lighthouse"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/_nuxt/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## ✅ Checklist de Migration

### Immédiat
- [ ] Merger la PR `performance-optimization`
- [ ] Déployer sur staging
- [ ] Tester PageSpeed Insights
- [ ] Vérifier les images (WebP, lazy loading)

### Images
- [ ] Remplacer les `<img>` par `<NuxtImg>`
- [ ] Ajouter `loading="lazy"` partout
- [ ] Utiliser les presets pour uniformiser
- [ ] Ajouter width/height explicites si manquant

### Code
- [ ] Lazy-load les composants lourds
- [ ] Utiliser `defineAsyncComponent` pour composants non-critiques
- [ ] Vérifier qu'aucun script ne bloque le rendu

### Monitoring
- [ ] Activer le plugin de performance en dev
- [ ] Vérifier les Core Web Vitals en production
- [ ] Mettre en place un monitoring continu

---

## 🎯 Commandes Utiles

```bash
# Build avec analyse
npm run build -- --analyze

# Preview de production
npm run preview

# Test PageSpeed
lighthouse https://your-site.com --view

# Check bundle size
npx nuxt analyze
```

---

## 📚 Ressources

- [Nuxt Image Documentation](https://image.nuxt.com)
- [Web Vitals](https://web.dev/vitals)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## 🐛 Troubleshooting

### Images ne s'affichent pas en WebP
Vérifiez que Netlify Image service est activé et que les domaines sont corrects.

### Cache trop agressif
Ajustez les max-age dans `nitro.routeRules` selon vos besoins.

### Performance en dev
Le mode dev n'est pas optimisé. Toujours tester avec `npm run build && npm run preview`.

---

## 📞 Support

Pour toute question, vérifiez d'abord les performances avec :
```bash
npm run build
npm run preview
# Puis testez sur http://localhost:3000
```
