# Documentation du système responsif

## 🎯 Système implémenté

J'ai créé un système responsif réutilisable qui adapte automatiquement les interfaces à 2 colonnes pour mobile et desktop.

## 📱 Comportement

### **Desktop (>= 768px)**
- **Notes** : Éditeur | Prévisualisation (côte à côte)
- **Snippets** : Liste | Prévisualisation (côte à côte)

### **Mobile (< 768px)**
- **Notes** : Onglets "Éditeur" / "Aperçu"
- **Snippets** : Onglets "Snippets" / "Aperçu"

## 🛠️ Composants créés

### 1. **useResponsiveView** - Hook principal
```typescript
const { isMobile, activeView, setActiveView } = useResponsiveView();
```
- Détecte automatiquement mobile/desktop
- Gère les changements de vue
- Retour auto à la vue principale sur desktop

### 2. **MobileTabs** - Onglets mobiles
```typescript
<MobileTabs
  activeTab={activeView}
  onTabChange={setActiveView}
  tabs={[
    { id: 'main', label: 'Éditeur', icon: '✏️' },
    { id: 'preview', label: 'Aperçu', icon: '👁️' }
  ]}
/>
```
- Masqué sur desktop
- Navigation tactile optimisée
- Icônes + labels

### 3. **ResponsiveLayout** - Layout adaptatif
```typescript
<ResponsiveLayout
  mainContent={<Editor />}
  previewContent={<Preview />}
  tabs={tabsConfig}
/>
```
- Gère automatiquement le layout
- 2 colonnes sur desktop
- Navigation par onglets sur mobile

## ✅ Modules adaptés

### **Notes** (/notes)
- ✅ Éditeur Markdown responsive
- ✅ Prévisualisation adaptative
- ✅ Barre d'outils conservée
- ✅ Navigation mobile fluide

### **Snippets** (/snippets)
- ✅ Liste des snippets responsive
- ✅ Prévisualisation adaptative
- ✅ Éditeur de code mobile
- ✅ Navigation par onglets

## 🚀 Avantages

1. **Zéro impact desktop** : Comportement identique
2. **Mobile optimisé** : Navigation naturelle
3. **Code réutilisable** : Système modulaire
4. **Maintenance facile** : Composants centralisés
5. **Évolutif** : Facile à étendre

## 📋 Test du système

### Desktop
1. Ouvrir `/notes` → Éditeur + Prévisualisation côte à côte
2. Ouvrir `/snippets` → Liste + Prévisualisation côte à côte

### Mobile (F12 → mode mobile)
1. Ouvrir `/notes` → Onglets "Éditeur" / "Aperçu"
2. Ouvrir `/snippets` → Onglets "Snippets" / "Aperçu"
3. Tester la navigation entre onglets

## 🎨 Personnalisation

### Changer les icônes
```typescript
tabs={[
  { id: 'main', label: 'Éditeur', icon: '📝' },
  { id: 'preview', label: 'Aperçu', icon: '🔍' }
]}
```

### Proportions colonnes
```typescript
<ResponsiveLayout
  gridCols="md:grid-cols-3" // 1:2 au lieu de 1:1
  // ...
/>
```

### Point de rupture
Modifier dans `useResponsiveView.ts` :
```typescript
const mobile = window.innerWidth < 1024; // Tablet = mobile
```

## 🔧 Maintenance

Le système est centralisé dans :
- `hooks/useResponsiveView.ts`
- `components/MobileTabs.tsx`
- `components/ResponsiveLayout.tsx`
- `utils/responsive.ts`

Une modification s'applique automatiquement à tous les modules utilisant le système.

## 📈 Prochaines étapes

1. **Tester** sur différents appareils
2. **Ajuster** les breakpoints si nécessaire
3. **Étendre** à d'autres modules
4. **Optimiser** les animations (optionnel)

Le système est maintenant prêt et les deux modules sont adaptés ! 🎉
