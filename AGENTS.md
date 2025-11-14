# Repository Guidelines

## Project Structure & Module Organization
Serve the dashboard from `index.html`; interactive logic lives in `app.js`, and shared styles stay centralized in `styles.css` (ignore `styl3s.css`). Store static assets such as icons in `assets/`. Data inputs and derived artifacts reside in `data/`, including the canonical `lifeskills.json`, EFGLS/EFL/VB-MAPP source texts, and the generated `embeddings.db`. Automation outputs land in `reports/` (`mapping-log.json`, `mapping-report.html`), while reusable scripts live under `tools/`. Use `venv/` for isolated Python dependencies and keep temp notebooks or scratch files out of version control.

## Build, Test, and Development Commands
- `source venv/bin/activate` — load the pinned Python toolchain before running scripts (or call `venv/bin/python …` directly).
- `python3 -m http.server 5175` — launch a quick preview at http://localhost:5175 to smoke-test charts and exports (not available inside restricted sandboxes).
- `venv/bin/python tools/make_lifeskills.py` — rebuild `data/lifeskills.json`; expect a completion message reporting 45 skills.
- `HF_HUB_OFFLINE=1 venv/bin/python tools/embed.py data/*.txt --out data/embeddings.db` — recreate embeddings with the cached SentenceTransformer model.
- `venv/bin/python tools/build.py --threshold 0.6` — refresh `data/mapping_index.json` plus HTML/JSON diagnostics; adjust the threshold when product guidance changes.

## Coding Style & Naming Conventions
- Keep two-space indentation in JavaScript, prefer arrow functions, and default to `const` unless mutation is required.
- Use descriptive camelCase for helpers (`renderQuestions`, `loadMonthlyData`) and UPPER_SNAKE_CASE for shared constants (`SUBSCALES`, `REL_ORDER`).
- Extend `styles.css` rather than adding new sheets; mirror its compact rule formatting and bilingual labeling.
- Treat JSON as UTF-8; avoid trailing commas so browser fetches stay predictable.

## Testing Guidelines
Document every manual check: reload the local server after data or script edits, watch the browser console for fetch errors, confirm charts render current ranges, and spot-check tooltips. Validate JSON shape with `jq '.items | length' data/lifeskills.json`. After running `tools/build.py`, open `reports/mapping-report.html` to review related-item tiers and note threshold impacts.

## Commit & Pull Request Guidelines
Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`) so automation can parse the history. Pull requests should summarize user-facing impact, link Jira/GitHub issues, include screenshots or report snippets for visual or data changes, and list the validation commands executed. Request review before merging refreshed data, embeddings, or threshold adjustments; these impact scoring pipelines.

## Data & Security Notes
Inputs in `data/` may include learner skill descriptors—remove personally identifiable information before committing. Keep large intermediate artifacts (extra PDFs, experimental embedding dumps) untracked or add them to `.gitignore`. Rotate API keys or secrets locally; they should never enter the repo or server logs.
