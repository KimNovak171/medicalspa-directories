const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "out");

if (!fs.existsSync(OUT_DIR) || !fs.statSync(OUT_DIR).isDirectory()) {
  process.exit(0);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(fullPath);
    } else if (ent.isFile()) {
      const lower = ent.name.toLowerCase();
      if (!lower.endsWith(".txt")) continue;
      if (lower === "robots.txt") continue;
      fs.unlinkSync(fullPath);
    }
  }
}

walk(OUT_DIR);
