import { useEffect, useState } from "react";
import { SummaryCards } from "./SummaryCards";
import { UnknownImportsTable } from "./UnknownImportsTable";
import { LibraryUsageTable } from "./LibraryUsageTable";

interface Report {
    totalLibraries: number;
    totalFilesScanned: number;
    unknownImports: string[];
    libraryUsage: Record<string, string[]>;
}

export const ModuleDependencyManager = () => {
    const [report, setReport] = useState<Report | null>(null);

    useEffect(() => {
        fetch("http://localhost:7788/dependency-manager/report")
            .then((res) => res.json())
            .then(setReport)
            .catch(console.error);
    }, []);

    if (!report)
        return (
            <div style={{ padding: 40, color: "#333", background: "#fff", minHeight: "100vh" }}>
                Loading dependency report...
            </div>
        );

    return (
        <div
            style={{
                padding: 32,
                background: "#f8fafc", // nền sáng dịu mắt
                minHeight: "100vh",
                color: "#111",
                fontFamily: "Inter, system-ui, sans-serif"
            }}
        >
            {/* HEADER */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
                    Module Dependency Manager
                </h1>
                <div style={{ color: "#64748b", fontSize: 14 }}>
                    Track libraries, versions, file usage, and unused dependencies
                </div>
            </div>

            {/* CONTENT */}
            <div style={{ display: "grid", gap: 24 }}>
                <SummaryCards report={report} />
                <LibraryUsageTable usage={report.libraryUsage} />
                <UnknownImportsTable unknown={report.unknownImports} />
            </div>
        </div>
    );
};
