import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout({ children }) {

    return (

        <div className="layout">

            <Header />

            <div className="layout-body">

                <Sidebar />

                <main className="content">

                    {children}

                </main>

            </div>

        </div>

    );

}

export default Layout;