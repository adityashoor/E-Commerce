/**
 * Run once: node replaceApiUrl.js
 * Replaces all hardcoded localhost:9000 with the API_URL import.
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "src", "components");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));

let updated = 0;
for (const file of files) {
    const fp = path.join(dir, file);
    let c = fs.readFileSync(fp, "utf8");

    if (!c.includes("localhost:9000")) continue;

    // Add import after the last existing import line
    if (!c.includes("apiConfig")) {
        c = c.replace(
            /(^import .+;\n)(?!import)/m,
            (match) => match // find last import block
        );
        // Prepend to top
        c = `import API_URL from "../apiConfig";\n` + c;
    }

    // Replace inside template literals:  `http://localhost:9000...
    c = c.replace(/`http:\/\/localhost:9000/g, "`${API_URL}");

    // Replace double-quoted strings: "http://localhost:9000/..."  →  `${API_URL}/...`
    c = c.replace(/"http:\/\/localhost:9000([^"]*?)"/g, "`${API_URL}$1`");

    fs.writeFileSync(fp, c, "utf8");
    console.log("✔", file);
    updated++;
}
console.log(`\nDone — ${updated} files updated.`);
