import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { getPerson, deletePerson } from "../services/personService";
import Layout from "../components/layout/Layout";

function PersonDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const caseId = searchParams.get("caseId");

    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function loadPerson() {
            try {
                const data = await getPerson(id);
                setPerson(data);
            } catch (err) {
                console.error(err);
                setError("Could not load person.");
            } finally {
                setLoading(false);
            }
        }

        loadPerson();
    }, [id]);

    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this person? This cannot be undone."
        );
        if (!confirmed) return;

        setDeleting(true);
        try {
            await deletePerson(id);

            if (caseId) {
                navigate(`/cases/${caseId}`, {
                    state: {
                        notification: {
                            type: "deleted",
                            message: "Person deleted successfully!",
                            section: "people"
                        }
                    }
                });
            } else {
                navigate("/cases");
            }
        } catch (err) {
            console.error(err);
            setError("Could not delete person.");
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

    if (error || !person) {
        return (
            <Layout>
                <div className="page">
                    <p>{error || "Person not found."}</p>
                    <button className="cancel-button"
                        onClick={() => navigate("/cases")}>
                        ← Back to Cases
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="page">
                <div className="card" style={{ marginBottom: "20px" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px"
                        }}
                    >
                        <h1>{person.first_name} {person.last_name}</h1>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                className="edit-button"
                                onClick={() =>
                                    navigate(`/people/edit/${id}${caseId ? `?caseId=${caseId}` : ""}`)
                                }
                            >
                                Edit Person
                            </button>
                            <button className="delete-button" onClick={handleDelete} disabled={deleting}>
                                {deleting ? "Deleting..." : "Delete Person"}
                            </button>
                        </div>
                    </div>

                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Phone</span>
                            <span className="info-value">{person.phone || "Not specified"}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Email</span>
                            <span className="info-value">{person.email || "Not specified"}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Address</span>
                            <span className="info-value">{person.address || "Not specified"}</span>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3 className="section-title">Notes</h3>
                        <p className="section-text">{person.notes || "No notes available."}</p>
                    </div>
                </div>

                <button className="cancel-button"
                    onClick={() =>
                        navigate(caseId ? `/cases/${caseId}` : "/cases")
                    }>
                    ← Back to {caseId ? "Case" : "Cases"}
                </button>
            </div>
        </Layout>
    );
}

export default PersonDetails;