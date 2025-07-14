# Documents Légaux ETTU - README

## 🎯 Objectif

Ce module contient tous les documents légaux nécessaires pour la conformité RGPD et la protection des utilisateurs de l'application ETTU.

## 📁 Structure des Fichiers

```
src/
├── pages/
│   ├── LegalPage.tsx           # Page d'accueil des documents légaux
│   ├── CGUPage.tsx             # Conditions Générales d'Utilisation
│   ├── PrivacyPolicyPage.tsx   # Politique de Confidentialité
│   └── LegalNoticePage.tsx     # Mentions Légales
├── components/
│   └── Footer.tsx              # Pied de page avec liens légaux
├── config/
│   └── legal.ts                # Configuration centralisée
└── docs/
    ├── LEGAL_DOCUMENTATION.md  # Documentation technique
    ├── USER_LEGAL_GUIDE.md     # Guide utilisateur
    └── LEGAL_TESTS.md          # Tests et validation
```

## 🚀 Installation et Configuration

### 1. Dépendances
```bash
npm install lucide-react  # Pour les icônes
```

### 2. Configuration personnalisée
Éditez `src/config/legal.ts` pour personnaliser :
- Nom et email du responsable
- Informations d'hébergement
- URL du repository GitHub
- Autres détails spécifiques

### 3. Routes ajoutées
Les routes suivantes sont automatiquement disponibles :
- `/legal` - Page d'accueil légale
- `/cgu` - Conditions Générales d'Utilisation
- `/privacy-policy` - Politique de Confidentialité
- `/legal-notice` - Mentions Légales

## 🔧 Utilisation

### Accès utilisateur
- **Via le pied de page** : Liens disponibles sur toutes les pages
- **Navigation directe** : URLs directes pour chaque document
- **Page d'accueil** : Vue d'ensemble à `/legal`

### Intégration développeur
```typescript
// Import des composants
import LegalPage from './pages/LegalPage';
import CGUPage from './pages/CGUPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import LegalNoticePage from './pages/LegalNoticePage';

// Configuration centralisée
import { LEGAL_CONFIG } from './config/legal';
```

## 📱 Responsive Design

### Mobile (< 768px)
- Pied de page : liens empilés verticalement
- Texte : optimisé pour petits écrans
- Navigation : boutons tactiles appropriés

### Desktop (≥ 768px)
- Pied de page : liens horizontaux
- Mise en page : sections bien structurées
- Cartes : grille responsive

## 🛡️ Conformité RGPD

### Points couverts
- ✅ Transparence sur la collecte de données
- ✅ Droits utilisateur explicites
- ✅ Base légale du traitement
- ✅ Durée de conservation
- ✅ Contact pour exercer les droits
- ✅ Informations sur l'autorité de contrôle

### Spécificités ETTU
- Stockage local uniquement (localStorage)
- Aucune transmission vers des serveurs
- Pas de cookies de tracking
- Données sous contrôle utilisateur

## 🔄 Maintenance

### Mises à jour régulières
1. **Informations de contact** : Vérifier email et coordonnées
2. **Hébergement** : Adapter selon la plateforme choisie
3. **Dates** : Mettre à jour lors de modifications importantes
4. **Repository** : Ajouter le lien GitHub quand disponible

### Checklist de déploiement
- [ ] Informations personnalisées
- [ ] Dates à jour
- [ ] Tests fonctionnels réussis
- [ ] Responsive validé
- [ ] Accessibilité vérifiée

## 📞 Support

### Contact technique
- **Email** : julesbossis@gmail.com
- **Objet** : [ETTU] Documents légaux
- **Réponse** : Sous 48h

### Questions juridiques
- **Email** : julesbossis@gmail.com
- **Objet** : [ETTU] Question légale
- **Réponse** : Sous 72h

## 📚 Documentation

### Pour les développeurs
- `LEGAL_DOCUMENTATION.md` - Architecture et maintenance
- `LEGAL_TESTS.md` - Tests et validation
- `legal.ts` - Configuration centralisée

### Pour les utilisateurs
- `USER_LEGAL_GUIDE.md` - Guide d'utilisation
- Pages web - Documents légaux complets

## 🔍 Tests

### Commandes de test
```bash
# Lancer l'application
npm run dev

# Tester les pages
http://localhost:5175/legal
http://localhost:5175/cgu
http://localhost:5175/privacy-policy
http://localhost:5175/legal-notice

# Build de production
npm run build
npm run preview
```

### Tests recommandés
- Navigation entre pages
- Responsive design
- Contenu personnalisé
- Liens fonctionnels
- Performance

## 🎨 Styling

### Design System
- **Couleurs** : Gris (50/100/400/700/900) + Bleu (600/700/800)
- **Typographie** : Titres gras, texte lisible
- **Espacement** : Sections bien délimitées
- **Composants** : Cartes, boutons, liens cohérents

### Composants réutilisables
- Sections importantes : `bg-gray-50`
- Liens : `hover:text-blue-800 underline`
- Cartes : `bg-white rounded-lg shadow-sm`
- Boutons : `bg-blue-600 hover:bg-blue-700`

## 🚨 Alertes Importantes

### ⚠️ Avant production
1. Personnaliser toutes les informations dans `legal.ts`
2. Adapter les détails d'hébergement
3. Ajouter le lien GitHub repository
4. Tester sur différents appareils

### ⚠️ Maintenance continue
1. Mettre à jour les dates lors de modifications
2. Surveiller les changements légaux
3. Vérifier les liens externes
4. Maintenir la cohérence entre documents

## 📈 Améliorations futures

### Fonctionnalités possibles
- [ ] Versioning des documents
- [ ] Notifications de changements
- [ ] Recherche dans les documents
- [ ] Export PDF
- [ ] Mode sombre
- [ ] Traductions

### Optimisations techniques
- [ ] Tests automatisés
- [ ] Validation HTML/CSS
- [ ] Performance monitoring
- [ ] Accessibilité avancée
- [ ] SEO optimization

---

**Version** : 1.0  
**Dernière mise à jour** : {date}  
**Statut** : ✅ Prêt pour production (après personnalisation)

*Documentation complète disponible dans le dossier `/docs`*
