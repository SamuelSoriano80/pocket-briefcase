import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getEvidence,
    createEvidence,
    updateEvidence
} from "../services/evidenceService";

import Layout from "../components/layout/Layout";

function EvidenceForm() {
    const { caseId, id } = useParams();
    const navigate = useNavigate();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        case_id: caseId ? Number(caseId) : null,
        title: "",
        description: "",
        evidence_type: "",
        file_path: "",
        collected_date: "",
        notes: ""
    });

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isEditMode) return;

        async function loadEvidence() {
            try {
                const data = await getEvidence(id);
                setFormData({
                    case_id: data.case_id,
                    title: data.title || "",
                    description: data.description || "",
                    evidence_type: data.evidence_type || "",
                    file_path: data.file_path || "",
                    collected_date: data.collected_date || "",
                    notes: data.notes || ""
                });
            } catch (err) {
                console.error(err);
                setError("Could not load evidence.");
            } finally {
                setLoading(false);
            }
        }

        loadEvidence();
    }, [id, isEditMode]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (isEditMode) {
                await updateEvidence(id, formData);
                navigate(`/cases/${formData.case_id}`, {
                    state: {
                        notification: {
                            type: "edited",
                            message: "Evidence updated successfully!",
                            section: "evidence"
                        }
                    }
                });
            } else {
                const created = await createEvidence(formData);
                navigate(`/cases/${created.case_id}`, {
                    state: {
                        notification: {
                            type: "created",
                            message: "Evidence created successfully!",
                            section: "evidence"
                        }
                    }
                });
            }
        } catch (err) {
            console.error(err);
            setError("Could not save evidence. Please check the fields and try again.");
            setSaving(false);
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

    return (
        <Layout>
            <div className="page">
                <div className="card">
                    <h1 style={{ marginBottom: "20px" }}>
                        {isEditMode ? "Edit Evidence" : "Add Evidence"}
                    </h1>

                    {error && <p>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <label>Title: *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            placeholder="Description of the evidence"
                            onChange={handleChange}
                        />

                        <label>Evidence Type: *</label>
                        <input
                            type="text"
                            name="evidence_type"
                            value={formData.evidence_type}
                            onChange={handleChange}
                            placeholder="e.g. document, video, photo"
                            required
                        />

                        <label>File Path / URL:</label>
                        <input
                            type="text"
                            name="file_path"
                            placeholder="e.g. /path/to/file or https://example.com/file"
                            value={formData.file_path}
                            onChange={handleChange}
                        />

                        <label>Collected Date: *</label>
                        <input
                            type="date"
                            name="collected_date"
                            value={formData.collected_date}
                            onChange={handleChange}
                            required
                        />

                        <label>Notes:</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            placeholder="Any additional notes about the evidence"
                            onChange={handleChange}
                        />

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "10px"
                            }}
                        >
                            <button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save Evidence"}
                            </button>

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => navigate(`/cases/${formData.case_id || caseId}`)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default EvidenceForm;