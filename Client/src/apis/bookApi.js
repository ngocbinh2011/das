import axiosClient from './axiosClient';

const bookApi = {
    createBook(data) {
        const url = '/books';
        return axiosClient.post(url, data);
    },
    getDetailBook(id) {
        const url = '/books/' + id;
        return axiosClient.get(url);
    },
    getListBooks() {
        const url = '/books';
        return axiosClient.get(url);
    },
    getBooksByCategory(id) {
        const url = '/books/category/' + id;
        return axiosClient.get(url);
    },
    updateBook(id, data) {
        const url = '/books/' + id;
        return axiosClient.put(url, data);
    },
    deleteBook(id) {
        const url = '/books/' + id;
        return axiosClient.delete(url);
    },
    searchBook(name) {
        const params = {
            name: name.target.value
        }
        const url = '/books/searchByName';
        return axiosClient.get(url, { params });
    },
    getPurchasedBooksByUser(userId) {
        const url = `/books/user/${userId}/purchased`;
        return axiosClient.get(url);
    },
}

export default bookApi; 