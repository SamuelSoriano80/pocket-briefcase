import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

function Dashboard() {

    const navigate = useNavigate();

    return (

        <Layout>
            <div>
        
                <h1>Dashboard</h1>
        
                <p>Welcome to Pocket Briefcase.</p>
        
                <button
                    onClick={() => navigate("/cases")}
                >
                
                    Go to Cases
        
                </button>
        
            </div>
        </Layout>

    );

}

export default Dashboard;