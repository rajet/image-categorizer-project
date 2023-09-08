const fs = require("fs");
const dir = "src/environments";
const file = "environment.ts";
const content = `${process.env.ENVIRONMENT_CONFIG}`;
fs.access(dir, fs.constants.F_OK, (err) => {
  if (err) {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

  try {
    fs.writeFileSync(dir + "/" + file, content);
    console.log("Created successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
