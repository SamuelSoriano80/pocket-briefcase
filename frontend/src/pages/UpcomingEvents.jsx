import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/layout/Layout";

import { getUpcomingCourtEvents } from "../services/courtEventService";

function UpcomingEvents() {

const navigate = useNavigate();

const [events, setEvents] = useState([]);

const [loading, setLoading] = useState(true);

const [error, setError] = useState("");


useEffect(() => {

    async function loadEvents() {

        try {

            const data = await getUpcomingCourtEvents();

            setEvents(data);

        }

        catch (error) {

            console.error(error);

            setError("Could not load upcoming events.");

        }

        finally {

            setLoading(false);

        }

    }

    loadEvents();

}, []);


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

                <h1>Upcoming Events</h1>

                <p>
                    Scheduled court events for your cases.
                </p>

                <br />


                {events.length === 0 ? (

                    <p>
                        You have no upcoming court events.
                    </p>

                ) : (

                    <div>

                        {events.map((event) => (

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
                                        justifyContent: "space-between",
                                        alignItems: "center"
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

                                    <strong>Location:</strong>{" "}

                                    {event.location ||
                                        "Location not specified."}

                                </p>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/cases/${event.case_id}`
                                        )
                                    }
                                >
                                    View Case
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    </Layout>

);

}

export default UpcomingEvents;