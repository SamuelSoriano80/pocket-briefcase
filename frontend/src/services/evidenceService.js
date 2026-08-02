import api from "./api";

export async function getEvidence(id) {
    const response = await api.get(`/evidence/${id}`);
    return response.data;
}

export async function createEvidence(evidenceData) {
    const response = await api.post("/evidence/", evidenceData);
    return response.data;
}

export async function updateEvidence(id, evidenceData) {
    const response = await api.put(`/evidence/${id}`, evidenceData);
    return response.data;
}

export async function deleteEvidence(id) {
    await api.delete(`/evidence/${id}`);
}