import { w3cwebsocket } from 'websocket';
import minimist from 'minimist';
import { v4 as uuidv4 } from 'uuid';

import fs from 'fs';
import path from 'path';

import { log } from './log';
import {
  IExtension,
  TExtensionEvents
} from './types';

import { Dispatch } from './dispatch';

/** La classe ExtensionSocket simplifie la création et la gestion d'une connexion WebSocket entre le backend et le frontend
 * en utilisant la fonctionnalité native de Neutralino. */
export class ExtensionSocket extends w3cwebsocket{

  port:number;
  token:string;
  extensionId:string;

  constructor( options : { port:number , token:string , extensionId:string , connectToken:string , hostname?:string } ){

    let hostname = ( 'hostname' in options ? options.hostname : '127.0.0.1' );

    super(`ws://${hostname}:${options.port}?extensionId=${options.extensionId}&connectToken=${options.connectToken}`);

    this.port = options.port;
    this.token = options.token;
    this.extensionId = options.extensionId;
  }

  /** La ligne `log = (message) => { log( this.extensionId , message ); }` définit une méthode appelée
   * `log` à l'intérieur de la classe `ExtensionSocket`. Cette méthode prend un paramètre `message` et appelle
   * la fonction `log` du module `log`, en passant la propriété `extensionId` de l'instance `ExtensionSocket`
   * et le paramètre `message`. Cela permet à la classe `ExtensionSocket` de journaliser des messages en utilisant
   * la fonction `log` avec l'ID d'extension approprié. */
  log = (message) => { log( this.extensionId , message ); }

}

/**
 * La fonction Extension facilite la communication entre le backend et le frontend en utilisant des extensions exécutées
 * en parallèle par Neutralino. Elle met en place un serveur WebSocket natif pour établir une interaction bidirectionnelle
 * entre les deux parties. Cette fonctionnalité simplifie considérablement le processus en évitant la gestion manuelle
 * des écouteurs pour les réponses d'appels depuis le frontend, réduisant ainsi la complexité du code.
 * @param {TExtensionEvents} events - Les fonctions de gestion d'événements pour les interactions frontend-backend.
 * @returns Un objet contenant les paramètres de configuration et le client WebSocket.
 */
export const Extension = ( events:TExtensionEvents ):IExtension|null => {

  let eventsKey = Object.keys(events);

  const { 
    ["nlConnectToken"] : ConnectToken ,
    ["nlExtensionId"] : EXTENSIONID ,
    ["nlPort"] : PORT ,
    ["nlToken"] : TOKEN
  } = JSON.parse(fs.readFileSync(process.stdin.fd, 'utf-8'));

  console.log({
    ConnectToken,
    EXTENSIONID,
    PORT,
    TOKEN
  })

  try{
    let client = new ExtensionSocket({ port : PORT , token : TOKEN , extensionId : EXTENSIONID , connectToken : ConnectToken });

    client.onerror = (err) => log( EXTENSIONID , err, "ERROR");
    client.onopen = () => log( EXTENSIONID , "Connected");
    client.onclose = () => {
      log( EXTENSIONID , "Close")
      process.exit();
    };
  
    client.onmessage = (e) => {

      const { event, data } = JSON.parse(e.data as string);

      client.log( 'message incoming' );
  
      if(eventsKey.includes( event )){

        let response = {
          send : ( message ) => {

            return client.send( JSON.stringify({
              id: uuidv4(),
              method: "app.broadcast",
              accessToken: TOKEN,
              data: { event: data.chanel, data : message },
            }) );

          }
        }
        console.log(events);
        events[event]( data , response );
      }
  
    };
  
    return {
      get port(){ return client.port },
      get token(){ return client.token },
      get extensionId(){ return client.extensionId },
      client,
      log : (message, type = "INFO") => {
        return log( EXTENSIONID , message , type );
      }
    }

  }
  catch(error){
    return null;
  }

}