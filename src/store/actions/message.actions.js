import { messageConstants } from '../config';
import { messageService } from '../services';
import { alertActions } from './';

export const messageActions = {
    getContact,
    createContact,
    deleteContact,
    sendMessage,
    fetchMessages,
    createSocket,
    sendSellerMessage,
    sendBuyerMessage,
    readBuyerMessage,
    readSellerMessage,
};

let socket;

function createSocket(UserId){
    return dispatch => {
        let socket_url = 'ws://' + process.env.REACT_APP_SOCKET_HOST + ':' + process.env.REACT_APP_SOCKET_PORT;
        socket = new WebSocket(socket_url);
        socket.onopen = () => {
            socket.send(JSON.stringify({
              type: messageConstants.ADD_USER,
              UserId
            }));
        }
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            switch (data.type) {
              case messageConstants.ADD_MESSAGE:
                if (data.s_type == "buyer"){
                    dispatch({type:messageConstants.RECEIVE_SELLER_MESSAGE,data});
                    dispatch(alertActions.info("New message - Adza Chat Room!"));
                }
                else if (data.s_type == "seller"){
                    dispatch({type:messageConstants.RECEIVE_BUYER_MESSAGE,data});
                    dispatch(alertActions.info("New message - Buyer Chat Room!"));
                }
                break;
              case messageConstants.SUCCESS_ADD_MESSAGE:
                if (data.s_type == "buyer"){
                    dispatch({type:messageConstants.SUCCESS_SEND_BUYER_MESSAGE,data});
                }
                else if (data.s_type == "seller"){
                    dispatch({type:messageConstants.SUCCESS_SEND_SELLER_MESSAGE,data});
                }
                break;
              default:
                break;
            }
        }
        socket.onclose = function onclose() {
            socket.close();
        };
    };
}


function sendSellerMessage(message,readerId){
    socket.send(JSON.stringify({
      type: messageConstants.ADD_MESSAGE,
      message,
      readerId,
      s_type: 'seller'
    }));
}

function sendBuyerMessage(message,readerId){
    socket.send(JSON.stringify({
      type: messageConstants.ADD_MESSAGE,
      message,
      readerId,
      s_type: 'buyer'
    }));
}

function getContact( s_type ) {
    return dispatch => {
        messageService.get_contact ( s_type )
            .then(
                contact => {
                    contact.result.map((item,index)=>{
                        contact.result[index].Messages.sort((a,b)=>{
                            return a.id-b.id;
                        });
                    });
                    dispatch(controlAction(messageConstants.GET_CONTACT, contact.result))
                },
                error => dispatch(controlAction(messageConstants.ERROR, error))
            )
    }
}

function createContact( s_type, UserId ) {
    return dispatch => {
        messageService.create_contact ( s_type, UserId )
            .then(
                contact => dispatch(controlAction(messageConstants.CREATE_CONTACT, contact)),
                error => dispatch(controlAction(messageConstants.ERROR, error))
            )
    }
}

function deleteContact(s_type, UserId, index) {
    return dispatch => {
        messageService.delete_contact( s_type, UserId )
            .then(
                contact => dispatch(controlAction(messageConstants.DELETE_CONTACT, index)),
                error => dispatch(controlAction(messageConstants.ERROR, error))
            )
    }
}

function sendMessage( s_type, _sellerId, _text, _addr ) {
    return dispatch => {
        messageService.send_message ( s_type, _sellerId, _text, _addr )
            .then(
                sending => dispatch(controlAction(messageConstants.SEND_MESSAGE, sending)),
                error => dispatch(controlAction(messageConstants.ERROR, error))
            )
    }
}

function fetchMessages( s_type, UserId ) {
    return dispatch => {
        messageService.fetch_messages ( s_type, UserId )
            .then(
                message => dispatch(controlAction(messageConstants.GET_MESSAGE, message)),
                error => dispatch(controlAction(messageConstants.ERROR, error))
            )
    }
}

function readBuyerMessage(){
    return dispatch => {
        dispatch(controlAction(messageConstants.READ_BUYER_MESSAGE));
    }
}

function readSellerMessage(){
    return dispatch => {
        dispatch(controlAction(messageConstants.READ_SELLER_MESSAGE));
    }
}

function controlAction( type, data ) 
{
    return {
        type:   type,
                data
    }
}

