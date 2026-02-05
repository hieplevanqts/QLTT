import { useEffect, useMemo, useRef, useState } from "react";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";

type Library = {
    name: string;
    version: string;
    filesUsing: number;
};

type FileUsage = {
    library: string;
    file: string;
    line: number;
};

export function LibraryUsageTable() {
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [selectedLib, setSelectedLib] = useState<string | null>(null);
    const [files, setFiles] = useState<FileUsage[]>([]);
    const [allFiles, setAllFiles] = useState<FileUsage[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const lastRequestRef = useRef(0);

    useEffect(() => {
        fetch("http://localhost:7788/dependency-manager/libraries")
            .then((res) => res.json())
            .then((data) => {
                setLibraries(data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredLibraries = useMemo(() => {
        return libraries.filter((lib) =>
            lib.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [libraries, search]);

    const totalPages = Math.ceil(filteredLibraries.length / rowsPerPage);
    const paginatedLibraries = filteredLibraries.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const getPageNumbers = () => {
        const pages = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + 4);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    const openLibraryDetail = async (libName: string) => {
        const requestId = Date.now();
        lastRequestRef.current = requestId;

        setSelectedLib(libName);
        setFiles([]);
        setAllFiles([]);
        setModalOpen(true);
        setModalLoading(true);

        try {
            const res = await fetch(
                `http://localhost:7788/dependency-manager/library/${encodeURIComponent(
                    libName
                )}`
            );
            const data = await res.json();

            if (lastRequestRef.current === requestId) {
                setFiles(data || []);
                setAllFiles(data || []);
            }
        } finally {
            if (lastRequestRef.current === requestId) {
                setModalLoading(false);
            }
        }
    };

    if (loading) return <div className="p-6 text-gray-500 text-sm">Loading...</div>;

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold">Library Usage</h2>
                    <input
                        type="text"
                        placeholder="Search library..."
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="text-left px-4 py-3">Library</th>
                            <th className="text-left px-4 py-3">Version</th>
                            <th className="text-right px-4 py-3">Files Using</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedLibraries.map((lib) => (
                            <tr key={lib.name} className="border-t hover:bg-gray-50 transition">
                                <td className="px-4 py-3 font-medium">{lib.name}</td>
                                <td className="px-4 py-3 text-gray-500">{lib.version}</td>
                                <td
                                    className="px-4 py-3 text-right text-blue-600 font-medium cursor-pointer hover:underline"
                                    onClick={() => openLibraryDetail(lib.name)}
                                >
                                    {lib.filesUsing}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER CONTROLS */}
                <div className="flex justify-between items-center mt-6">
                    {/* LEFT: Rows per page */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    {/* RIGHT: Pagination */}
                    <div className="flex items-center gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-100 disabled:opacity-30"
                        >
                            <LeftOutlined />
                        </button>

                        {getPageNumbers().map((num) => (
                            <button
                                key={num}
                                onClick={() => setCurrentPage(num)}
                                className={`w-9 h-9 rounded-md text-sm font-medium border ${
                                    currentPage === num
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                {num}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-100 disabled:opacity-30"
                        >
                            <RightOutlined />
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="w-[1000px] max-h-[700px] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <div>
                                <h3 className="font-semibold text-lg">{selectedLib}</h3>
                                <p className="text-sm text-gray-500">{files.length} occurrences</p>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-100"
                            >
                                <CloseOutlined />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto">
                            {modalLoading ? (
                                <div className="p-8 text-center text-gray-500">Loading...</div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="text-left px-4 py-3">File</th>
                                        <th className="text-left px-2 py-3 w-[50px]">Line</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {files.map((f, i) => (
                                        <tr key={i} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2 text-blue-700 font-medium">
                                                {f.file}
                                            </td>
                                            <td className="px-2 py-2 text-gray-500">{f.line}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
