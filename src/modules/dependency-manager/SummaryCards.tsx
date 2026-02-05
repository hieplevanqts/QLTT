import { useEffect, useState } from "react";

export function SummaryCards() {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = import.meta.env.VITE_PUBLIC_URL || "https://mappa.couppa.com";
    useEffect(() => {
        fetch(`${baseUrl}/dependency-manager/report`)
            .then((res) => res.json())
            .then((data) => {
                setReport(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div style={{ color: "#64748b", padding: 16 }}>Loading summary...</div>;
    }

    if (!report) {
        return <div style={{ color: "#64748b", padding: 16 }}>No data available</div>;
    }

    const totalFiles = report.filesScanned || 0;
    const totalLibraries = report.totalLibraries || 0;
    const unknownImports = report.unknownImports?.length || 0;
    const usages = report.usages?.length || 0;

    const Card = ({ title, value }: { title: string; value: number }) => (
        <div
            style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
        >
            <div style={{ color: "#64748b", fontSize: 13, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#111" }}>{value}</div>
        </div>
    );

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
                marginBottom: 24
            }}
        >
            <Card title="Files Scanned" value={totalFiles} />
            <Card title="Libraries Found" value={totalLibraries} />
            <Card title="Library Usages" value={usages} />
            <Card title="Unknown Imports" value={unknownImports} />
        </div>
    );
}
