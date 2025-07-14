# Documentation des Documents Légaux ETTU

## 📋 Vue d'ensemble

Cette documentation explique l'implémentation et la maintenance des documents légaux pour l'application ETTU, conformément au RGPD et au droit français.

## 🏗️ Architecture des Documents

### Pages créées

1. **`/src/pages/LegalPage.tsx`** - Page d'accueil des documents légaux
2. **`/src/pages/CGUPage.tsx`** - Conditions Générales d'Utilisation
3. **`/src/pages/PrivacyPolicyPage.tsx`** - Politique de Confidentialité
4. **`/src/pages/LegalNoticePage.tsx`** - Mentions Légales

### Routes configurées

```typescript
/legal             -> Page d'accueil des documents légaux
/cgu              -> Conditions Générales d'Utilisation
/privacy-policy   -> Politique de Confidentialité
/legal-notice     -> Mentions Légales
```

## 🔗 Intégration dans l'Application

### Pied de page mis à jour

Le composant `Footer.tsx` a été enrichi avec :
- Liens vers toutes les pages légales
- Layout responsive (mobile/desktop)
- Transitions et animations
- Séparateur visuel entre les liens légaux et les infos générales

### Navigation

Les pages légales sont accessibles via :
- Le pied de page (sur toutes les pages)
- La page d'accueil légale (`/legal`)
- Navigation directe par URL

## 📝 Contenu des Documents

### Conditions Générales d'Utilisation (CGU)
- **Objet** : Règles d'utilisation de l'application
- **Contenu** : Acceptation, services, obligations, propriété intellectuelle
- **Conformité** : Droit français, RGPD
- **Personnalisation** : Adaptée à ETTU (stockage local, open source)

### Politique de Confidentialité
- **Objet** : Traitement des données personnelles
- **Contenu** : Collecte, utilisation, droits utilisateur, sécurité
- **Conformité** : RGPD complet
- **Spécificités** : Stockage local uniquement, pas de serveurs externes

### Mentions Légales
- **Objet** : Informations légales sur l'éditeur
- **Contenu** : Responsable, hébergement, propriété intellectuelle
- **Conformité** : Obligations légales françaises
- **Adaptabilité** : Modifiable selon l'hébergeur choisi

## 🔧 Maintenance et Mise à Jour

### Informations à personnaliser

1. **Coordonnées du responsable** (dans tous les documents) :
   ```typescript
   Nom : BOSSIS--GUYON Jules
   Email : julesbossis@gmail.com
   ```

2. **Hébergement** (dans LegalNoticePage.tsx) :
   ```typescript
   // À modifier selon la plateforme choisie
   Plateforme : GitHub Pages / Netlify / Vercel
   ```

3. **Repository GitHub** (dans LegalNoticePage.tsx) :
   ```typescript
   // À compléter quand disponible
   Repository : GitHub (lien à définir)
   ```

### Dates de mise à jour

Les documents affichent automatiquement la date du jour :
```typescript
new Date().toLocaleDateString('fr-FR')
```

⚠️ **Important** : Mettre à jour manuellement les dates lors de modifications importantes.

## 🎨 Styling et Responsive

### Design cohérent
- Couleurs : Gris 50/100/400/700/900 + accents bleus
- Typographie : Titres en gras, texte lisible
- Espacement : Sections bien délimitées
- Responsive : Mobile-first, s'adapte aux écrans

### Composants réutilisables
- Sections avec `bg-gray-50` pour les informations importantes
- Liens avec `hover:text-blue-800` et `underline`
- Cartes avec `bg-white rounded-lg shadow-sm`

## 🚀 Déploiement

### Checklist avant déploiement

- [ ] Vérifier les coordonnées de contact
- [ ] Adapter les informations d'hébergement
- [ ] Tester tous les liens (internes et externes)
- [ ] Vérifier la responsiveness sur mobile
- [ ] Valider l'accessibilité (contraste, navigation clavier)

### Tests recommandés

1. **Navigation** : Tous les liens fonctionnent
2. **Responsive** : Affichage correct sur mobile/tablet/desktop
3. **Contenu** : Informations personnalisées et à jour
4. **Performance** : Temps de chargement acceptable

## 📱 Expérience Mobile

### Optimisations implémentées
- Footer responsive avec liens empilés sur mobile
- Texte adapté aux petits écrans
- Espacement optimisé pour le touch
- Navigation facile entre les documents

### Améliorations futures possibles
- Modal pour les documents légaux
- Version résumée pour mobile
- Recherche dans les documents
- Mode sombre

## 🔒 Conformité RGPD

### Points clés respectés
- ✅ Transparence sur la collecte de données
- ✅ Base légale claire pour le traitement
- ✅ Droits utilisateur explicites
- ✅ Durée de conservation définie
- ✅ Contact pour exercer les droits
- ✅ Informations sur l'autorité de contrôle

### Spécificités ETTU
- Stockage local uniquement (localStorage)
- Pas de cookies de tracking
- Pas de services tiers
- Données sous contrôle utilisateur

## 🛠️ Commandes de Développement

### Lancer l'application
```bash
npm run dev
```

### Tester les pages légales
```bash
# Accéder aux pages
http://localhost:5173/legal
http://localhost:5173/cgu
http://localhost:5173/privacy-policy
http://localhost:5173/legal-notice
```

### Build pour production
```bash
npm run build
```

## 📞 Support et Contact

Pour toute question sur l'implémentation ou la maintenance :
- **Email** : julesbossis@gmail.com
- **Objet** : [ETTU] Documents légaux
- **Délai** : Réponse sous 48h

---

*Documentation générée le {date} pour ETTU v1.0*
