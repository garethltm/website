# Gareth Lee — personal website

A lightweight, responsive portfolio built with plain HTML, CSS, and JavaScript.

## Updating the site

Edit [`portfolio-data.js`](./portfolio-data.js) to update the homepage copy, LinkedIn link, experience, education, certifications, projects, and skills. Add or remove entries in its arrays to change those sections without editing the page structure.

Project entries support:

- `name`, `category`, and `description`
- optional `url` for a live project page
- optional `repoUrl` for a public source-code repository
- `role` for the interactive “My part in it” disclosure
- `accent`, `mark`, and `filter` for the project card and category filters

The theme switch follows the visitor’s system preference initially and remembers their choice in browser storage. Project filters, expandable experience entries, and project details work without a build step or external runtime dependencies.

Open `index.html` in a browser to preview the site.

## Automatic GitHub projects

Public repositories can be added to the Work section automatically:

1. Add the GitHub topic `portfolio` to repositories you want to feature.
2. Optionally publish a GitHub Release; the card category will use the latest release tag.
3. The workflow at `.github/workflows/update-github-projects.yml` runs every six hours and can be started manually.
4. It generates `github-projects.js`, commits the result, and GitHub Pages serves the new project cards.

Archived, forked, private, and repositories without the `portfolio` topic are excluded. A repository that already has a matching manual entry in `portfolio-data.js` is shown only once.

To update immediately, open **Actions → Update GitHub projects → Run workflow**.

You can test or update the generated file locally:

```sh
GITHUB_TOKEN="$(gh auth token)" node scripts/update-github-projects.js
```
