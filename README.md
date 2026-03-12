# Trendora — Radar d'opportunités business

Chaque semaine, notre IA analyse des milliers de signaux pour détecter les meilleures opportunités de marché.

## Déploiement sur GitHub Pages

### Étapes :

**1. Créer le repo GitHub**
- Va sur [github.com/new](https://github.com/new)
- Nom du repo : `trendora`
- Laisse le repo **public**
- Ne coche aucune option (pas de README, pas de .gitignore)
- Clique "Create repository"

**2. Push le code**
```bash
cd trendora
git init
git add .
git commit -m "Initial commit - Trendora v1.0"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/trendora.git
git push -u origin main
```

**3. Activer GitHub Pages**
- Va dans **Settings** > **Pages** de ton repo
- Source : sélectionne **GitHub Actions**
- C'est tout ! Le workflow va se lancer automatiquement

**4. Accéder au site**
- Après 1-2 minutes, ton site sera en ligne à :
- `https://TON_USERNAME.github.io/trendora/`

### Développement local

```bash
npm install
npm run dev
```

### Personnalisation

- **Lien Calendly** : remplace `https://calendly.com` par ton vrai lien dans `src/App.jsx` (recherche "calendly.com")
- **Opportunités** : modifie le tableau `OPPORTUNITIES` dans `src/App.jsx`
- **Catégories** : modifie le tableau `CATEGORIES` dans `src/App.jsx`

### Nom de domaine personnalisé (optionnel)

Si tu veux utiliser un domaine comme `trendora.fr` :
1. Achète le domaine (OVH, Namecheap, etc.)
2. Dans **Settings > Pages** de ton repo GitHub, ajoute ton domaine
3. Configure les DNS chez ton registrar :
   - Type A : `185.199.108.153`
   - Type A : `185.199.109.153`
   - Type A : `185.199.110.153`
   - Type A : `185.199.111.153`
4. Coche "Enforce HTTPS"
5. Si tu utilises un domaine personnalisé, change `base` dans `vite.config.js` de `'/trendora/'` à `'/'`

## Stack

- React 18
- Vite 6
- GitHub Pages + GitHub Actions
