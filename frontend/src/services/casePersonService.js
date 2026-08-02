import api from "./api";

export async function createCasePerson(casePersonData) {
    const response = await api.post("/case_people/", casePersonData);
    return response.data;
}

export async function updateCasePerson(id, casePersonData) {
    const response = await api.put(`/case_people/${id}`, casePersonData);
    return response.data;
}

export async function deleteCasePerson(id) {
    await api.delete(`/case_people/${id}`);
}