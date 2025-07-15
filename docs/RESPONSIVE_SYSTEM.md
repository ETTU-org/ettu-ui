# 📱 Documentation Système Responsive - ETTU

## 📋 Vue d'ensemble

Le système responsive d'ETTU offre une expérience utilisateur optimisée sur desktop et mobile avec :

- **Adaptation automatique** à la taille d'écran
- **Onglets mobiles** pour navigation tactile
- **Layout adaptatif** pour différents contenus
- **Hooks React** pour intégration facile
- **Performance optimisée** pour mobile

## 🏗️ Architecture du Système

### Composants principaux

1. **`useResponsiveView.ts`** - Hook principal pour gestion responsive
2. **`ResponsiveLayout.tsx`** - Composant layout adaptatif
3. **`MobileTabs.tsx`** - Système d'onglets pour mobile
4. **`responsive.ts`** - Point d'entrée centralisé

### Types de vue

```typescript
export type ViewType = "editor" | "preview" | "both";

interface UseResponsiveViewReturn {
  isMobile: boolean;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}
```

## 🚀 Utilisation de Base

### 1. Hook useResponsiveView

```typescript
import { useResponsiveView } from "../hooks/useResponsiveView";

const { isMobile, activeView, setActiveView } = useResponsiveView();

// Adaptation du comportement selon le device
if (isMobile) {
  // Affichage mobile avec onglets
} else {
  // Affichage desktop avec vues côte à côte
}
```

### 2. Composant ResponsiveLayout

```typescript
import { ResponsiveLayout } from "../utils/responsive";

<ResponsiveLayout
  editorContent={<MonEditeur />}
  previewContent={<MaPreview />}
  mobileTabsConfig={{
    editorLabel: "Éditeur",
    previewLabel: "Aperçu",
    editorIcon: "✏️",
    previewIcon: "👁️",
  }}
/>;
```

### 3. Onglets mobiles

```typescript
import { MobileTabs } from "../utils/responsive";

<MobileTabs
  activeView={activeView}
  setActiveView={setActiveView}
  tabs={[
    { id: "editor", label: "Éditeur", icon: "✏️" },
    { id: "preview", label: "Aperçu", icon: "👁️" },
  ]}
/>;
```

## 🛠️ Intégrations Existantes

### 1. NoteEditor

```typescript
// Dans NoteEditor.tsx
import { ResponsiveLayout } from "../../utils/responsive";

return (
  <ResponsiveLayout
    editorContent={
      <div className="h-full flex flex-col bg-gray-900">
        <EditorHeader />
        <CodeMirror />
      </div>
    }
    previewContent={<MarkdownPreview content={content} />}
    mobileTabsConfig={{
      editorLabel: "Éditeur",
      previewLabel: "Aperçu",
      editorIcon: "✏️",
      previewIcon: "👁️",
    }}
  />
);
```

### 2. SnippetsPage

```typescript
// Dans SnippetsPage.tsx
import { ResponsiveLayout } from "../utils/responsive";

<ResponsiveLayout
  editorContent={
    <div className="h-full flex flex-col">
      <SnippetList />
      <SnippetEditor />
    </div>
  }
  previewContent={<SnippetPreview />}
  mobileTabsConfig={{
    editorLabel: "Snippets",
    previewLabel: "Aperçu",
    editorIcon: "📝",
    previewIcon: "🔍",
  }}
/>;
```

## 📱 Fonctionnalités Mobiles

### Détection automatique

```typescript
// Dans useResponsiveView.ts
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

### Adaptation des vues

```typescript
// Logique d'adaptation automatique
useEffect(() => {
  if (isMobile && activeView === "both") {
    setActiveView("editor"); // Forcer vue simple sur mobile
  }
}, [isMobile, activeView]);
```

### Gestion tactile

```typescript
// Dans MobileTabs.tsx
const handleTabClick = (viewType: ViewType) => {
  setActiveView(viewType);

  // Feedback tactile si disponible
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};
```

## 🎨 Styles et Responsive Design

### Breakpoints

```css
/* Breakpoints utilisés */
@media (max-width: 767px) {
  /* Mobile */
}

@media (min-width: 768px) {
  /* Desktop */
}
```

### Classes Tailwind

```typescript
// Styles responsive conditionnels
const containerClasses = isMobile ? "flex flex-col h-full" : "flex h-full";

const editorClasses = isMobile
  ? "flex-1 h-full"
  : "flex-1 h-full border-r border-gray-700";
```

### Animations

```css
/* Transitions fluides */
.tab-transition {
  transition: all 0.3s ease-in-out;
}

.mobile-tab-active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

## ⚡ Performance

### Optimisations mobiles

```typescript
// Debouncing pour resize
const useDebounce = (callback: () => void, delay: number) => {
  const debounceTimer = useRef<NodeJS.Timeout>();

  return useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(callback, delay);
  }, [callback, delay]);
};
```

### Lazy loading

```typescript
// Chargement conditionnel du contenu
const EditorContent = useMemo(() => {
  if (isMobile && activeView !== "editor") {
    return null; // Ne pas rendre si non visible
  }
  return <MonEditeur />;
}, [isMobile, activeView]);
```

### Mémoire mobile

```typescript
// Limitation de l'historique sur mobile
const maxHistoryLength = isMobile ? 10 : 50;
```

## 🧪 Tests et Validation

### Tests responsifs

```typescript
// Dans responsive.test.ts
describe("Responsive System", () => {
  test("détection mobile", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { result } = renderHook(() => useResponsiveView());
    expect(result.current.isMobile).toBe(true);
  });

  test("changement de vue", () => {
    const { result } = renderHook(() => useResponsiveView());

    act(() => {
      result.current.setActiveView("preview");
    });

    expect(result.current.activeView).toBe("preview");
  });
});
```

### Tests d'intégration

```typescript
// Test des composants responsifs
test("ResponsiveLayout affichage mobile", () => {
  const { container } = render(
    <ResponsiveLayout
      editorContent={<div>Éditeur</div>}
      previewContent={<div>Aperçu</div>}
      mobileTabsConfig={{
        editorLabel: "Éditeur",
        previewLabel: "Aperçu",
      }}
    />
  );

  expect(container.querySelector(".mobile-tabs")).toBeInTheDocument();
});
```

## 🔧 Configuration

### Customisation des breakpoints

```typescript
// Configuration personnalisée
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

const useCustomResponsive = () => {
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  return {
    isMobile: screenSize < BREAKPOINTS.mobile,
    isTablet:
      screenSize >= BREAKPOINTS.mobile && screenSize < BREAKPOINTS.tablet,
    isDesktop: screenSize >= BREAKPOINTS.desktop,
  };
};
```

### Thèmes responsive

```typescript
// Thèmes adaptatifs
const mobileTheme = {
  fontSize: "14px",
  padding: "8px",
  buttonHeight: "44px", // Recommandation tactile
};

const desktopTheme = {
  fontSize: "16px",
  padding: "12px",
  buttonHeight: "36px",
};
```

## 🚀 Déploiement

### PWA et mobile

```typescript
// Configuration PWA
const PWA_CONFIG = {
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  touchAction: "manipulation",
  userScalable: false,
};
```

### Optimisations de bundle

```typescript
// Lazy loading pour mobile
const MobileOnlyComponent = lazy(() => import("./MobileOnlyComponent"));

// Chargement conditionnel
const Component = isMobile ? MobileOnlyComponent : DesktopComponent;
```

## 📊 Monitoring

### Métriques mobiles

```typescript
// Suivi des performances mobiles
const trackMobilePerformance = () => {
  const navigation = performance.getEntriesByType("navigation")[0];
  const metrics = {
    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
    domContentLoaded:
      navigation.domContentLoadedEventEnd -
      navigation.domContentLoadedEventStart,
    firstPaint: performance.getEntriesByType("paint")[0]?.startTime,
  };

  // Alertes si performances dégradées sur mobile
  if (metrics.loadTime > 3000) {
    console.warn("⚠️ Chargement lent sur mobile");
  }
};
```

### Analytics d'utilisation

```typescript
// Suivi des interactions mobiles
const trackMobileInteraction = (action: string) => {
  const event = {
    type: "mobile_interaction",
    action,
    timestamp: Date.now(),
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent,
  };

  // Envoi vers analytics (si implémenté)
  console.log("📱 Mobile interaction:", event);
};
```

## 🎯 Bonnes Pratiques

### UX Mobile

- **Zones tactiles** : Minimum 44px de hauteur
- **Espacement** : Au moins 8px entre les éléments
- **Feedback** : Vibrations et animations
- **Navigation** : Thumb-friendly zones

### Performance

- **Lazy loading** : Contenu non visible
- **Debouncing** : Événements resize
- **Mémoire** : Limitation des historiques
- **Bundle** : Splitting par device

### Accessibilité

- **Contraste** : Adapté à l'éclairage mobile
- **Taille de texte** : Ajustement automatique
- **Navigation** : Support clavier/lecteur d'écran

## 📞 Support

**Documentation :** `/docs/RESPONSIVE_SYSTEM.md`  
**Tests :** `npm run test:responsive`  
**Support :** julesbossis@gmail.com

---

_Documentation mise à jour le 14 juillet 2025_  
_Prochaine révision : Avant déploiement production_
