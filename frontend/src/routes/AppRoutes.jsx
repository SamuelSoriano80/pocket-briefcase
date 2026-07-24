import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Cases from "../pages/Cases";
import CaseForm from "../pages/CaseForm";
import CaseDetails from "../pages/CaseDetails";
import NotFound from "../pages/NotFound";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/cases" element={<Cases />} />

                <Route path="/cases/new" element={<CaseForm />} />
                
                <Route path="/cases/edit/:id" element={<CaseForm />} />

                <Route path="/cases/:id" element={<CaseDetails />} />

                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;