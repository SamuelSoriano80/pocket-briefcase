import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { getCase } from "../services/caseService";

function CaseDetails() {

    const { id } = useParams();

    const [myCase, setMyCase] = useState(null);

    useEffect(() => {

        async function loadCase() {

            const data = await getCase(id);

            setMyCase(data);

        }

        loadCase();

    }, []);

    if (!myCase)

        return <h2>Loading...</h2>;

    return (

        <div>

            <h1>{myCase.title}</h1>

            <p>

                <b>Case Number:</b>

                {myCase.case_number}

            </p>

            <p>

                <b>Status:</b>

                {myCase.status}

            </p>

            <p>

                <b>Court:</b>

                {myCase.court_name}

            </p>

            <p>

                <b>Description:</b>

                {myCase.description}

            </p>

            <p>

                <b>Notes:</b>

                {myCase.notes}

            </p>

        </div>

    );

}

export default CaseDetails;