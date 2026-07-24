import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    return (

        <div>

            <h1>Dashboard</h1>

            <p>Welcome to Pocket Briefcase.</p>

            <button
                onClick={() => navigate("/cases")}
            >

                Go to Cases

            </button>

        </div>

    );

}

export default Dashboard;