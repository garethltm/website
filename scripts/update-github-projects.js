const fs = require("node:fs/promises");

const owner = process.env.GITHUB_OWNER || "garethltm";
const portfolioTopic = process.env.PORTFOLIO_TOPIC || "portfolio";
const outputFile = process.env.OUTPUT_FILE || "github-projects.js";
const token = process.env.GITHUB_TOKEN;

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "garethltm-portfolio",
};
if (token) headers.Authorization = `Bearer ${token}`;

async function githubJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status} for ${url}: ${body}`);
  }
  return response.json();
}

function initials(name) {
  const words = name.replace(/[-_]+/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

async function main() {
  const repos = await githubJson(
    `https://api.github.com/users/${encodeURIComponent(owner)}/repos?per_page=100&sort=updated`,
  );
  const accents = ["lilac", "sage", "peach"];

  const projects = [];
  for (const repo of repos) {
    if (repo.fork || repo.archived || repo.private) continue;

    const topics = await githubJson(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo.name)}/topics`,
    );
    if (!topics.names?.includes(portfolioTopic)) continue;

    let releaseCategory = "Open source · GitHub";
    try {
      const release = await githubJson(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo.name)}/releases/latest`,
      );
      if (release.tag_name) releaseCategory = `Release ${release.tag_name}`;
    } catch (error) {
      if (!error.message.includes("GitHub API 404")) throw error;
    }

    projects.push({
      name: repo.name,
      category: releaseCategory,
      description:
        repo.description ||
        `An open-source project by ${owner}, updated ${new Date(repo.updated_at).toLocaleDateString("en-GB")}.`,
      url: repo.homepage || undefined,
      repoUrl: repo.html_url,
      role: repo.language
        ? `Built with ${repo.language}. Source code and project updates are maintained on GitHub.`
        : "Personal project maintained on GitHub.",
      accent: accents[projects.length % accents.length],
      mark: initials(repo.name),
      filter: "GitHub projects",
    });
  }

  projects.sort((a, b) => {
    const repoA = repos.find((repo) => repo.html_url === a.repoUrl);
    const repoB = repos.find((repo) => repo.html_url === b.repoUrl);
    return new Date(repoB?.updated_at || 0) - new Date(repoA?.updated_at || 0);
  });

  const source = `// Generated automatically by scripts/update-github-projects.js.\n// Repositories appear here when the "${portfolioTopic}" topic is added on GitHub.\nwindow.githubPortfolioProjects = ${JSON.stringify(projects, null, 2)};\n`;
  await fs.writeFile(outputFile, source, "utf8");
  console.log(`Wrote ${projects.length} portfolio projects to ${outputFile}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
