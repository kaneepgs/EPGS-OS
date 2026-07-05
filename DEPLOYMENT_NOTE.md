# Deployment Note

This project is a **static frontend prototype**.

It does **not** need:

- a backend
- a database
- APIs
- authentication
- automation

## Replit

### Best use

Good for a quick private preview or internal demo link.

### Basic approach

1. Create a new Repl from the project files
2. Make sure the full `EP-Intelligence` folder is uploaded
3. Install dependencies:

```bash
npm install
npm run vendor:chart
```

4. Run a simple static server:

```bash
npm run serve
```

5. Open the Replit preview URL

### Notes

- this is the quickest route for a shareable demo
- no server framework is required
- keep it positioned as a prototype, not a live product

## Hostinger Static Hosting

### Best use

Good for a cleaner branded demo deployment.

### Basic approach

1. Upload the full contents of the `EP-Intelligence` folder
2. Ensure `index.html` is in the web root
3. Upload the full `assets/` folder as-is
4. Publish the site

### Important

Because this app uses JavaScript modules, it should be served from normal web hosting.
Do **not** just open `index.html` directly from a local file path.

### Checklist

- `index.html` uploaded
- `assets/` uploaded
- `assets/vendor/chart.umd.js` uploaded
- no backend setup required
- no database setup required

## Recommendation

- use **Replit** for speed
- use **Hostinger static hosting** for a cleaner presentation link
