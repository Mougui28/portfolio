# Portfolio — Dylan Amougui

Site statique (HTML / CSS / JS natif). Aucune dépendance, aucun build : les fichiers se déploient tels quels.

```
portfolio/
├── index.html
├── styles.css
├── app.js
└── assets/
    ├── favicon.svg
    ├── proj-frontend.webp
    ├── proj-backend.webp
    └── about-texture.webp
```

## Lancer en local

```bash
python3 -m http.server 5173
# puis http://localhost:5173
```

## Hébergement gratuit — 3 options

### 1. GitHub Pages (recommandé, tu es déjà sur GitHub)

```bash
cd portfolio
git init
git add .
git commit -m "portfolio"
git branch -M main
git remote add origin https://github.com/Mougui28/Mougui28.github.io.git
git push -u origin main
```

Nomme le dépôt exactement `Mougui28.github.io` → le site est servi sur
`https://mougui28.github.io` sans configuration.

Si tu préfères un autre nom de dépôt (ex. `portfolio`) : **Settings → Pages → Source : Deploy from a branch → main / (root)**.
L'URL devient `https://mougui28.github.io/portfolio/`.

### 2. Netlify (le plus rapide)

Va sur [app.netlify.com/drop](https://app.netlify.com/drop) et glisse le dossier `portfolio`.
Le site est en ligne en ~10 secondes sur une URL `*.netlify.app`. Tu peux ensuite connecter
le dépôt GitHub pour un redéploiement automatique à chaque push.

### 3. Vercel

```bash
npm i -g vercel
cd portfolio
vercel
```

Ou via l'interface : **Add New → Project → Import Git Repository**.
Framework preset : `Other`, Build command : vide, Output directory : `.`

## Domaine personnalisé

Les trois plateformes acceptent un domaine perso gratuitement (le domaine lui-même reste payant,
~10 €/an). Sur GitHub Pages : ajoute un fichier `CNAME` contenant ton domaine à la racine.

## Personnalisation rapide

- Couleur d'accent : variable `--accent` dans `styles.css` (blocs `[data-theme='dark']` et `[data-theme='light']`).
- Polices : `--font-display`, `--font-body`, `--font-mono` en haut de `styles.css`.
- Contenu : tout est dans `index.html`, section par section.

---

## Formulaire de contact

Par défaut, le formulaire **fonctionne sans aucune configuration** : à la
validation, il ouvre la messagerie du visiteur avec un message déjà rempli
(nom, email, type de projet, contenu).

Pour recevoir les messages directement dans ta boîte mail, sans que le
visiteur ait à ouvrir son client :

1. Crée un formulaire gratuit sur [Formspree](https://formspree.io) (50 envois/mois)
2. Ouvre `app.js` et remplace la première ligne de configuration :
   ```js
   const FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
   ```

Alternative sur Netlify : ajoute l'attribut `netlify` à la balise `<form>` dans
`index.html`, les envois arrivent dans le dashboard Netlify.

Un champ piège anti-robots (`_gotcha`) est déjà en place, ainsi que la
validation côté client (nom, email, longueur du message).

## Pages

- `index.html` — page principale (héros, à propos, projets, services, stack, parcours, contact)
- `taskapp.html` — étude de cas détaillée du projet Taskapp

## CV

Le fichier `cv-dylan-amougui.pdf` est servi directement depuis le site
(boutons « Télécharger le CV » dans le héros et « CV (PDF) » dans la section
contact). Pour le mettre à jour, remplace simplement le PDF en gardant le même
nom de fichier.
