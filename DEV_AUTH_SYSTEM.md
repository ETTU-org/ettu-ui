# 🛠️ Système d'Authentification de Développement - ETTU

## 🎯 Objectif

Séparer l'environnement de développement de l'environnement utilisateur avec un système d'authentification simple pour accéder aux outils de développement, tests et administration.

## 🚀 Utilisation

### Mode Utilisateur (Ports 5173, 5174, etc.)

```bash
# Démarrage normal
npm run dev

# Accessible sur http://localhost:5173
# Aucune authentification requise
# Accès aux fonctionnalités utilisateur uniquement
```

### Mode Développement (Port 5199)

```bash
# Démarrage sécurisé
npm run dev:secure

# Accessible sur http://localhost:5199
# Authentification requise : admin/admin
# Accès complet aux outils de développement
```

## 🔐 Authentification

### Identifiants de développement

- **Username:** `admin`
- **Password:** `admin`

### Fonctionnalités protégées

- Panel d'administration (`/admin`)
- Tests de sécurité (`/test`)
- Gestion du stockage (`/admin/storage`)
- Logs de sécurité
- Outils de debugging

## 🛡️ Sécurité

### Protection par port

- **Port 5199** : Mode développement avec authentification
- **Autres ports** : Mode utilisateur sans authentification

### Stockage de session

- Authentification stockée dans `localStorage`
- Session persistante jusqu'à déconnexion
- Nettoyage automatique lors du logout

## 🎨 Interface

### Panel d'Administration (`/admin`)

- **Dashboard** : Vue d'ensemble des systèmes
- **Sécurité** : Tests XSS, validation, configuration
- **Stockage** : Interface de test du stockage sécurisé
- **Logs** : Historique des événements de sécurité
- **Paramètres** : Configuration du mode développement

### Indicateurs visuels

- **Banner de développement** sur la page d'accueil
- **Liens spéciaux** dans la navigation (🛠️ Admin, 🧪 Test)
- **Indicateur de port** dans le header
- **Statuts colorés** pour les différents systèmes

## 📱 Responsive

- Interface optimisée pour desktop et mobile
- Navigation adaptative
- Tableaux responsifs dans les logs
- Design cohérent avec l'application principale

## 🔧 Architecture

### Composants principaux

#### `DevAuthContext`

- Gestion de l'état d'authentification
- Détection automatique du mode développement
- Persistance de session

#### `DevRouteGuard`

- Protection des routes en mode développement
- Redirection vers la page de login si nécessaire
- Affichage conditionnel du contenu

#### `DevOnlyRoute`

- Masquage des routes de développement en mode utilisateur
- Affichage conditionnel des liens de navigation

#### `DevLoginPage`

- Interface de connexion simple
- Validation des identifiants
- Feedback utilisateur

#### `AdminPanelPage`

- Interface centralisée pour tous les outils
- Onglets pour organiser les fonctionnalités
- Intégration des composants existants

## 🚀 Déploiement

### Développement

```bash
# Lancer le mode développement sécurisé
npm run dev:secure

# Ou directement sur le port 5199
npm run dev:admin
```

### Production

```bash
# Build normal - les routes de dev sont automatiquement masquées
npm run build

# Les routes /admin et /test ne sont pas accessibles en production
```

## 🔍 Monitoring

### Logs d'authentification

- Tentatives de connexion
- Sessions actives
- Déconnexions

### Métriques de sécurité

- Tests exécutés
- Vulnérabilités détectées
- Performances des validations

## 🛠️ Maintenance

### Mise à jour des identifiants

Modifier dans `DevAuthContext.tsx` :

```typescript
const login = (username: string, password: string): boolean => {
  if (username === "admin" && password === "admin") {
    // Changer ici pour de nouveaux identifiants
    setIsAuthenticated(true);
    return true;
  }
  return false;
};
```

### Ajout de nouvelles routes protégées

```typescript
// Dans App.tsx
<Route
  path="/nouvelle-route"
  element={
    <DevOnlyRoute>
      <NouveauComposant />
    </DevOnlyRoute>
  }
/>
```

### Personnalisation du port

Modifier dans `DevAuthContext.tsx` :

```typescript
const [devPort] = useState(5199); // Changer le port ici
```

## 🎯 Avantages

- **Séparation claire** entre dev et production
- **Sécurité** des outils de développement
- **Interface unifiée** pour tous les outils
- **Authentification simple** mais efficace
- **Intégration transparente** avec l'application existante
- **Responsive** et accessible
- **Extensible** pour de nouveaux outils

## 📝 TODO

- [ ] Intégrer d'autres outils de développement
- [ ] Ajouter des métriques de performance
- [ ] Créer des rapports automatiques
- [ ] Implémenter des alertes temps réel
- [ ] Ajouter un système de notifications
- [ ] Créer des snapshots de configuration
