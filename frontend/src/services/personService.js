import api from "./api";

export async function getPerson(id) {
    const response = await api.get(`/people/${id}`);
    return response.data;
}

export async function createPerson(personData) {
    const response = await api.post("/people/", personData);
    return response.data;
}

export async function updatePerson(id, personData) {
    const response = await api.put(`/people/${id}`, personData);
    return response.data;
}

export async function deletePerson(id) {
    await api.delete(`/people/${id}`);
}