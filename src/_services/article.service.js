import { authHeader, config } from '../_helpers';
import {userService} from './user.service'

export const articleService = {
    // login,
    // logout,
    // register,
    getAll,
    addItem,
    updateItem,
    getById,
    update,
    delete: _delete
};

const apiName = 'articles';

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/${apiName}`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/${apiName}/${id}`, requestOptions).then(handleResponse);
}

function addItem(item) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    };

    return fetch(`${config.apiUrl}/${apiName}/add`, requestOptions).then(handleResponse);
}

function updateItem(item) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    };

    return fetch(`${config.apiUrl}/${apiName}/${item.id}`, requestOptions).then(handleResponse);
}

function update(item) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    };

    return fetch(`${config.apiUrl}/${apiName}/${item.id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/${apiName}/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                userService.logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
