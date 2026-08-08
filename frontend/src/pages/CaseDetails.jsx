import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getCase,
    getCasePeople,
    getCaseEvidence
} from "../services/caseService";

import Layout from "../components/layout/Layout";

import SearchBar from "../components/SearchBar";
import Notification from "../components/Notification";
import { useNotification } from "../hooks/useNotification";


function CaseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [myCase, setMyCase] = useState(null);
    const [people, setPeople] = useState([]);
    const [displayedPeople, setDisplayedPeople] = useState([]);

    const [evidence, setEvidence] = useState([]);
    const [displayedEvidence, setDisplayedEvidence] = useState([]);

    const [notification] = useNotification();
    const peopleNotification = notification?.section === "people" ? notification : null;
    const evidenceNotification = notification?.section === "evidence" ? notification : null;

    useEffect(() => {
        async function loadCaseData() {
            try {
                const caseData = await getCase(id);
                setMyCase(caseData);
            }
            catch (err) {
                console.error(err);
            }

            try {
                const peopleData = await getCasePeople(id);
                setPeople(peopleData);
                setDisplayedPeople(peopleData);
            }
            catch (err) {
                console.error(err);
                setPeople([]);
                setDisplayedPeople([]);
            }

            try {
                const evidenceData = await getCaseEvidence(id);
                setEvidence(evidenceData);
                setDisplayedEvidence(evidenceData);
            }
            catch (err) {
                console.error(err);
                setEvidence([]);
                setDisplayedEvidence([]);
            }
        }
        loadCaseData();
    }, [id]);

    if (!myCase) {
        return <h2>Loading...</h2>;
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
                        <h1>{myCase.title}</h1>
                        <button className="edit-button"
                            onClick={() => navigate(`/cases/edit/${id}`)}
                        >
                            Edit Case
                        </button>
                    </div>

                    <p><strong>Case Number:</strong> {myCase.case_number}</p>
                    <p><strong>Status:</strong> {myCase.status}</p>
                    <p><strong>Court:</strong> {myCase.court_name}</p>
                    <p><strong>Filing Date:</strong> {myCase.filing_date}</p>
                    <br />

                    <h3>Description</h3>
                    <p>{myCase.description || "No description available."}</p>
                    <br />

                    <h3>Notes</h3>
                    <p>{myCase.notes || "No notes available."}</p>
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
                        <div style={{ flex: 1 }}>
                            <h2>People Involved</h2>
                        </div>

                        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                            <SearchBar
                                data={people}
                                getLabel={(item) => item.name}
                                onSelect={(item) => setDisplayedPeople([item])}
                                onReset={() => setDisplayedPeople(people)}
                                placeholder="Search by name..."
                            />
                        </div>

                        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                            <button className="add-button"
                                onClick={() => navigate(`/cases/${id}/people/new`)}
                            >
                                + Add Person
                            </button>
                        </div>
                    </div>

                    <Notification notification={peopleNotification} />

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            displayedPeople.length === 0 ?
                            (
                                <tr>
                                    <td colSpan="2">
                                        No people assigned yet.
                                    </td>
                                </tr>
                            )
                            :
                            displayedPeople.map(cp => (
                                <tr key={cp.id}>
                                    <td>{cp.name}</td>
                                    <td>{cp.role || "-"}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
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
                        <div style={{ flex: 1 }}>
                            <h2>Evidence</h2>
                        </div>

                        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                            <SearchBar
                                data={evidence}
                                getLabel={(item) => item.title}
                                onSelect={(item) => setDisplayedEvidence([item])}
                                onReset={() => setDisplayedEvidence(evidence)}
                                placeholder="Search by title..."
                            />
                        </div>

                        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                            <button className="add-button"
                                onClick={() => navigate(`/cases/${id}/evidence/new`)}
                            >
                                + Add Evidence
                            </button>
                        </div>
                    </div>

                    <Notification notification={evidenceNotification} />

                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Collected</th>
                            </tr>
                        </thead>

                        <tbody>
                        {
                            displayedEvidence.length === 0 ?
                            (
                                <tr>
                                    <td colSpan="3">
                                        No evidence assigned yet.
                                    </td>
                                </tr>
                            )
                            :
                            displayedEvidence.map(item => (
                                <tr
                                    key={item.id}
                                    onClick={() => navigate(`/evidence/${item.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{item.title}</td>
                                    <td>{item.evidence_type}</td>
                                    <td>{item.collected_date || "-"}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
                <br />

                <div className="card">

                    <h2>Case Events</h2>

                    <p style={{ marginBottom: "20px" }}>
                        Review the history of the case or manage upcoming
                        court events.
                    </p>

                    <button
                        onClick={() => navigate(`/cases/${id}/timeline`)}
                    >
                        View Case Timeline
                    </button>

                    {" "}

                    <button
                        onClick={() => navigate(`/cases/${id}/court-timeline`)}
                    >
                        View Court Timeline
                    </button>

                </div>
                <br />

                <button className="cancel-button"
                    onClick={() => navigate("/cases")}
                >
                    ← Back to Cases
                </button>
            </div>
        </Layout>
    );
}

export default CaseDetails;