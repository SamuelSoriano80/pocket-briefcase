import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/layout/Layout";

import {
createCourtEvent,
getCourtEvent,
updateCourtEvent
} from "../services/courtEventService";

function CourtEventForm() {

const { id, eventId } = useParams();

const navigate = useNavigate();

const editing = Boolean(eventId);

const [formData, setFormData] = useState({
    title: "",
    event_type: "",
    event_date: "",
    location: ""
});

const [loading, setLoading] = useState(editing);

const [error, setError] = useState("");


useEffect(() => {

    if (!editing) {

        return;

    }

    async function loadEvent() {

        try {

            const event = await getCourtEvent(eventId);

            setFormData({
                title: event.title || "",
                event_type: event.event_type || "",
                event_date: event.event_date
                    ? event.event_date.slice(0, 16)
                    : "",
                location: event.location || ""
            });

        }

        catch (error) {

            console.error(error);

            setError("Could not load the court event.");

        }

        finally {

            setLoading(false);

        }

    }

    loadEvent();

}, [eventId, editing]);


function handleChange(event) {

    const { name, value } = event.target;

    setFormData(previous => ({
        ...previous,
        [name]: value
    }));

}


async function handleSubmit(event) {

    event.preventDefault();

    setError("");

    try {

        const data = {
            case_id: Number(id),
            title: formData.title,
            event_type: formData.event_type || null,
            event_date: formData.event_date,
            location: formData.location || null
        };


        if (editing) {

            await updateCourtEvent(eventId, data);

        }

        else {

            await createCourtEvent(data);

        }


        navigate(`/cases/${id}/court-timeline`);

    }

    catch (error) {

        console.error(error);

        setError("Could not save the court event.");

    }

}


if (loading) {

    return <h2>Loading...</h2>;

}


return (

    <Layout>

        <div className="page">

            <div className="card">

                <h1>
                    {editing
                        ? "Edit Court Event"
                        : "Schedule Court Event"}
                </h1>


                {error && (

                    <p>
                        {error}
                    </p>

                )}


                <form onSubmit={handleSubmit}>

                    <label>
                        Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />


                    <label>
                        Event Type
                    </label>

                    <input
                        type="text"
                        name="event_type"
                        value={formData.event_type}
                        onChange={handleChange}
                        placeholder="Hearing, Deadline, Meeting..."
                    />


                    <label>
                        Date and Time
                    </label>

                    <input
                        type="datetime-local"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleChange}
                        required
                    />


                    <label>
                        Location
                    </label>

                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Courtroom, office, remote..."
                    />


                    <br />

                    <button type="submit">

                        {editing
                            ? "Save Changes"
                            : "Schedule Event"}

                    </button>

                    {" "}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/cases/${id}/court-timeline`)
                        }
                    >
                        Cancel
                    </button>

                </form>

            </div>

        </div>

    </Layout>

);

}

export default CourtEventForm;