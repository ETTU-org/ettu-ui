# Tests des Documents Légaux ETTU

## 🧪 Checklist de Test

### ✅ Tests fonctionnels

#### Navigation depuis le pied de page
- [ ] Lien "Conditions Générales d'Utilisation" → `/cgu`
- [ ] Lien "Politique de Confidentialité" → `/privacy-policy`
- [ ] Lien "Mentions Légales" → `/legal-notice`
- [ ] Tous les liens fonctionnent sur mobile et desktop

#### Navigation directe par URL
- [ ] `http://localhost:5175/legal` → Page d'accueil légale
- [ ] `http://localhost:5175/cgu` → CGU
- [ ] `http://localhost:5175/privacy-policy` → Politique de confidentialité
- [ ] `http://localhost:5175/legal-notice` → Mentions légales

#### Page d'accueil légale (`/legal`)
- [ ] Affichage des 3 cartes de documents
- [ ] Icônes visibles et correctes
- [ ] Liens fonctionnels vers chaque document
- [ ] Section RGPD informative
- [ ] Bouton "Nous contacter" fonctionnel

### ✅ Tests de contenu

#### Vérification des informations personnalisées
- [ ] Nom : "BOSSIS--GUYON Jules"
- [ ] Email : "julesbossis@gmail.com"
- [ ] Date automatique : Format français (JJ/MM/AAAA)
- [ ] Informations cohérentes entre tous les documents

#### Vérification RGPD
- [ ] Droits utilisateur listés complètement
- [ ] Base légale du traitement expliquée
- [ ] Contact pour exercer les droits
- [ ] Informations CNIL présentes
- [ ] Durée de conservation définie

### ✅ Tests responsive

#### Mobile (< 768px)
- [ ] Pied de page : liens empilés verticalement
- [ ] Documents : texte lisible et bien espacé
- [ ] Navigation : boutons/liens facilement cliquables
- [ ] Cartes : s'empilent correctement

#### Desktop (> 768px)
- [ ] Pied de page : liens en ligne horizontale
- [ ] Documents : mise en page claire et aérée
- [ ] Cartes : grille de 3 colonnes
- [ ] Espacement optimal

### ✅ Tests d'accessibilité

#### Contraste et lisibilité
- [ ] Texte noir sur fond blanc/gris clair
- [ ] Liens bleus avec bon contraste
- [ ] Titres bien hiérarchisés (h1, h2, h3)
- [ ] Espacement suffisant entre les éléments

#### Navigation clavier
- [ ] Tous les liens accessibles au clavier
- [ ] Focus visible sur les éléments interactifs
- [ ] Ordre de tabulation logique

### ✅ Tests de performance

#### Temps de chargement
- [ ] Pages légales se chargent rapidement (< 2s)
- [ ] Pas de ressources externes bloquantes
- [ ] Icônes lucide-react chargées correctement

#### Optimisations
- [ ] Images optimisées (si présentes)
- [ ] CSS minifié en production
- [ ] Pas de JavaScript inutile

## 🔧 Commandes de Test

### Lancer les tests manuels
```bash
# Démarrer le serveur de développement
npm run dev

# Accéder aux pages de test
http://localhost:5175/legal
http://localhost:5175/cgu
http://localhost:5175/privacy-policy
http://localhost:5175/legal-notice
```

### Tester la build de production
```bash
# Créer la build
npm run build

# Prévisualiser la build
npm run preview
```

### Tester sur différents appareils
```bash
# Exposer sur le réseau local
npm run dev -- --host

# Puis tester sur mobile/tablette via l'IP locale
```

## 🐛 Problèmes Connus et Solutions

### Import lucide-react
**Problème** : Erreur `Cannot find module 'lucide-react'`
**Solution** : Vérifier l'installation avec `npm install lucide-react`

### Liens de navigation
**Problème** : Liens 404 ou page blanche
**Solution** : Vérifier les routes dans `App.tsx` et les imports des pages

### Responsive Footer
**Problème** : Liens mal alignés sur mobile
**Solution** : Vérifier les classes Tailwind `flex-col sm:flex-row`

### Erreurs TypeScript
**Problème** : Erreurs de compilation
**Solution** : Vérifier les imports et les types dans les composants

## 📊 Résultats des Tests

### ✅ Tests réussis
- Navigation fonctionnelle
- Contenu complet et personnalisé
- Responsive design
- Performance acceptable
- Accessibilité de base

### ⚠️ Améliorations possibles
- [ ] Tests automatisés avec Jest/Vitest
- [ ] Tests e2e avec Cypress/Playwright
- [ ] Validation HTML/CSS
- [ ] Tests d'accessibilité automatisés (axe-core)
- [ ] Tests de performance (Lighthouse)

### 🔄 Tests à répéter
- Après chaque modification des documents
- Avant chaque déploiement
- Après mise à jour des dépendances
- Lors de changements de contenu

## 📝 Rapport de Test

**Date** : {date}
**Version** : 1.0
**Testeur** : [Nom du testeur]
**Environnement** : [Navigateur, OS, Résolution]

### Résumé
- **Pages testées** : 4/4
- **Tests fonctionnels** : ✅ Réussis
- **Tests responsive** : ✅ Réussis
- **Tests contenu** : ✅ Réussis
- **Tests accessibilité** : ✅ Réussis basiques

### Recommandations
1. Mettre à jour les informations d'hébergement avant production
2. Ajouter le lien GitHub quand disponible
3. Considérer l'ajout d'un système de versioning des documents
4. Implémenter des tests automatisés pour la régression

---

*Tests réalisés le {date} pour ETTU v1.0*
