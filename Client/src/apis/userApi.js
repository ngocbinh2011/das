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

    login({ username, password }) {
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

    register(data) {
        const url = '/auth/register';
        console.log(data);
        return axiosClient.post(url, data);
    },

    resetPassword(username, newPassword) {
        const url = '/auth/reset-password';
        return axiosClient.post(url, null, {
            params: {
                username,
                newPassword,
            }
        });
    },

    logout() {
        const url = '/auth/logout';
        return axiosClient.post(url);
    },

    forgotPassword(email) {
        const url = '/auth/forgot-password';
        return axiosClient.post(url, null, {
            params: {
                email,
            }
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
        return axiosClient.get('/users');
    },

    createUser(data) {
        const url = '/users';
        return axiosClient.post(url, data);
    },

    searchUsers(username) {
        const url = '/users/search';
        return axiosClient.get(url, { params: { username } });
    },

    changePassword(token, newPassword) {
        const url = '/auth/change-password';
        return axiosClient.post(url, null, {
            params: {
                token,
                newPassword,
            }
        });
    },
}

export default userApi;