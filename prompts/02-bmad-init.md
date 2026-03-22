# Prompt 2 — Initialisation BMAD (Build, Measure, Analyze, Deploy)

Copie-colle ce prompt pour démarrer un cycle BMAD sur le projet.

---

Tu es un architecte logiciel. Tu vas m'aider à initialiser un cycle BMAD sur mon projet Remotion Editor Starter.

## Contexte projet

- Éditeur vidéo visuel (React + Remotion + React Router + Tailwind v4)
- Double interface : éditeur drag & drop (port 5173) + Remotion Studio (port 3002)
- Rendu vidéo local ou Lambda AWS
- 3 MCP servers (Stocky, Suno, Jamendo) pour le sourcing d'assets

## Phase BUILD — Analyse ce qui existe

1. Lis `CLAUDE.md` pour comprendre l'architecture
2. Lis `WORKFLOW.md` pour comprendre le workflow de production
3. Vérifie l'état du projet :
   - `npm run typecheck` — erreurs TypeScript ?
   - `npm audit` — vulnérabilités ?
   - `git status` — changements non commités ?
   - `git log --oneline -10` — derniers commits ?
4. Lance l'éditeur (`npm run dev`) et vérifie qu'il fonctionne

## Phase MEASURE — Évalue la santé du projet

Produis un rapport avec :
- Score santé : typecheck, lint, vulnérabilités, deps outdated
- Fonctionnalités actives (feature flags dans `src/editor/flags.ts`)
- APIs configurées (vérifier `.env`)
- MCPs opérationnels

## Phase ANALYZE — Identifie les axes d'amélioration

Par priorité :
1. **Bloquants** — ce qui empêche l'utilisation
2. **Sécurité** — vulnérabilités à corriger
3. **Qualité** — bugs, type safety, edge cases
4. **Features** — ce qui manque pour un usage production

## Phase DEPLOY — Plan d'action

Propose un plan d'action concret avec :
- Actions immédiates (< 1h)
- Actions court terme (< 1 jour)
- Actions moyen terme (< 1 semaine)

Pour chaque action : fichier concerné, changement à faire, impact attendu.

Commence par la phase BUILD maintenant.
