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

            }

            else {

                await createCase(form);

            }

            navigate("/cases");

        }

        catch (error) {

            console.error(error);

            alert("Could not save the case.");

        }

    }

    return (

        <Layout>
            <div>

                <h1>

                    {editing ? "Edit Case" : "Create Case"}

                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                        name="case_number"
                        placeholder="Case Number"
                        value={form.case_number}
                        onChange={handleChange}
                        required
                    />

                    <br /><br />

                    <input
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    <br /><br />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <input
                        name="status"
                        placeholder="Status"
                        value={form.status}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <input
                        name="court_name"
                        placeholder="Court"
                        value={form.court_name}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <input
                        type="date"
                        name="filing_date"
                        value={form.filing_date}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <textarea
                        name="notes"
                        placeholder="Notes"
                        value={form.notes}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <button type="submit">

                        {editing ? "Save Changes" : "Create Case"}

                    </button>

                </form>

            </div>
        </Layout>
    );

}

export default CaseForm;