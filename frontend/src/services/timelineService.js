import api from "./api";

export async function getCaseTimeline(caseId) {
    const response = await api.get(`/timeline-events/case/${caseId}`);
    return response.data;
}

export async function getTimelineEvent(eventId) {
    const response = await api.get(`/timeline-events/${eventId}`);
    return response.data;
}

export async function createTimelineEvent(event) {
    const response = await api.post(`/timeline-events/`, event);
    return response.data;
}

export async function updateTimelineEvent(eventId, event) {
    const response = await api.put(`/timeline-events/${eventId}`, event);
    return response.data;
}

export async function deleteTimelineEvent(eventId) {
    const response = await api.delete(`/timeline-events/${eventId}`);
    return response.data;
}