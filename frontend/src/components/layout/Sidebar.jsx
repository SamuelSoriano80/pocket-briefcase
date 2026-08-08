import { NavLink } from "react-router-dom";

function Sidebar() {

    return (

        <aside className="sidebar">

            <NavLink
                to="/cases"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
            >
                Cases
            </NavLink>

            <NavLink
                to="/upcoming-events"
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
            >
                Upcoming Events
            </NavLink>

        </aside>

    );

}

export default Sidebar;