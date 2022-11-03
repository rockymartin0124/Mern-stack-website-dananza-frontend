import { authHeader } from '../helpers';
import { userInfo } from '../helpers';
import { apiConfig } from '../config';

export const sellerService = {
    createProfile,
    setProfile,
    getProfile,
    createChannel,
    deleteChannel,
    getChannel,
    createAdlist,
    updateAdlist,
    deleteAdlist,
    getAdlist,
    getAllProfile,
    getSearchResult,
    getOrderHistory,
    updateOrderHistory,
    addOrderHistory,
    getLatestOrderHistory,
    createOrder,
    getSellerOrders,
    getSellerSchedule
};

const apiRoot = apiConfig.apiRoot;

function createProfile(user) {
    let requestOptions = {
        method: 'POST',
        headers: { ...authHeader() }
    };

    return fetch( apiRoot + `/adza/${user.id}`, requestOptions)
        .then(handleResponse)
}

function setProfile(sellerprofile) {
    let requestOptions = {
        method: 'POST',
        headers: { ...authHeader() }
    };

    return fetch( apiRoot + `/adza`, requestOptions)
        .then(handleResponse)
        .then(seller => {
            var formData = new FormData();

            var jsonData = JSON.stringify(sellerprofile);
            formData.append('sellerprofile', jsonData );
            // Process Images
            for (var i = 0; i < sellerprofile.image_gallery.length; i++) {
                formData.append('image_gallery', sellerprofile.image_gallery[i], sellerprofile.image_gallery[i].name);
            }

            const updateOptions = {
                method: 'PUT',
                headers: { ...authHeader() },
                body: formData
            };
            return fetch( apiRoot + `/adza`, updateOptions)
                .then(handleResponse)
                .then(seller=>{});
        });
}

function getProfile() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader() }
    };

    return fetch( apiRoot + `/adza`, requestOptions)
        .then(handleResponse);
}

function createChannel(channel) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(channel)
    };
    return fetch( apiRoot + `/channel`, requestOptions)
        .then(handleResponse);
}

function deleteChannel(channelID) {
    const requestOptions = {
        method: 'delete',
        headers: { ...authHeader() }
    };
    return fetch( apiRoot + `/channel/${channelID}`, requestOptions)
        .then(handleResponse);
}

function getChannel() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader() }
    };

    return fetch( apiRoot + `/channel`, requestOptions)
        .then(handleResponse);
}

function createAdlist(adlist) {
    var formData = new FormData();
    var jsonData = JSON.stringify(adlist);

    formData.append('adlist', jsonData );
    // Process Images
    if (adlist.featured_photo) {
        formData.append('featured_photo',adlist.featured_photo,adlist.featured_photo.name);
    }

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader() },
        body: formData
    };
    return fetch( apiRoot + `/listing`, requestOptions)
        .then(handleResponse)
        .then(seller=>{});
}

function updateAdlist(adlist) {
    var formData = new FormData();
    var jsonData = JSON.stringify(adlist);

    formData.append('adlist', jsonData );
    // Process Images
    if (adlist.featured_photo) {
        formData.append('featured_photo',adlist.featured_photo,adlist.featured_photo.name);
    }

    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader() },
        body: formData
    };
    const {id} = adlist;
    return fetch( apiRoot + `/listing/${id}`, requestOptions)
        .then(handleResponse);
}

function deleteAdlist(adlistID) {
    const requestOptions = {
        method: 'delete',
        headers: { ...authHeader() }
    };
    return fetch( apiRoot + `/listing/${adlistID}`, requestOptions)
        .then(handleResponse);
}

function getAdlist() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader() }
    };

    return fetch( apiRoot + `/listing`, requestOptions)
        .then(handleResponse);
}

function getAllProfile(adzaid) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch( apiRoot + `/adza/${adzaid}/adzainfo`, requestOptions)
        .then(handleResponse);
}

function getSearchResult(){
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader() }
    };

    return fetch( apiRoot + `/search`, requestOptions)
        .then(handleResponse);
}

function createOrder(_listing){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({listings:_listing})
    };

    return fetch( apiRoot + `/order`, requestOptions)
        .then(handleResponse);
}

function getOrderHistory(orderId){
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader() }
    };

    return fetch( apiRoot + `/order/${orderId}`, requestOptions)
        .then(handleResponse);
}

function updateOrderHistory(order){
    var formData = new FormData();    
    var jsonData = JSON.stringify(order);

    formData.append('orderData', jsonData );
    
    if (order.order_attachment && order.order_attachment.image)
        formData.append('uploadmedia', order.order_attachment.image, order.order_attachment.image.name);

    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader() },
        body: formData
    };
    return fetch( apiRoot + `/order`, requestOptions)
        .then(handleResponse)

}

function addOrderHistory(OrderId,order_status,order_type,order_comment,order_attachment){
    var formData = new FormData();
    var jsonData = JSON.stringify({OrderId,order_status,order_type,order_comment,order_attachment});

    formData.append('orderData', jsonData );
    
    if(order_attachment.image)
        formData.append('uploadmedia', order_attachment.image, order_attachment.image.name);

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader() },
        body: formData
    };
    return fetch( apiRoot + `/order/${OrderId}`, requestOptions)
        .then(handleResponse)

}

function getLatestOrderHistory( _ordorId ) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch( apiRoot + `/order/${_ordorId}/status`, requestOptions)
        .then(handleResponse);
}

function getSellerOrders() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch( apiRoot + `/order`, requestOptions)
        .then(handleResponse);
}

function getSellerSchedule(){
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch( apiRoot + `/order`, requestOptions)
        .then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
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