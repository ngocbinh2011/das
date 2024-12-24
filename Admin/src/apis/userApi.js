import axiosClient from "./axiosClient";

const userApi = {
    async getAllPersonalInfo() {
        const url = '/auth/getAll';
        try {
            const response = await axiosClient.get(url);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    login(username, password) {
        const url = '/auth/login';
        return axiosClient
            .post(url, {}, {
                params: {
                    username,
                    password,
                }
            })
            .then(response => {
                console.log(response);
                if (response.token) {
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("user", JSON.stringify(response.user));
                }
                return response;
            });
    },

    // User Controller APIs
    getUserById(id) {
        const url = `/users/${id}`;
        return axiosClient.get(url);
    },

    updateUser(id, data) {
        const url = `/users/${id}`;
        return axiosClient.put(url, data);
    },

    deleteUser(id) {
        const url = `/users/${id}`;
        return axiosClient.delete(url);
    },

    getAllUsers() {
        const url = '/users';
        return axiosClient.get(url);
    },

    createUser(data) {
        const url = '/users';
        return axiosClient.post(url, data);
    },

    searchUsers(username) {
        const url = '/users/search';
        return axiosClient.get(url, { params: { username } });
    },
}

export default userApi;