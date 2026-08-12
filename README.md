# RDV App — Plateforme de prise de rendez-vous multi-vendeurs

Application Next.js 13 (App Router + Server Actions) permettant :
- à un **Admin** de créer des comptes **Vendeurs**
- à un **Vendeur** de créer ses **produits/services** et ses **disponibilités**
- à un **Client final** (sans compte) de **réserver un créneau** en ligne

---

## 1. Stack

| Domaine | Outil |
|---|---|
| Framework | Next.js 13 (App Router, Server Actions) |
| Langage | TypeScript |
| ORM / DB | Prisma + PostgreSQL |
| Auth | NextAuth.js (Credentials + JWT) |
| Validation | Zod |
| Style | Tailwind CSS |
| Conteneurisation | Docker + Docker Compose |
| CI/CD | GitHub Actions → Vercel |
| Tests unitaires | Jest + Testing Library |
| Tests E2E | Playwright |
| Qualité de code | ESLint + Prettier + Husky + lint-staged |

---

## 2. Chaîne DevOps mise en place

```
Dev local (Docker Compose) 
   │
   ▼
Git commit ── Husky (pre-commit: lint + format) 
   │
   ▼
Push / PR ── GitHub Actions "CI"
   │   ├─ Lint (ESLint)
   │   ├─ Format check (Prettier)
   │   ├─ Typecheck (tsc)
   │   ├─ Tests unitaires (Jest, avec Postgres de service)
   │   ├─ Build Next.js
   │   └─ Build image Docker
   │
   ▼
Merge sur main ── GitHub Actions "Deploy"
   │   ├─ prisma migrate deploy (migration DB prod)
   │   └─ vercel deploy --prod
   │
   ▼
Production sur Vercel
```

---

## 3. Démarrage local (avec Docker)

```bash
cp .env.example .env
docker-compose up --build
```

L'app tourne sur http://localhost:3000, Postgres sur le port 5432.

Puis, dans un autre terminal, appliquer le schéma et créer le compte admin :

```bash
npm run prisma:migrate
npm run prisma:seed
```

Identifiants par défaut (modifiables dans `.env`) :
- Email : `admin@rdvapp.com`
- Mot de passe : `ChangeMe123!`

---

## 4. Démarrage local (sans Docker)

```bash
npm install
cp .env.example .env   # renseigner DATABASE_URL vers votre Postgres local
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

---

## 5. Scripts disponibles

```bash
npm run dev              # démarrage en dev
npm run build             # build production
npm run lint               # ESLint
npm run format             # Prettier (write)
npm run typecheck          # vérification TypeScript
npm run test                # tests unitaires (Jest)
npm run e2e                  # tests end-to-end (Playwright)
npm run prisma:studio      # interface graphique de la base
npm run docker:up          # build + run via Docker Compose
```

---

## 6. Déploiement sur Vercel

1. Créer un projet Vercel lié à ce dépôt Git
2. Provisionner une base PostgreSQL (Vercel Postgres, Neon ou Supabase)
3. Renseigner les variables d'environnement dans Vercel :
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Dans GitHub → Settings → Secrets, ajouter :
   - `VERCEL_TOKEN`
   - `DATABASE_URL`
5. Chaque push sur `main` déclenche automatiquement la migration + le déploiement via `.github/workflows/deploy.yml`

`vercel.json` exécute `prisma generate && prisma migrate deploy && next build` au build, garantissant que la base est toujours synchronisée avec le schéma.

---

## 7. Modèle métier

- **Admin** : seul rôle habilité à créer des comptes Vendeurs (`/vendeurs`)
- **Vendeur** : gère ses produits (`/produits`), ses disponibilités (`/disponibilites`) et ses RDV (`/rendez-vous`)
- **Client final** : accède à `/{slug-du-vendeur}`, choisit un produit, un créneau libre (calculé en croisant disponibilités + RDV existants), et réserve sans créer de compte

---

## 8. Structure du projet

```
app/
 ├── (auth)/login/                     page de connexion
 ├── (admin)/dashboard, vendeurs/      espace admin
 ├── (vendeur)/produits, disponibilites, rendez-vous/   espace vendeur
 ├── (public)/[vendeurSlug]/           page publique + réservation
 └── api/auth/[...nextauth]/           NextAuth
prisma/
 ├── schema.prisma
 └── seed.ts
lib/
 ├── db.ts, auth.ts, validations.ts
.github/workflows/
 ├── ci.yml, deploy.yml
tests/        (Jest)
e2e/          (Playwright)
Dockerfile, docker-compose.yml, vercel.json
```
