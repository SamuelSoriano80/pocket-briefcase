import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEvidence, deleteEvidence } from "../services/evidenceService";
import Layout from "../components/layout/Layout";

function EvidenceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [evidence, setEvidence] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function loadEvidence() {
            try {
                const data = await getEvidence(id);
                setEvidence(data);
            } catch (err) {
                console.error(err);
                setError("Could not load evidence.");
            } finally {
                setLoading(false);
            }
        }

        loadEvidence();
    }, [id]);

    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this piece of evidence? This cannot be undone."
        );
        if (!confirmed) return;

        setDeleting(true);
        try {
            const caseId = evidence.case_id;
            await deleteEvidence(id);
            navigate(`/cases/${caseId}`);
        } catch (err) {
            console.error(err);
            setError("Could not delete evidence.");
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="page">
                    <h2>Loading...</h2>
                </div>
            </Layout>
        );
    }

    if (error || !evidence) {
        return (
            <Layout>
                <div className="page">
                    <p>{error || "Evidence not found."}</p>
                    <button onClick={() => navigate("/cases")}>
                        ← Back to Cases
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="page">
                <div className="card">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px"
                        }}
                    >
                        <h1>{evidence.title}</h1>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={() => navigate(`/evidence/edit/${id}`)}
                            >
                                Edit Evidence
                            </button>
                            <button onClick={handleDelete} disabled={deleting}>
                                {deleting ? "Deleting..." : "Delete Evidence"}
                            </button>
                        </div>
                    </div>

                    <p><strong>Type:</strong> {evidence.evidence_type || "Not specified"}</p>
                    <p><strong>Collected Date:</strong> {evidence.collected_date || "Not specified"}</p>
                    <p>
                        <strong>File:</strong>{" "}
                        {evidence.file_path ? (
                            <a href={evidence.file_path} target="_blank" rel="noreferrer">
                                {evidence.file_path}
                            </a>
                        ) : (
                            "No file attached"
                        )}
                    </p>
                    <br />

                    <h3>Description</h3>
                    <p>{evidence.description || "No description available."}</p>
                    <br />

                    <h3>Notes</h3>
                    <p>{evidence.notes || "No notes available."}</p>
                </div>
                <br />

                <button onClick={() => navigate(`/cases/${evidence.case_id}`)}>
                    ← Back to Case
                </button>
            </div>
        </Layout>
    );
}

export default EvidenceDetails;