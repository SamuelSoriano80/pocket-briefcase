import { Link } from "react-router-dom";

function Header() {

    return (

        <header className="header">

            <Link to="/dashboard" className="logo">

                Pocket Briefcase

            </Link>

            <div className="header-right">

                <span>Welcome</span>

                <button>

                    Logout

                </button>

            </div>

        </header>

    );

}

export default Header;