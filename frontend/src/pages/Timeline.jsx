import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/layout/Layout";

import { getCase } from "../services/caseService";
import {
getCaseTimeline,
deleteTimelineEvent
} from "../services/timelineService";

function Timeline() {

const { id } = useParams();

const navigate = useNavigate();

const [myCase, setMyCase] = useState(null);

const [events, setEvents] = useState([]);

const [loading, setLoading] = useState(true);

const [error, setError] = useState("");


async function loadTimeline() {

    try {

        const caseData = await getCase(id);

        setMyCase(caseData);


        const timelineData = await getCaseTimeline(id);

        setEvents(timelineData);

    }

    catch (error) {

        console.error(error);

        setError("Could not load the case timeline.");

    }

    finally {

        setLoading(false);

    }

}


useEffect(() => {

    loadTimeline();

}, [id]);


async function handleDelete(eventId) {

    if (!window.confirm("Delete this timeline event?")) {

        return;

    }

    try {

        await deleteTimelineEvent(eventId);

        const data = await getCaseTimeline(id);

        setEvents(data);

    }

    catch (error) {

        console.error(error);

        alert("Could not delete the timeline event.");

    }

}


if (loading) {

    return <h2>Loading...</h2>;

}


if (error) {

    return <h2>{error}</h2>;

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

                    <div>

                        <h1>Case Timeline</h1>

                        <p>

                            <strong>{myCase.title}</strong>

                            {" · "}

                            {myCase.case_number}

                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate(`/cases/${id}/timeline/new`)
                        }
                    >
                        + Add Event
                    </button>

                </div>


                {events.length === 0 ? (

                    <p>No timeline events have been recorded yet.</p>

                ) : (

                    <div>

                        {events.map((event) => (

                            <div
                                key={event.id}
                                style={{
                                    borderLeft: "3px solid #1f3a5f",
                                    paddingLeft: "20px",
                                    marginBottom: "25px"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}
                                >

                                    <div>

                                        <h3>
                                            {event.title}
                                        </h3>

                                        <p>
                                            <strong>
                                                {new Date(
                                                    event.event_date
                                                ).toLocaleString()}
                                            </strong>
                                        </p>

                                    </div>


                                    {event.event_type && (

                                        <span>
                                            {event.event_type}
                                        </span>

                                    )}

                                </div>


                                <p>

                                    {event.description ||
                                        "No description provided."}

                                </p>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/cases/${id}/timeline/edit/${event.id}`
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                {" "}

                                <button
                                    onClick={() =>
                                        handleDelete(event.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        ))}

                    </div>

                )}


                <button
                    onClick={() => navigate(`/cases/${id}`)}
                >
                    ← Back to Case
                </button>

            </div>

        </div>

    </Layout>

);

}

export default Timeline;