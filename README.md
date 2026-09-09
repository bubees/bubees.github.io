# BU Beekeeping Club Website

Live at: **https://bubees.github.io**

Plain HTML/CSS/JS, no build tools or frameworks. Three files: `index.html` (content), `styles.css` (design), `script.js` (contact form + Adopt a Bee gallery).

## Making changes

**Easiest way:** open a Claude Code session in this folder and describe what you want changed in plain English. It'll edit the files and can push the update for you.

**Manual way:**
1. Edit `index.html` / `styles.css` / `script.js` directly.
2. From this folder, run:
   ```bash
   git add -A
   git commit -m "describe what you changed"
   git push
   ```
3. GitHub Pages rebuilds automatically, usually live within a minute or two. No downtime, no manual "take it down" step needed.

## Accounts this site depends on

None of these live in the code, they're separate logins whoever's running the club needs access to:

| What | Where | Notes |
|---|---|---|
| GitHub | account `bubees` | Owns the repo `bubees/bubees.github.io`. Push access = ability to publish changes. Officers share this login. |
| Email | `bubees@bu.edu` | Shown in Contact section. Also has access to the Google Form/Sheet below. |
| Instagram | `@bu.bees` | Linked in Contact section and Join steps. |
| Venmo | `venmo.com/u/yayingmon` | **This is the treasurer's personal Venmo, not a club account.** When the treasurer changes, update the two Venmo links in `index.html` (search for `venmo.com`) to the new treasurer's handle. |
| Google Form + Sheet | linked from "Adopt a Bee" | Collects bee names for the adopt-a-bee gallery. `script.js` fetches the Sheet's published CSV live, no manual syncing needed. Whoever has access to `bubees@bu.edu` should have access to this. |
| BU Giving | give.bu.edu/schools/BostonUniversity | Donors select "BU Beekeeping" as the org manually, this isn't club-specific infrastructure. |

## Common edits

- **Meeting time/location, event dates:** in `index.html`, under `#join` and `#events`.
- **Officer/treasurer changes:** update Venmo links (see table above) and the contact info under `#contact`.
- **Adopted bee names:** no edit needed, it pulls live from the Google Sheet.
- **Colors/fonts/spacing:** all in `styles.css`, uses CSS custom properties defined at the top (`:root`) for the color palette.
