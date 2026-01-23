import path, { dirname } from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { build } from "vite";
import JSZip from "jszip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outDir = path.resolve(__dirname, "../build");

// empty target directory
await fs.rmSync(outDir, { recursive: true, force: true });

// Build
const TARGETS = [
  {
    entry: "src/tl-viz-plotarea-general.ts",
    name: "tl-viz-plotarea-general.js",
  },
  // { entry: "src/SacBuilder.ts", name: "vin-comment-widget-builder.js" },
  // { entry: "src/SacStyling.ts", name: "vin-comment-widget-styling.js" },
];
for (const target of TARGETS) {
  await build({
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    configFile: false,
    envFile: false,
    publicDir: false,
    build: {
      target: "es2019",
      sourcemap: false,
      outDir: outDir,
      emptyOutDir: false,
      minify: false,
      lib: {
        entry: [target.entry],
        name: target.name,
        formats: ["iife"],
      },
      rollupOptions: {
        treeshake: false,
        output: {
          entryFileNames: "[name].js",
          compact: false,
        },
      },
    },
    plugins: [],
  });
}

// copy main.json to target directory
fs.copyFileSync(
  path.resolve(__dirname, "../sac-config.json"),
  path.resolve(outDir, "sac-config.json"),
);

// make zip file for SAC upload
const stringContentMainJson = fs.readFileSync(
  path.resolve(__dirname, "..", "sac-config.json"),
  {
    encoding: "utf-8",
  },
);

const contentMainJson = JSON.parse(stringContentMainJson);
const outZip = new JSZip();
for (const extension of contentMainJson.extensions) {
  for (const webComp of extension.webcomponents) {
    const fileName = webComp.url.split("/").pop();
    outZip.file(fileName, fs.readFileSync(path.resolve(outDir, fileName)));
  }
}

outZip
  .generateNodeStream({
    type: "nodebuffer",
    streamFiles: true,
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  })
  .pipe(fs.createWriteStream(path.resolve(outDir, "custom-widget.zip")));

// delete individual files after zip creation
for (const extension of contentMainJson.extensions) {
  for (const webComp of extension.webcomponents) {
    const fileName = webComp.url.split("/").pop();
    fs.rmSync(path.resolve(outDir, fileName));
  }
}

console.log("Build completed.");
