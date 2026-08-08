import api from "./api";

export async function getCaseCourtEvents(caseId) {
    const response = await api.get(`/court-events/case/${caseId}`);
    return response.data;
}

export async function getCourtEvent(eventId) {
    const response = await api.get(`/court-events/${eventId}`);
    return response.data;
}

export async function createCourtEvent(event) {
    const response = await api.post("/court-events/", event);
    return response.data;
}

export async function updateCourtEvent(eventId, event) {
    const response = await api.put(`/court-events/${eventId}`, event);
    return response.data;
}

export async function deleteCourtEvent(eventId) {
    const response = await api.delete(`/court-events/${eventId}`);
    return response.data;
}

export async function getUpcomingCourtEvents() {
    const response = await api.get("/court-events/upcoming");
    return response.data;
}