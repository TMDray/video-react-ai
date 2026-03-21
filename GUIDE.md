# Guide — Creer des videos avec ce template

Ce guide est fait pour les personnes qui ne sont pas developpeurs.
Tu n'as pas besoin de savoir coder pour utiliser ce projet avec Claude.

## C'est quoi ce projet ?

Ce projet permet de **creer des videos animees professionnelles a partir de code**.

Imagine un PowerPoint, mais :
- 100% automatise
- Beaucoup plus beau (animations fluides, transitions pro)
- Exporte directement en MP4 pour LinkedIn, TikTok, YouTube...

Le resultat : des fichiers video prets a publier.

## Comment c'est organise ?

```
Le projet (version simplifiee)
│
├── brand.config.ts    ← La fiche d'identite de ta marque
│                        (nom, couleurs, logo, slogan)
│
├── videos/
│   ├── _template/     ← Le modele vide (copie pour chaque video)
│   ├── hello-world/   ← Une video d'exemple qui marche
│   │   ├── scenes/    ← Les "pages" de ta video
│   │   │   ├── Intro  ← Logo + nom (3 secondes)
│   │   │   ├── Main   ← Le contenu principal
│   │   │   └── Outro  ← Slogan + bouton d'action
│   │   └── audio.config  ← Les textes de la voix off
│   └── ta-video/      ← Tes futures videos
│
├── audio/
│   ├── sfx/           ← Les bruitages (whoosh, ding, clic...)
│   ├── music/         ← La musique de fond
│   └── voiceover/     ← La voix off (generee par IA)
│
└── scripts/           ← Les outils automatiques
```

## Comment creer une nouvelle video ?

### Etape 1 : Creer le squelette

Ouvre un terminal et tape :

```
npm run new-video -- ma-video "Le Titre de Ma Video"
```

Ca cree automatiquement un dossier avec tous les fichiers necessaires.

### Etape 2 : Ecrire le texte de la voix off

Ouvre le fichier `audio.config.ts` de ta video et ecris les textes :
- Texte d'intro
- Texte principal
- Texte de conclusion

### Etape 3 : Demander a Claude de creer les scenes

Donne a Claude ton storyboard. Par exemple :

> "J'ai cree une nouvelle video 'demo-email'. Je veux :
> - Intro avec le logo (3s)
> - Scene montrant un raccourci clavier Ctrl+Shift+E (3s)
> - Scene montrant une dictee vocale avec une barre d'ondes (4s)
> - Scene montrant le resultat dans Gmail (6s)
> - Outro avec le slogan (4s)
> Cree les scenes."

Claude va creer le code des scenes pour toi.

### Etape 4 : Previsualiser

```
npm run studio
```

Ca ouvre un navigateur ou tu peux voir ta video en temps reel.

### Etape 5 : Generer la voix off

```
npm run generate:voiceover -- ma-video
```

(Necessite une cle API ElevenLabs dans le fichier .env)

### Etape 6 : Exporter la video

```
npm run render -- ma-video-landscape out/ma-video.mp4
```

## Les 3 formats de video

Chaque video est automatiquement disponible en :

- **Paysage** (1920x1080) — Pour YouTube, sites web, presentations
- **LinkedIn** (1080x1350) — Pour LinkedIn et Instagram feed
- **Short** (1080x1920) — Pour TikTok, Instagram Reels, YouTube Shorts

Tu n'as rien a faire : les 3 formats sont generes automatiquement.

## Personnaliser pour ta marque

Tu veux que les videos portent tes couleurs ? Copie ce texte et envoie-le a Claude :

```
Personnalise ce template Remotion pour ma marque :

- Nom : [ecris le nom de ta marque]
- Tagline : [ecris ton slogan]
- Logo : [nom du fichier logo, ex: mon-logo.png]
- Couleur principale : [code couleur hex, ex: #f97316]
- Style de fond : dark (fond sombre) ou light (fond clair)
- Font titres : [nom de la police Google, ex: "Outfit"]
```

Claude va modifier le fichier `brand.config.ts` et tout s'adapte automatiquement.

## Vocabulaire rapide

| Terme | Explication |
|-------|-------------|
| **Scene** | Une "page" de ta video (intro, contenu, fin) |
| **Composition** | La video complete assemblee |
| **Frame** | 1 image. A 30fps, 1 seconde = 30 frames |
| **Transition** | L'effet entre deux scenes (fondu, glissement...) |
| **SFX** | Sound effect = bruitage (clic, swoosh, ding...) |
| **Voiceover** | La voix off qui raconte |
| **Render** | Exporter la video en fichier MP4 |

## Travailler avec Claude

Tu peux demander a Claude de modifier n'importe quelle partie de ta video.
Voici des exemples de demandes :

**Ajouter du contenu :**
- "Ajoute une scene qui montre l'ecran de connexion entre l'intro et le contenu"
- "Ajoute un bruitage de notification quand le badge apparait"
- "Ajoute des sous-titres style TikTok a cette video"

**Modifier le style :**
- "Change la transition pour un slide de gauche a droite"
- "Accelere l'animation de l'intro, elle est trop lente"
- "Rends le texte plus gros pour le format vertical"

**Audio :**
- "Genere la voix off pour cette video"
- "Change la musique de fond pour quelque chose de plus energique"
- "Ajoute un son de clic quand les touches s'allument"

**Format :**
- "Montre-moi a quoi ca ressemble en format TikTok"
- "Adapte le layout pour que ca marche mieux en portrait"

## Premiere utilisation

1. Installe les outils : `npm install`
2. Genere les sons : `npm run generate:audio`
3. Lance le studio : `npm run studio`
4. Regarde la video d'exemple "hello-world" dans ton navigateur
5. C'est pret — cree ta premiere video !
