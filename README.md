<h1 align="center">SenCours — Plateforme E-Learning</h1>

<p align="center">
  <strong>Application web d'apprentissage en ligne inspirée d'Udemy, construite pour l'écosystème éducatif sénégalais.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS" />
  <img src="https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/status-active-success?style=flat-square" alt="Status" />
</p>

---

## Aperçu

SenCours est le **frontend** d'une plateforme e-learning complète. Elle permet aux étudiants de découvrir et suivre des cours, aux instructeurs de créer et gérer leur contenu pédagogique, et aux administrateurs de piloter l'ensemble de la plateforme.

> **Backend associé :** Ce frontend communique avec une API REST Spring Boot. Consultez le dépôt backend pour les instructions de déploiement serveur.

---

## Fonctionnalités

### Étudiants
- Catalogue de cours avec recherche, filtres par catégorie et par prix
- Inscription aux cours (gratuits et payants)
- Tableau de bord personnalisé avec progression

### Instructeurs
- Création et édition de cours (titre, description, prix, catégorie, image)
- Éditeur de sections et leçons (6 types : Vidéo, Vidéo uploadée, Texte, Quiz, PDF, Image)
- Constructeur de quiz interactif (QCM, Vrai/Faux, Réponses multiples)
- Tableau de bord avec statistiques (revenus, inscriptions, notes)
- Publication / dépublication de cours

### Administrateurs
- Gestion des utilisateurs (suspension, réactivation)
- Gestion des cours (changement de statut, suppression)
- Gestion des catégories (CRUD + import par défaut de 12 catégories)
- Validation des candidatures instructeurs

### Super Administrateur
- Création directe de comptes administrateurs et instructeurs
- Gestion complète de tous les utilisateurs (suspension, suppression)
- Réinitialisation de la base de données
- Zone sécurisée avec confirmation par mot de passe

---

## Architecture

```
src/
├── app/
│   ├── core/                   # Services, guards, interceptors, modèles
│   │   ├── guards/             # Auth, guest, role guards
│   │   ├── interceptors/       # JWT interceptor
│   │   ├── models/             # Interfaces TypeScript
│   │   └── services/           # Services HTTP (auth, course, user, etc.)
│   ├── features/               # Modules fonctionnels
│   │   ├── admin/              # Panneau d'administration
│   │   ├── auth/               # Login / Register
│   │   ├── become-instructor/  # Candidature instructeur
│   │   ├── courses/            # Catalogue, détail, formulaire cours
│   │   ├── dashboard/          # Tableaux de bord étudiant & instructeur
│   │   ├── instructor/         # Éditeur de cours (sections/leçons)
│   │   ├── legal/              # À propos, Contact, CGU, Confidentialité
│   │   └── super-admin/        # Panneau super administrateur
│   └── shared/                 # Composants et pipes réutilisables
│       ├── components/         # Navbar, Footer, ConfirmModal, etc.
│       └── pipes/              # Pipes personnalisés
├── environments/               # Configuration d'environnement
└── styles.scss                 # Design system, tokens CSS, utilitaires
```

### Principes architecturaux

| Principe | Implémentation |
|---|---|
| **Standalone Components** | Tous les composants sont autonomes (pas de NgModules) |
| **Lazy Loading** | Chaque route charge son composant à la demande |
| **Injection de dépendances** | Utilisation de `inject()` (pattern moderne Angular) |
| **Design System** | Tokens CSS custom (`--violet`, `--ink`, `--border`, etc.) |
| **Sécurité** | Guards de route par rôle, intercepteur JWT automatique |
| **Réactivité** | RxJS pour la gestion des flux de données asynchrones |

---

## Design System

Le projet utilise un **design system unifié** basé sur des tokens CSS :

| Token | Usage |
|---|---|
| `--violet` | Couleur primaire (marque) |
| `--amber` | Accents, prix |
| `--green` | Succès, gratuit |
| `--ink` / `--ink-2/3/4` | Texte (du plus foncé au plus clair) |
| `--canvas` | Arrière-plan |
| `--border` / `--border-2` | Bordures |
| `--gradient-brand` | Gradient principal |

**Classes utilitaires :** `.btn`, `.btn-primary`, `.input`, `.label`, `.card`, `.badge`, `.skeleton`, `.container-app`, `.page-header-brand`

---

## Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 20.x

```bash
npm install -g @angular/cli
```

---

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-utilisateur/sencours-frontend.git
cd sencours-frontend

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp src/environments/environment.example.ts src/environments/environment.ts
# Modifier l'URL de l'API dans environment.ts

# 4. Lancer le serveur de développement
ng serve
```

L'application sera accessible sur **http://localhost:4200**.

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `ng serve` | Serveur de développement avec hot-reload |
| `ng build` | Build de production (output dans `dist/`) |
| `ng test` | Exécution des tests unitaires (Karma + Jasmine) |
| `ng build --watch` | Build en mode watch |

---

## Configuration de l'environnement

Créez le fichier `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

Pour la production (`environment.prod.ts`) :

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.sencours.sn/api/v1'
};
```

---

## Rôles et permissions

| Rôle | Accès |
|---|---|
| **ETUDIANT** | Catalogue, inscription, tableau de bord |
| **INSTRUCTEUR** | Création/édition de cours, statistiques |
| **ADMIN** | Gestion utilisateurs, cours, catégories, candidatures |
| **SUPER_ADMIN** | Toutes les permissions + création d'admins, reset DB |

---

## Stack technique

| Technologie | Version | Usage |
|---|---|---|
| Angular | 20.x | Framework frontend |
| TypeScript | 5.9 | Langage principal |
| Tailwind CSS | 3.4 | Utilitaires CSS |
| SCSS | - | Styles personnalisés et tokens |
| RxJS | 7.8 | Programmation réactive |
| Karma + Jasmine | - | Tests unitaires |

---

## Contribuer

Les contributions sont les bienvenues ! Consultez le fichier [CONTRIBUTING.md](CONTRIBUTING.md) pour les directives.

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/ma-fonctionnalite`)
3. Committez vos changements (`git commit -m 'feat: ajout de ma fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

---

## Auteur

**Mohamed Makan KOUYATÉ**

Projet réalisé dans le cadre de la formation à [Orange Digital Center](https://www.orangedigitalcenter.sn/) / [Sonatel Academy](https://www.sonatelacademy.com/).

---

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
