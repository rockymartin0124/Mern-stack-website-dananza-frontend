import { authHeader } from '../helpers';
import { apiConfig } from '../config';

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    handleResponse,
    delete: _delete,
    updatePassword,
    updateQA
};

const apiRoot = apiConfig.apiRoot;

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch( apiRoot + `/signup`, requestOptions).then(handleResponse);
}

function login(email, password, isSocial=false) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isSocial })
    };

    return fetch( apiRoot + `/signin`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');

    // remove cart
     localStorage.removeItem('cart');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(apiRoot + `/user`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(apiRoot + `/user/${id}`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(apiRoot + `/user`, requestOptions)
        .then(handleResponse)
        .then(user1 => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            var tmp = JSON.parse(localStorage.getItem('user'));
            tmp.user_info = user1;
            localStorage.setItem('user', JSON.stringify(tmp));
            return user1;
        });;
}

function updatePassword(pwd) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(pwd)
    };

    return fetch(apiRoot + `/user/change_pwd`, requestOptions)
        .then(handleResponse);
}

function updateQA( data ) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(apiRoot + `/user/change_qa`, requestOptions)
        .then(handleResponse);
}


// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(apiRoot + `/user/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                // window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}