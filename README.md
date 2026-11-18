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
