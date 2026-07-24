import { useEffect, useState } from "react";

import { getCases } from "../services/caseService";

import { useNavigate } from "react-router-dom";

import { deleteCase } from "../services/caseService";

function Cases() {

    const [cases, setCases] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        async function loadCases() {

            try {
            
                const data = await getCases();
            
                setCases(data);
            
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
        
        }

    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (error) {

        return <h2>{error}</h2>;

    }

    return (

        <div>

            <h1>Cases</h1>

            <button onClick={() => navigate("/cases/new")}>

                Create New Case

            </button>

            <br />
            <br />

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

                {cases.map((item) => (
                
                <tr key={item.id}>
                
                <td>{item.case_number}</td>
                
                <td>{item.title}</td>
                
                <td>{item.status}</td>
                
                <td>{item.court_name}</td>
                
                <td>
                
                <button
                onClick={() => navigate(`/cases/${item.id}`)}
                >
                
                View
                
                </button>
                
                {" "}
                
                <button
                onClick={() => navigate(`/cases/edit/${item.id}`)}
                >
                
                Edit
                
                </button>
                
                {" "}
                
                <button
                onClick={() => handleDelete(item.id)}
                >
                
                Delete
                
                </button>
                
                </td>
                
                </tr>

                ))}

                </tbody>

            </table>

        </div>

    );

}

export default Cases;