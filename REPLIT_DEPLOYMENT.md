# Replit Deployment — EP Intelligence v2.0

EP Intelligence is a static frontend app. It does not need a database or backend for the current v2.0 release.

## Upload / import checklist

Upload this project to Replit without these private/local folders and files:

- `.env`
- `.git/`
- `node_modules/`
- `assets/data/generated/*.json`

The provided deployment ZIP already excludes those.

## Replit setup

1. Create a new Replit project.
2. Import or upload the prepared EP Intelligence project files.
3. In the Replit shell, run:

```bash
npm install
npm run vendor:chart
```

4. Press **Run**. The `.replit` file starts the static server on port `3012` for preview.

## Deployment settings

For a Static deployment:

- Build command: `npm install && npm run vendor:chart`
- Public directory: `/`

For a Reserved VM / Autoscale-style deployment:

- Build command: `npm install && npm run vendor:chart`
- Run command: `python3 -m http.server 3000`

## Custom domain

After the Replit deployment is live, add this custom domain in Replit:

```text
os.epgolfstudios.co.uk
```

Then copy the exact DNS records Replit provides into the DNS manager for `epgolfstudios.co.uk`.

## Security note

Do not upload `.env` to Replit for the current static prototype. Browser-side files cannot safely hold private API credentials. Live credentials should only be added later through a backend/server provider layer.
