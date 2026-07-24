import api from "./api";

export async function getCases() {
    const response = await api.get("/cases");
    return response.data;
}

export async function getCase(id) {
    const response = await api.get(`/cases/${id}`);
    return response.data;
}

export async function createCase(caseData) {
    const response = await api.post("/cases", caseData);
    return response.data;
}

export async function updateCase(id, caseData) {
    const response = await api.put(`/cases/${id}`, caseData);
    return response.data;
}

export async function deleteCase(id) {
    await api.delete(`/cases/${id}`);
}