# 📄 Documentation Légale Complète - ETTU

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
- **Contenu** : Collecte, utilisation, stockage, droits RGPD
- **Particularités** : Stockage local uniquement, aucune transmission
- **Droits** : Accès, rectification, suppression, portabilité

### Mentions Légales

- **Objet** : Informations sur l'éditeur et l'hébergement
- **Contenu** : Éditeur, hébergeur, propriété intellectuelle
- **Conformité** : Loi française sur la confiance dans l'économie numérique

## 🚀 Installation et Configuration

### 1. Dépendances

```bash
npm install lucide-react  # Pour les icônes
```

### 2. Configuration personnalisée

Éditez `src/config/legal.ts` pour personnaliser :

```typescript
export const legalConfig = {
  editor: {
    name: "Jules BOSSIS--GUYON",
    email: "julesbossis@gmail.com",
    address: "France",
  },
  hosting: {
    provider: "GitHub Pages",
    address: "GitHub, Inc.",
  },
  app: {
    name: "ETTU",
    version: "1.0.0",
    repository: "https://github.com/julesbossis/ettu-ui",
  },
};
```

### 3. Routes ajoutées

Les routes suivantes sont automatiquement disponibles :

- `/legal` - Page d'accueil légale
- `/cgu` - Conditions Générales d'Utilisation
- `/privacy-policy` - Politique de Confidentialité
- `/legal-notice` - Mentions Légales

## 🔧 Utilisation

### Accès utilisateur

- **Via le pied de page** : Liens disponibles sur toutes les pages
- **Via la page d'accueil** : Section dédiée aux informations légales
- **Navigation directe** : URLs accessibles directement

### Mise à jour des documents

1. Modifier le contenu dans les fichiers de pages
2. Mettre à jour `src/config/legal.ts` si nécessaire
3. Tester l'affichage et la navigation
4. Vérifier la conformité RGPD

## 📚 Guide Utilisateur

### Pourquoi ces documents ?

L'application ETTU respecte les droits et la vie privée des utilisateurs. Ces documents légaux expliquent clairement comment nous gérons les données et quelles sont les obligations et droits de chacun.

### Les Documents Disponibles

#### 1. Conditions Générales d'Utilisation (CGU)

**🔗 Accès** : `/cgu`

**📖 Contenu :**

- Les règles d'utilisation de l'application
- Vos droits et obligations
- Les services fournis
- Les limitations de responsabilité

**👤 Public :** Tous les utilisateurs de l'application

#### 2. Politique de Confidentialité

**🔗 Accès** : `/privacy-policy`

**📖 Contenu :**

- Comment vos données sont collectées
- Où sont stockées vos données (localement !)
- Vos droits sur vos données personnelles
- Comment exercer ces droits

**👤 Public :** Tous les utilisateurs soucieux de leur vie privée

#### 3. Mentions Légales

**🔗 Accès** : `/legal-notice`

**📖 Contenu :**

- Informations sur l'éditeur de l'application
- Détails sur l'hébergement
- Propriété intellectuelle
- Informations techniques

**👤 Public :** Utilisateurs professionnels et personnes intéressées par les aspects techniques

## 🛡️ Droits des Utilisateurs (RGPD)

### Droits fondamentaux

- **Droit d'accès** : Consulter vos données
- **Droit de rectification** : Corriger vos données
- **Droit à l'effacement** : Supprimer vos données
- **Droit à la portabilité** : Exporter vos données
- **Droit d'opposition** : Refuser certains traitements

### Comment exercer vos droits

1. **Accès direct** : Gérez vos données dans l'application
2. **Suppression** : Effacez vos données localement
3. **Export** : Utilisez les fonctions d'exportation
4. **Contact** : julesbossis@gmail.com pour toute question

## 🧪 Tests et Validation

### Tests fonctionnels

- ✅ Affichage correct sur desktop et mobile
- ✅ Navigation entre les pages
- ✅ Liens actifs dans le pied de page
- ✅ Responsive design

### Tests de contenu

- ✅ Conformité RGPD
- ✅ Exactitude des informations
- ✅ Lisibilité et clarté
- ✅ Mise à jour des dates

### Tests techniques

- ✅ Performance des pages
- ✅ SEO et accessibilité
- ✅ Compatibilité navigateurs
- ✅ Validation HTML/CSS

## 📊 Conformité RGPD

### Points de conformité

- [x] **Transparence** : Informations claires sur le traitement
- [x] **Licéité** : Base légale pour chaque traitement
- [x] **Minimisation** : Collecte uniquement des données nécessaires
- [x] **Exactitude** : Données exactes et à jour
- [x] **Limitation** : Conservation limitée dans le temps
- [x] **Sécurité** : Mesures de sécurité appropriées
- [x] **Responsabilité** : Démonstration de la conformité

### Particularités d'ETTU

- **Stockage local uniquement** : Pas de transmission de données
- **Contrôle utilisateur** : Utilisateur maître de ses données
- **Pas de profilage** : Aucun traitement automatisé
- **Open source** : Transparence complète du code

## 🔄 Maintenance

### Mise à jour régulière

- Révision annuelle des documents
- Adaptation aux évolutions légales
- Mise à jour des informations de contact
- Vérification de la conformité

### Suivi des modifications

- Versioning des documents
- Changelog des modifications
- Notification des utilisateurs si nécessaire
- Archivage des versions précédentes

## 📞 Support

**Contact :** julesbossis@gmail.com  
**Sujet :** Questions légales ETTU  
**Délai de réponse :** 72h maximum

---

_Documentation mise à jour le 14 juillet 2025_  
_Prochaine révision : Juillet 2026_
