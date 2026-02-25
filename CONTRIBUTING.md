# Contribuer à SenCours Frontend

Merci de votre intérêt pour contribuer à SenCours ! Ce document fournit les directives pour contribuer au projet.

## Code de conduite

En participant à ce projet, vous acceptez de maintenir un environnement respectueux et inclusif pour tous.

## Comment contribuer

### Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé dans les [Issues](../../issues)
2. Créez une nouvelle issue en utilisant le template **Bug Report**
3. Décrivez le comportement attendu vs. le comportement observé
4. Incluez des captures d'écran si pertinent

### Proposer une fonctionnalité

1. Vérifiez que la fonctionnalité n'a pas déjà été proposée
2. Créez une issue en utilisant le template **Feature Request**
3. Décrivez le cas d'usage et la solution proposée

### Soumettre du code

1. **Forkez** le dépôt et créez votre branche depuis `main`
2. Nommez votre branche de manière descriptive :
   - `feature/nom-fonctionnalite` pour les nouvelles fonctionnalités
   - `fix/description-bug` pour les corrections
   - `refactor/description` pour le refactoring
3. Écrivez du code propre et respectez les conventions du projet
4. Testez vos changements localement (`ng build` doit passer sans erreur)
5. Créez une **Pull Request** avec une description claire

## Conventions de code

### Style

- **Indentation :** 2 espaces (pas de tabulations)
- **Quotes :** simples (`'`) pour TypeScript
- **Largeur max :** 100 caractères (Prettier configuré)
- **Composants :** standalone, avec inline template

### Nommage

- **Fichiers :** kebab-case (`course-list.component.ts`)
- **Classes :** PascalCase (`CourseListComponent`)
- **Variables/Méthodes :** camelCase (`loadCourses()`)
- **Constantes :** UPPER_SNAKE_CASE (`API_URL`)

### Design System

- Utilisez les tokens CSS (`var(--violet)`, `var(--ink)`, etc.) au lieu de couleurs Tailwind brutes
- Utilisez les classes du design system (`.btn`, `.input`, `.card`, `.badge`, etc.)
- Consultez `src/styles.scss` pour la référence complète

### Commits

Suivez les [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: ajout du système de quiz
fix: correction de l'espacement de la barre de recherche
refactor: migration vers les standalone components
docs: mise à jour du README
style: uniformisation des tokens CSS
```

## Configuration de développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve

# Build de production
ng build

# Tests unitaires
ng test
```

## Structure du projet

Consultez le [README](README.md#architecture) pour la structure détaillée du projet.

## Questions ?

N'hésitez pas à ouvrir une issue pour toute question relative au projet.
