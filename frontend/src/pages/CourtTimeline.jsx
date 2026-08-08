import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/layout/Layout";

import { getCase } from "../services/caseService";

import {
getCaseCourtEvents,
deleteCourtEvent
} from "../services/courtEventService";

function CourtTimeline() {

const { id } = useParams();

const navigate = useNavigate();

const [myCase, setMyCase] = useState(null);

const [events, setEvents] = useState([]);

const [loading, setLoading] = useState(true);

const [error, setError] = useState("");


async function loadCourtEvents() {

    try {

        const caseData = await getCase(id);

        setMyCase(caseData);


        const courtData = await getCaseCourtEvents(id);

        setEvents(courtData);

    }

    catch (error) {

        console.error(error);

        setError("Could not load the court schedule.");

    }

    finally {

        setLoading(false);

    }

}


useEffect(() => {

    loadCourtEvents();

}, [id]);


async function handleDelete(eventId) {

    if (!window.confirm("Delete this court event?")) {

        return;

    }


    try {

        await deleteCourtEvent(eventId);

        const data = await getCaseCourtEvents(id);

        setEvents(data);

    }

    catch (error) {

        console.error(error);

        alert("Could not delete the court event.");

    }

}


const now = new Date();


const upcomingEvents = events.filter(
    event => new Date(event.event_date) >= now
);


const pastEvents = events.filter(
    event => new Date(event.event_date) < now
);


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

                        <h1>Court Timeline</h1>

                        <p>

                            <strong>
                                {myCase.title}
                            </strong>

                            {" · "}

                            {myCase.case_number}

                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                `/cases/${id}/court-events/new`
                            )
                        }
                    >
                        + Schedule Event
                    </button>

                </div>


                {/* UPCOMING EVENTS */}

                <h2>Upcoming</h2>


                {upcomingEvents.length === 0 ? (

                    <p>
                        No upcoming court events.
                    </p>

                ) : (

                    <div>

                        {upcomingEvents.map((event) => (

                            <div
                                key={event.id}
                                style={{
                                    padding: "20px",
                                    marginBottom: "15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between"
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

                                    <strong>
                                        Location:
                                    </strong>{" "}

                                    {event.location ||
                                        "Location not specified."}

                                </p>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/cases/${id}/court-events/edit/${event.id}`
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


                <br />


                {/* PAST EVENTS */}

                <h2>Past</h2>


                {pastEvents.length === 0 ? (

                    <p>
                        No past court events.
                    </p>

                ) : (

                    <div>

                        {pastEvents.map((event) => (

                            <div
                                key={event.id}
                                style={{
                                    padding: "20px",
                                    marginBottom: "15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between"
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

                                    <strong>
                                        Location:
                                    </strong>{" "}

                                    {event.location ||
                                        "Location not specified."}

                                </p>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/cases/${id}/court-events/edit/${event.id}`
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


                <br />


                <button
                    onClick={() =>
                        navigate(`/cases/${id}`)
                    }
                >
                    ← Back to Case
                </button>

            </div>

        </div>

    </Layout>

);

}

export default CourtTimeline;