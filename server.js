const fs = require("fs");
const path = require("path");
const dir = "src/environments";
const file = "environment.ts";
const content = `${process.env.ENVIRONMENT_CONFIG}`;

// Ensure the directory exists, or create it if it doesn't.
fs.mkdirSync(dir, { recursive: true });

// Construct the full file path.
const filePath = path.join(dir, file);

try {
  fs.writeFileSync(filePath, content);
  console.log("Created successfully");
} catch (error) {
  console.error(error);
  process.exit(1);
}
