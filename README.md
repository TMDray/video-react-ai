# Remotion Video Template

Template pour creer des videos animees professionnelles avec du code.
Construit avec Remotion + React + ElevenLabs.

## Quick Start

```bash
# 1. Installer les dependances
npm install

# 2. Generer les effets sonores et la musique
npm run generate:audio

# 3. Lancer le studio de preview
npm run studio

# 4. Render une video
npm run render -- hello-world-landscape out/hello-world.mp4
```

## Creer une nouvelle video

```bash
# Scaffold automatique
npm run new-video -- ma-video "Ma Super Video"

# Editer les scenes dans src/videos/ma-video/scenes/
# Editer l'audio dans src/videos/ma-video/audio.config.ts

# Preview
npm run studio

# Generer la voix off (necessite ELEVENLABS_API_KEY dans .env)
npm run generate:voiceover -- ma-video

# Render
npm run render -- ma-video-landscape out/ma-video.mp4
```

## Personnaliser pour ta marque

Copie ce prompt et colle-le a Claude avec tes infos :

```
Personnalise ce template Remotion pour ma marque :

- Nom : [nom de ta marque]
- Tagline : [ta tagline]
- Logo : [nom du fichier dans public/, ex: logo.png]
- Couleur principale : [hex, ex: #f97316]
- Couleur principale light : [hex]
- Couleur principale dark : [hex]
- Style de fond : [dark / light]
- Font titres : [nom Google Font, ex: "Outfit"]
- Font corps : [nom Google Font, ex: "Inter"]
- CTA texte : [ex: "Essayer gratuitement"]
- CTA URL : [ex: "mamarque.com/essai"]

Etapes :
1. Mets a jour src/brand.config.ts avec ces valeurs
2. Mets a jour src/lib/fonts.ts pour charger les bonnes Google Fonts
3. Si style "light", inverse les couleurs bg/text dans brand.config.ts
4. Verifie que la video hello-world rend correctement : npm run studio
5. Optionnel : remplace public/logo-placeholder.svg par le vrai logo
```

## Structure du projet

```
src/
  brand.config.ts         # Fiche d'identite de ta marque
  lib/                    # Outils partages (animations, transitions, audio...)
  videos/
    _template/            # Modele copie pour chaque nouvelle video
    hello-world/          # Video d'exemple fonctionnelle
    registry.ts           # Liste des videos enregistrees
public/
  audio/sfx/              # Bruitages (generes par scripts)
  audio/music/            # Musique de fond (generee par scripts)
  audio/voiceover/        # Voix off (generee via ElevenLabs)
scripts/
  new-video.sh            # Creer une nouvelle video
  generate-audio.ts       # Generer SFX + musique
  generate-voiceover.ts   # Generer la voix off
```

## Formats disponibles

Chaque video est automatiquement disponible en 3 formats :

| Format    | Dimensions | Usage                 |
| --------- | ---------- | --------------------- |
| landscape | 1920x1080  | YouTube, site web     |
| linkedin  | 1080x1350  | LinkedIn, Instagram   |
| short     | 1080x1920  | TikTok, Reels, Shorts |

## Assets stock (images & vidéos)

Le MCP Stocky est intégré pour chercher des images et vidéos libres de droits.

### Images (Pexels + Unsplash)

Ajouter dans `.env` :

```
PEXELS_API_KEY=xxx        # Gratuit sur pexels.com/api/
UNSPLASH_ACCESS_KEY=xxx   # Gratuit sur unsplash.com/developers
```

Demander à Claude :

```
Cherche une image de bureau moderne pour le fond de la scène intro.
```

Les images sont téléchargées dans `public/images/` et utilisées via `staticFile()`.

### Vidéos B-roll (Pexels)

```
Cherche une vidéo de 10-20s d'une réunion en bureau pour fond de scène.
```

Les vidéos sont téléchargées dans `public/videos/` et utilisées via `<OffthreadVideo>`.

### Utilisation dans une scène

```tsx
import { Img, staticFile } from "remotion";
import { OffthreadVideo } from "remotion";

// Image
<Img src={staticFile("images/office-bg.jpg")} style={{ width: "100%", height: "100%" }} />

// Vidéo B-roll
<OffthreadVideo src={staticFile("videos/meeting.mp4")} style={{ width: "100%", height: "100%" }} />
```

## Tech stack

- [Remotion](https://remotion.dev) v4 — React video framework
- [@remotion/transitions](https://remotion.dev/docs/transitions) — Scene transitions
- [@remotion/google-fonts](https://remotion.dev/docs/google-fonts) — Font loading
- [@remotion/captions](https://remotion.dev/docs/captions) — TikTok-style subtitles
- [@remotion/lottie](https://remotion.dev/docs/lottie) — Lottie animations
- [ElevenLabs](https://elevenlabs.io) — AI voiceover generation
- [Pexels](https://pexels.com) / [Unsplash](https://unsplash.com) — Stock images & videos
- [Suno](https://suno.com) / [Jamendo](https://jamendo.com) — AI & royalty-free music
- [DeepL](https://deepl.com) — Subtitle translation
