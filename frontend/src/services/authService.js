import api from "./api";

export async function login(email, password) {

    const form = new URLSearchParams();

    form.append("username", email);
    form.append("password", password);

    const response = await api.post(
        "/auth/login",
        form,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    return response.data;
}