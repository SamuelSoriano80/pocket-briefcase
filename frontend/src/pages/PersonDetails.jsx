import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPerson, deletePerson } from "../services/personService";
import Layout from "../components/layout/Layout";

function PersonDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

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
            navigate("/cases");
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
                        <h1>{person.first_name} {person.last_name}</h1>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={() => navigate(`/people/edit/${id}`)}
                            >
                                Edit Person
                            </button>
                            <button onClick={handleDelete} disabled={deleting}>
                                {deleting ? "Deleting..." : "Delete Person"}
                            </button>
                        </div>
                    </div>

                    <p><strong>Phone:</strong> {person.phone || "Not specified"}</p>
                    <p><strong>Email:</strong> {person.email || "Not specified"}</p>
                    <p><strong>Address:</strong> {person.address || "Not specified"}</p>
                    <br />

                    <h3>Notes</h3>
                    <p>{person.notes || "No notes available."}</p>
                </div>
                <br />

                <button onClick={() => navigate("/cases")}>
                    ← Back to Cases
                </button>
            </div>
        </Layout>
    );
}

export default PersonDetails;