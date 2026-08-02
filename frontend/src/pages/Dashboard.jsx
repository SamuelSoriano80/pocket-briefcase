import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCases } from "../services/caseService";
import Layout from "../components/layout/Layout";

function Dashboard() {
    const navigate = useNavigate();

    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadCases() {
            try {
                const data = await getCases();
                setCases(data);
            } catch (err) {
                console.error(err);
                setError("Could not load cases.");
            } finally {
                setLoading(false);
            }
        }

        loadCases();
    }, []);

    const totalCases = cases.length;
    const openCases = cases.filter((c) => c.status.toLowerCase() === "open").length;
    const closedCases = cases.filter((c) => c.status.toLowerCase() === "closed").length;

    const recentCases = [...cases]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    return (
        <Layout>
            <div className="page">
                <div className="card">
                    <h1>Welcome to Pocket Briefcase</h1>
                    <p>Here's a quick overview of your cases.</p>
                </div>

                <br />

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap"
                    }}
                >
                    <div className="card" style={{ flex: 1, minWidth: "150px" }}>
                        <h3>Total Cases</h3>
                        <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                            {loading ? "..." : totalCases}
                        </p>
                    </div>

                    <div className="card" style={{ flex: 1, minWidth: "150px" }}>
                        <h3>Open</h3>
                        <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                            {loading ? "..." : openCases}
                        </p>
                    </div>

                    <div className="card" style={{ flex: 1, minWidth: "150px" }}>
                        <h3>Closed</h3>
                        <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                            {loading ? "..." : closedCases}
                        </p>
                    </div>
                </div>

                <br />

                <div className="card">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px"
                        }}
                    >
                        <h2>Recent Cases</h2>
                        <button onClick={() => navigate("/cases")}>
                            View All Cases
                        </button>
                    </div>

                    {error && <p>{error}</p>}

                    {!loading && !error && recentCases.length === 0 && (
                        <p>No cases yet.</p>
                    )}

                    {!loading && recentCases.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Case Number</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentCases.map((c) => (
                                    <tr
                                        key={c.id}
                                        onClick={() => navigate(`/cases/${c.id}`)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td>{c.case_number}</td>
                                        <td>{c.title}</td>
                                        <td>{c.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;