import { authHeader } from '../helpers';
import { apiConfig } from '../config';
import { userService } from '../services';
import { alertActions } from '../actions'

export const messageService = {
    get_contact,
    create_contact,
    send_message,
    fetch_messages,
    delete_contact
};

const apiRoot = apiConfig.apiRoot;

function get_contact( s_type )
{
    const reqOpt = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({s_type: s_type})
    }

    return fetch(apiRoot + `/message/contact/`, reqOpt)
    .then( userService.handleResponse )
    .then( contact => {
        return contact;
    });
}

function create_contact( s_type, UserId )
{
    const reqOpt = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body:JSON.stringify({s_type,UserId})
    }

    return fetch(apiRoot + `/message/connect/${UserId}`, reqOpt)
    .then( userService.handleResponse )
    .then( contact => {
        return contact;
    });
}

function delete_contact( s_type, UserId )
{
    const reqOpt = {
        method: "delete",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body:JSON.stringify({s_type,UserId})
    }

    return fetch(apiRoot + `/message`, reqOpt)
    .then( userService.handleResponse )
    .then( contact => {
        return contact;
    });
}

function send_message( s_type, _sellerId, _text, _addr )
{
    const reqOpt = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ s_type: s_type, to: _sellerId, message: _text, contactId: _addr })
    }

    return fetch(apiRoot + `/message/send`, reqOpt)
    .then( userService.handleResponse )
    .then( contact => {
        return contact;
    });
}

function fetch_messages( s_type, UserId)
{
    const reqOpt = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ s_type: s_type, UserId })
    }

    return fetch(apiRoot + `/message/fetch`, reqOpt)
    .then( userService.handleResponse )
    .then( messages => {
        return messages;
    });
}
