import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getCase,
    getCasePeople,
    getCaseEvidence
} from "../services/caseService";

import Layout from "../components/layout/Layout";

function CaseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [myCase, setMyCase] = useState(null);
    const [people, setPeople] = useState([]);

    const [evidence, setEvidence] = useState([]);

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
            }
            catch (err) {
                console.error(err);
                setPeople([]);
            }

            try {
                const evidenceData = await getCaseEvidence(id);
                setEvidence(evidenceData);
            }
            catch (err) {
                console.error(err);
                setEvidence([]);
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
                        <button
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
                        <h2>People Involved</h2>
                        <button
                            onClick={() => navigate(`/cases/${id}/people/new`)}
                        >
                            + Add Person
                        </button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            people.length === 0 ?
                            (
                                <tr>
                                    <td colSpan="2">
                                        No people assigned yet.
                                    </td>
                                </tr>
                            )
                            :
                            people.map(cp => (
                                <tr
                                    key={cp.id}
                                    onClick={() => navigate(`/people/${cp.person_id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>Person #{cp.person_id}</td>
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
                        <h2>Evidence</h2>
                        <button
                            onClick={() => navigate(`/cases/${id}/evidence/new`)}
                        >
                            + Add Evidence
                        </button>
                    </div>

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
                            evidence.length === 0 ?
                            (
                                <tr>
                                    <td colSpan="3">
                                        No evidence assigned yet.
                                    </td>
                                </tr>
                            )
                            :
                            evidence.map(item => (
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

                <button
                    onClick={() => navigate("/cases")}
                >
                    ← Back to Cases
                </button>
            </div>
        </Layout>
    );
}

export default CaseDetails;