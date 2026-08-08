import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/layout/Layout";

import {
createTimelineEvent,
getTimelineEvent,
updateTimelineEvent
} from "../services/timelineService";

function TimelineEventForm() {

const { id, eventId } = useParams();

const navigate = useNavigate();

const editing = Boolean(eventId);

const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "",
    event_date: ""
});

const [loading, setLoading] = useState(editing);

const [error, setError] = useState("");


useEffect(() => {

    if (!editing) {

        return;

    }

    async function loadEvent() {

        try {

            const event = await getTimelineEvent(eventId);

            setFormData({
                title: event.title || "",
                description: event.description || "",
                event_type: event.event_type || "",
                event_date: event.event_date
                    ? event.event_date.slice(0, 16)
                    : ""
            });

        }

        catch (error) {

            console.error(error);

            setError("Could not load the timeline event.");

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
            description: formData.description || null,
            event_type: formData.event_type || null,
            event_date: formData.event_date
        };


        if (editing) {

            await updateTimelineEvent(eventId, data);

        }

        else {

            await createTimelineEvent(data);

        }


        navigate(`/cases/${id}/timeline`);

    }

    catch (error) {

        console.error(error);

        setError("Could not save the timeline event.");

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
                        ? "Edit Timeline Event"
                        : "Add Timeline Event"}
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
                        placeholder="Investigation, Crime, Witness, Trial..."
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
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                    />


                    <br />

                    <button type="submit">

                        {editing
                            ? "Save Changes"
                            : "Add Event"}

                    </button>

                    {" "}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/cases/${id}/timeline`)
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

export default TimelineEventForm;