export const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const setUserToLocalStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}; 