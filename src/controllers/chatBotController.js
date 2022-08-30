require("dotenv").config();
import request from "request";

let postWebhook = (req, res) => {
    let body = req.body;    

    // Comprueba que este es un evento de una suscripción de página

    if (body.object === 'page') {

        //Itera sobre cada entrada, puede haber múltiples si se procesan por lotes
        body.entry.forEach(function(entry) {

            // Obtiene el cuerpo del evento webhook
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Obtienes el sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Comprobar si el evento es un mensaje o una devolución de datos y
            // pasar el evento a la función del controlador apropiado
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);        
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Devuelve una respuesta "200 OK" a todas las solicitudes
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Devuelve un 404 No encontrado' si el evento no es de una suscripción de página
        res.sendStatus(404);
    }

};

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string. 
    let VERIFY_TOKEN= process.env.TOKEN_VERIFICACION;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request 
    if (mode && token) {
        // Checks the mode and token sent is correct 
        if (mode === 'subscribe' && token === VERIFY_TOKEN){
            //Responds with the challenge token from the request 
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        }else{
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403); 
        }    
    }    
};

//resolver los eventos de los mensajes
function handleMessage(sender_psid, received_message) {

    let response;
  
    // Comprueba si el mensaje contiene texto
    if (received_message.text) {    
  
      // Crear la carga útil para un mensaje de texto básico
      response = {
        "text": `Tu enviaste el mensaje: "${received_message.text}". Ahora mandame una imagen!`
      }
    }  
    
    // Envía el mensaje de respuesta
    callSendAPI(sender_psid, response);    
  }

//Resolver los eventos de la devolucion de mensajeria
function handlePostback(sender_psid, received_postback){

}

//Enviar mensajes de respuesta atraves de la API

function callSendAPI(sender_psid, response) {
    //Construir el cuerpo del mensaje
    let request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    };
  
    //Envía la solicitud HTTP a la Plataforma de Messenger
    request({
      "uri": "https://graph.facebook.com/v6.0/me/messages",
      "qs": { "access_token": process.env.FB_PAGE_TOKEN},
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('Mensaje Enviado!')
        console.log(`Mi mensaje: ${response}`);
      } else {
        console.error("No se puede enviar el mensaje:" + err);
      }
    }); 
  }


module.exports = {
    postWebhook : postWebhook,
    getWebhook : getWebhook
}