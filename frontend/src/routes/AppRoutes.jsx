import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Cases from "../pages/Cases";
import CaseForm from "../pages/CaseForm";
import CaseDetails from "../pages/CaseDetails";
import NotFound from "../pages/NotFound";
import EvidenceForm from "../pages/EvidenceForm";
import EvidenceDetails from "../pages/EvidenceDetails";
import PersonForm from "../pages/PersonForm";
import PersonDetails from "../pages/PersonDetails";


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

                <Route path="/cases/:caseId/evidence/new" element={<EvidenceForm />} />

                <Route path="/evidence/edit/:id" element={<EvidenceForm />} />
                
                <Route path="/evidence/:id" element={<EvidenceDetails />} />

                <Route path="/cases/:caseId/people/new" element={<PersonForm />} />
                
                <Route path="/people/edit/:id" element={<PersonForm />} />
                
                <Route path="/people/:id" element={<PersonDetails />} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;