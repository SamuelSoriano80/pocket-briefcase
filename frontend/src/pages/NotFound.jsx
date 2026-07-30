import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

function NotFound() {

    return (

        <Layout>

            <div>

                <h1>404 - Page Not Found</h1>

                <p>
                    The page you are looking for does not exist.
                </p>

                <Link to="/dashboard">

                    Return to Dashboard

                </Link>

            </div>

        </Layout>

    );

}

export default NotFound;