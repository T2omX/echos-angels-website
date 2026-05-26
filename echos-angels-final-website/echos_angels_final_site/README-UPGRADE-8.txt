# Echo's Angels Website - Upgrade 8

This package is a launch-focused quality pass.

## What changed
- Rebuilt as a cleaner single-page website for faster launch.
- All public wording loads from `content.json`.
- Admin editor can edit:
  - business info
  - home page text
  - services
  - gallery
  - FAQ
  - socials
  - section visibility
  - hero slideshow
  - SEO
- Admin edits save as browser drafts first.
- Export button downloads the updated `content.json`.
- Added launch checks inside admin panel.
- Added GitHub Pages files:
  - `CNAME`
  - `.nojekyll`
  - `robots.txt`
  - `sitemap.xml`
  - `404.html`

## Admin password
Default admin password is:

echo

This is only a light hide button on a static website, not real security. Do not store private client info in the admin editor.

## How to preview
Open `index.html` directly, or run:

Windows:
    tools/preview-windows.bat

Mac/Linux:
    python3 -m http.server 8080

Then open:
    http://localhost:8080

## How to update words/images
1. Open the site.
2. Click Settings.
3. Enter password: echo
4. Edit content.
5. Save Draft to preview.
6. Export content.json.
7. Replace the old content.json with the exported one.

## Image workflow
Put real images in:
    assets/images/

Then use paths like:
    assets/images/echo-training.jpg

Recommended:
- Hero: 1600px wide, under 1MB if possible
- Gallery: 800-1200px wide
- JPG or WEBP preferred

## Before launch
- Add real social links.
- Decide if phone number should be public.
- Replace placeholder images.
- Change `CNAME` only after you own the domain.
- If launching before buying the domain, remove or ignore `CNAME`.
