import { default as chalk } from 'chalk';

/**
 * La fonction "log" est utilisée pour enregistrer des messages en fonction du contexte, en associant un type de message.
 * Elle est particulièrement utile pour la communication entre le backend et le frontend via des extensions exécutées en
 * parallèle par Neutralino. L'ID d'extension permet d'identifier l'émetteur du message, tandis que le type indique si
 * c'est une information ("INFO") ou une erreur ("ERREUR").
 * @param {string} extensionId - L'ID de l'extension ou du module émettant le message.
 * @param message - Le message à enregistrer (peut être une chaîne ou un objet).
 * @param [type=INFO] - Le type de message (INFO ou ERREUR).
 */
export function log( extensionId:string , message, type = "INFO") {
  
  const logLine = `[${extensionId}]: ${chalk[
    type === "INFO" ? "green" : "red"
  ](type)} ${(typeof message == 'object' ? JSON.stringify(message , null , '\t') : message)}`;

  console[type === "INFO" ? "log" : "error"](logLine);

}