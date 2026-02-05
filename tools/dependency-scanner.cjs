const fs = require("fs");
const path = require("path");
const glob = require("glob");
const ts = require("typescript");

const PROJECT_ROOT = process.cwd();
const SRC_PATH = path.join(PROJECT_ROOT, "src");

console.log("📂 Using source folder:", SRC_PATH);

// ===== PACKAGE.JSON =====
const pkg = JSON.parse(
    fs.readFileSync(path.join(PROJECT_ROOT, "package.json"), "utf-8")
);

const allDeps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {})
};

// ===== FILE LIST =====
const files = glob.sync("**/*.{js,jsx,ts,tsx}", {
    cwd: SRC_PATH,
    absolute: true,
    ignore: ["**/*.d.ts", "**/node_modules/**"]
});

console.log(`📦 Found ${Object.keys(allDeps).length} libraries in package.json`);
console.log(`🔍 Scanning ${files.length} source files...\n`);

const usages = [];
const unknownImports = new Set();

// ===== NORMALIZE LIB NAME =====
function normalizePackage(lib) {
    if (!lib) return null;

    // Bỏ relative import
    if (lib.startsWith(".") || lib.startsWith("/")) return null;

    // Bỏ asset
    if (lib.match(/\.(css|png|jpg|svg)$/)) return null;

    // Bỏ alias nội bộ
    if (lib.startsWith("@/") || lib.startsWith("figma:")) return null;

    // Lấy package gốc
    if (lib.includes("/")) {
        const parts = lib.split("/");
        lib = lib.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
    }

    return lib;
}

// ===== SCAN FILE USING TYPESCRIPT AST =====
function scanFile(filePath) {
    const sourceCode = fs.readFileSync(filePath, "utf-8");

    const sourceFile = ts.createSourceFile(
        filePath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true
    );

    function visit(node) {
        if (ts.isImportDeclaration(node) && node.moduleSpecifier?.text) {
            const raw = node.moduleSpecifier.text;
            const lib = normalizePackage(raw);
            if (!lib) return;

            if (!allDeps[lib]) unknownImports.add(lib);

            const { line } = sourceFile.getLineAndCharacterOfPosition(
                node.getStart()
            );

            usages.push({
                library: lib,
                file: path.relative(PROJECT_ROOT, filePath),
                line: line + 1
            });
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
}

// ===== LOOP FILES =====
files.forEach((file) => {
    try {
        scanFile(file);
    } catch (err) {
        console.log("❌ Parse error in:", file);
    }
});

// ===== OUTPUT REPORT =====
const OUTPUT_DIR = path.join(PROJECT_ROOT, "tools", "output");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const report = {
    generatedAt: new Date().toISOString(),
    project: path.basename(PROJECT_ROOT),
    summary: {
        totalLibraries: Object.keys(allDeps).length,
        totalSourceFilesScanned: files.length,
        totalImportUsages: usages.length
    },
    usages,
    unknownImports: Array.from(unknownImports)
};

fs.writeFileSync(
    path.join(OUTPUT_DIR, "dependency-report.json"),
    JSON.stringify(report, null, 2)
);

if (report.unknownImports.length) {
    console.log("\n⚠️ Unknown imports:");
    report.unknownImports.forEach((u) => console.log("  -", u));
} else {
    console.log("🎉 No unknown imports found!");
}

console.log("\n✅ Dependency report generated:");
console.log(path.join(OUTPUT_DIR, "dependency-report.json"));
