import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getPerson,
    createPerson,
    updatePerson
} from "../services/personService";

import { createCasePerson } from "../services/casePersonService";

import Layout from "../components/layout/Layout";

function PersonForm() {
    const { caseId, id } = useParams();
    const navigate = useNavigate();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address: "",
        notes: ""
    });

    const [role, setRole] = useState("");

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isEditMode) return;

        async function loadPerson() {
            try {
                const data = await getPerson(id);
                setFormData({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    phone: data.phone || "",
                    email: data.email || "",
                    address: data.address || "",
                    notes: data.notes || ""
                });
            } catch (err) {
                console.error(err);
                setError("Could not load person.");
            } finally {
                setLoading(false);
            }
        }

        loadPerson();
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
                await updatePerson(id, formData);
                navigate(`/cases/${caseId}`, {
                    state: {
                        notification: {
                            type: "edited",
                            message: "Person updated successfully!",
                            section: "people"
                        }
                    }
                });
            } else {
                const createdPerson = await createPerson(formData);

                await createCasePerson({
                    case_id: Number(caseId),
                    person_id: createdPerson.id,
                    role: role || null
                });

                navigate(`/cases/${caseId}`, {
                    state: {
                        notification: {
                            type: "created",
                            message: "Person created successfully!",
                            section: "people"
                        }
                    }
                });
            }
        } catch (err) {
            console.error(err);
            setError("Could not save person. Please check the fields and try again.");
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
                        {isEditMode ? "Edit Person" : "Add Person"}
                    </h1>

                    {error && <p>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <label>First Name: *</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />

                        <label>Last Name: *</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />

                        <label>Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            placeholder="e.g. +1 234 567 890"
                            onChange={handleChange}
                        />

                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="e.g. leonard.diggo@example.com"
                            onChange={handleChange}
                        />

                        <label>Address:</label>
                        <input
                            type="address"
                            name="address"
                            value={formData.address}
                            placeholder="e.g. 123 Main St, Anytown, USA"
                            onChange={handleChange}
                        />

                        <label>Notes:</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            placeholder="Any additional notes about the person"
                            onChange={handleChange}
                        />

                        {!isEditMode && (
                            <>
                                <label>Role in this Case: *</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. witness, client, investigator"
                                    required
                                />
                            </>
                        )}

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "10px"
                            }}
                        >
                            <button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save Person"}
                            </button>

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => navigate(`/cases/${caseId}`)}
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

export default PersonForm;