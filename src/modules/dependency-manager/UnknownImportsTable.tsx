import { useEffect, useState } from "react";

type UnknownImport = {
    import: string;
    file: string;
};

export function UnknownImportsTable() {
    const [unknowns, setUnknowns] = useState<UnknownImport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(window.location.origin + "/dependency-manager/dependencies")
            .then((res) => res.json())
            .then((data) => {
                setUnknowns(data?.unknownImports || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div style={{ color: "#64748b", padding: 16 }}>Loading unknown imports...</div>;
    }

    if (!unknowns.length) {
        return (
            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: 20,
                    color: "#16a34a",
                    marginTop: 24,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}
            >
                🎉 No unknown imports detected
            </div>
        );
    }

    return (
        <div
            style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 20,
                marginTop: 24,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
        >
            <div
                style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 16,
                    color: "#111"
                }}
            >
                Unknown Imports
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>
                        <th style={{ textAlign: "left", padding: "8px 12px" }}>Import</th>
                        <th style={{ textAlign: "left", padding: "8px 12px" }}>File</th>
                    </tr>
                    </thead>
                    <tbody>
                    {unknowns.map((item, i) => (
                        <tr
                            key={i}
                            style={{
                                borderBottom: "1px solid #f1f5f9"
                            }}
                        >
                            <td style={{ padding: "8px 12px", color: "#dc2626", fontWeight: 500 }}>
                                {item.import}
                            </td>
                            <td style={{ padding: "8px 12px", color: "#334155" }}>
                                {item.file}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
