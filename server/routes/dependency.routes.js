import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// tạo __dirname cho ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORT_PATH = path.join(
    __dirname,
    "../../tools/output/dependency-report.json"
);

const PACKAGE_PATH = path.join(__dirname, "../../package.json");

// helper đọc JSON an toàn
function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// 📦 Full report
router.get("/dependencies", (req, res) => {
    try {
        res.json(readJson(REPORT_PATH));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Cannot read dependency report" });
    }
});

// 📚 Libraries summary
router.get("/libraries", (req, res) => {
    try {
        const report = readJson(REPORT_PATH);
        const pkg = readJson(PACKAGE_PATH);

        const versions = {
            ...pkg.dependencies,
            ...pkg.devDependencies,
        };

        const map = {};

        report.usages.forEach((u) => {
            if (!map[u.library]) map[u.library] = [];
            map[u.library].push(u);
        });

        const result = Object.entries(map).map(([lib, uses]) => ({
            name: lib,
            version: versions[lib] || "unknown",
            filesUsing: uses.length,
        }));

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Cannot build libraries summary" });
    }
});

// 🔍 One library detail
router.get("/library/:name", (req, res) => {
    try {
        const report = readJson(REPORT_PATH);
        const libName = decodeURIComponent(req.params.name);
        const list = report.usages.filter((u) => u.library === libName);
        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Cannot get library detail" });
    }
});

// 🧟 Dead libraries
router.get("/dead-libraries", (req, res) => {
    try {
        const report = readJson(REPORT_PATH);
        const pkg = readJson(PACKAGE_PATH);

        const allDeps = {
            ...pkg.dependencies,
            ...pkg.devDependencies,
        };

        const used = new Set(report.usages.map((u) => u.library));
        const dead = Object.keys(allDeps).filter((d) => !used.has(d));

        res.json(dead);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Cannot compute dead libraries" });
    }
});

router.get("/report", (req, res) => {
    const report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf-8"));

    res.json({
        filesScanned: report.filesScanned || 0,
        totalLibraries: report.totalLibraries || 0,
        unknownImports: report.unknownImports || [],
        usages: report.usages || []
    });
});


export default router;
