import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createCase,
    updateCase,
    getCase
} from "../services/caseService";

import Layout from "../components/layout/Layout";

function CaseForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const editing = id !== undefined;
    const [form, setForm] = useState({
        case_number: "",
        title: "",
        description: "",
        status: "Open",
        court_name: "",
        filing_date: "",
        notes: ""
    });

    useEffect(() => {
        if (!editing)
            return;

        async function loadCase() {
            try {
                const data = await getCase(id);

                setForm({
                    case_number: data.case_number ?? "",
                    title: data.title ?? "",
                    description: data.description ?? "",
                    status: data.status ?? "",
                    court_name: data.court_name ?? "",
                    filing_date: data.filing_date ?? "",
                    notes: data.notes ?? ""
                });
            }

            catch (error) {
                console.error(error);
            }
        }

        loadCase();
    }, [editing, id]);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            if (editing) {
                await updateCase(id, form);
                navigate("/cases", {
                    state: {
                        notification: {
                            type: "edited",
                            message: "Case updated successfully!"
                        }
                    }
                });
            }

            else {
                await createCase(form);
                navigate("/cases", {
                    state: {
                        notification: {
                            type: "created",
                            message: "Case created successfully!"
                        }
                    }
                });
            }
        }

        catch (error) {
            console.error(error);
            alert("Could not save the case.");
        }
    }

    return (
        <Layout>
            <div>
                <h1 style={{ marginBottom: "20px" }}>
                    {editing ? "Edit Case" : "Create Case"}
                </h1>
                <form onSubmit={handleSubmit}>

                    {/* Case Number */}
                    <label>Case Number: *</label>
                    <input
                        name="case_number"
                        value={form.case_number}
                        placeholder="e.g. 2026-CR-001"
                        onChange={handleChange}
                        required
                    />

                    {/* Title */}
                    <label>Title: *</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    {/* Description */}
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={form.description}
                        placeholder="Description of the case containing relevant details"
                        onChange={handleChange}
                    />

                    {/* Status */}
                    <label>Status: *</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select a status</option>
                        <option value="Open">Open</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                    </select>

                    {/* Court */}
                    <label>Court: *</label>
                    <input
                        name="court_name"
                        value={form.court_name}
                        placeholder="e.g. Supreme Court"
                        onChange={handleChange}
                        required
                    />

                    {/* Filing Date */}
                    <label>Filing Date: *</label>
                    <input
                        type="date"
                        name="filing_date"
                        value={form.filing_date}
                        onChange={handleChange}
                        required
                    />

                    {/* Notes */}
                    <label>Notes:</label>
                    <textarea
                        name="notes"
                        placeholder="Any additional notes about the case"
                        value={form.notes}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        {editing ? "Save Changes" : "Create Case"}
                    </button>
                </form>
            </div>
        </Layout>
    );
}

export default CaseForm;