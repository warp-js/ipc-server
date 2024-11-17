import { w3cwebsocket } from 'websocket';

/** Interface représentant les informations d'une extension. */
export interface IExtension{
  port:number;
  token:string;
  extensionId:string;
  client:w3cwebsocket;

  /**
   * Fonction de journalisation pour enregistrer les messages avec un type spécifié.
   * @param {string} message - Le message à enregistrer.
   * @param {'INFO' | 'ERROR'} type - Le type de message (INFO ou ERREUR).
  */
  log( message:string , type : 'INFO'|'ERROR' ):void;
}

/** Interface pour une requête provenant d'une extension. */
export interface IExtensionRequest{
  chanel:string;
  data:any;
}

/** Interface pour une réponse à une requête d'extension. */
export interface IExtensionResponse{
  send(message:any):void;
}

/** Type de fonction pour les événements d'extension. */
export type TExtensionEvent = ( req:IExtensionRequest , res : IExtensionResponse ) => void;

/** Type pour les événements d'extension. */
export type TExtensionEvents = Record<string , TExtensionEvent>;