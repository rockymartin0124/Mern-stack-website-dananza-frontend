export function userInfo() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return user.user_info;
    } else {
        return {};
    }
}