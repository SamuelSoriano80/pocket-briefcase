import { useEffect, useState } from "react";
import { getCases } from "../services/caseService";
import { useNavigate } from "react-router-dom";
import { deleteCase } from "../services/caseService";

import Layout from "../components/layout/Layout";

import SearchBar from "../components/SearchBar";
import Notification from "../components/Notification";
import { useNotification } from "../hooks/useNotification";

function Cases() {
    const [cases, setCases] = useState([]);
    const [displayedCases, setDisplayedCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [notification, setNotification] = useNotification();

    useEffect(() => {
        async function loadCases() {
            try {
                const data = await getCases();
                setCases(data);
                setDisplayedCases(data);
            }

            catch {
                setError("Could not load cases.");
            }

            finally {
                setLoading(false);
            }
        }

        loadCases();
    }, []);

    async function handleDelete(id) {
        if (!window.confirm("Delete this case?")) {
            return;
        }

        await deleteCase(id);
        const data = await getCases();
        setCases(data);
        setDisplayedCases(data);

        setNotification({
            type: "deleted",
            message: "Case deleted successfully!"
        });
    }

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <Layout>
            <div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}
                >
                    <h1>Cases</h1>

                    <button className="add-button"
                        onClick={() => navigate("/cases/new")}
                        >Create New Case
                    </button>
                </div>

                <Notification notification={notification} />

                <div style={{ marginBottom: "20px" }}>
                    <SearchBar
                        data={cases}
                        getLabel={(item) => item.title}
                        onSelect={(item) => setDisplayedCases([item])}
                        onReset={() => setDisplayedCases(cases)}
                        placeholder="Search by case title..."
                    />
                </div>

                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Case Number</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Court</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                    {displayedCases.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => navigate(`/cases/${item.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <td>{item.case_number}</td>
                            <td>{item.title}</td>
                            <td>{item.status}</td>
                            <td>{item.court_name}</td>
                            <td>
                                <button
                                    className="edit-button"
                                    style={{ marginRight: "5px", padding: "10px" }}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        navigate(`/cases/edit/${item.id}`);
                                    }}
                                >
                                    Edit
                                </button>

                                {" "}

                                <button
                                    className="delete-button"
                                    style={{ padding: "10px" }}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleDelete(item.id);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default Cases;