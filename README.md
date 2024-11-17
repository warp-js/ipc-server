# @thorino/ipc

Le module `@thorino/ipc` facilite l'interaction entre le backend et le frontend dans le contexte d'une application créée avec le framework Thorium et NeutralinoJS. Il exploite la fonctionnalité de démarrage de processus en parallèle de Neutralino pour exécuter des extensions (écrites en différentes langues telles que C++, Python, Node.js, etc.) afin d'inclure des modules backend dans l'application. Le module simplifie notamment la mise en place d'un serveur WebSocket natif de Neutralino pour établir une communication bidirectionnelle entre le backend et le frontend.

> Vous pouvez également démarrer rapidement un projet avec Thorium et Neutralino en utilisant le [starter pack Thorino](https://github.com/Odyssee-Software/thorino-starter). 
> Pour une expérience encore plus fluide, vous pouvez utiliser le [client thorium-cli](https://github.com/Odyssee-Software/thorium-cli) pour créer et configurer des projets, ajouter des extensions et générer des squelettes de code dans le langage de votre choix.

Créé avec ❤️ par l'équipe du framework Thorium.

## Fonctionnalités

- Envoie d'événements entre le frontend et les extensions du backend.
- Utilisation de la fonctionnalité de démarrage de processus en parallèle de Neutralino pour exécuter des extensions.
- Mise en place simplifiée d'un serveur WebSocket natif de Neutralino pour une communication bidirectionnelle.

## Installation

Pour installer le module, utilisez la commande suivante :

```sh
npm install @thorino/ipc
```

## Utilisation

### Dispatcher

La fonction `Dispatcher` permet de créer une fonction de déclenchement d'événement personnalisée pour une extension spécifique. Cette fonction préconfigure le nom de l'extension pour simplifier l'utilisation ultérieure de la fonction `Dispatch`.

```typescript
import { Dispatcher } from '@thorino/ipc';

const myExtensionDispatcher = Dispatcher('myExtension');
myExtensionDispatcher<MyResponseType>('myEvent', 'Hello from frontend!')
.then(responseEvent => {
  // Gérer la réponse de l'extension
})
.catch(error => {
  // Gérer les erreurs
});
```

## Extension

La fonction `Extension` facilite la communication entre le backend et le frontend en utilisant des extensions exécutées en parallèle par Neutralino. Elle met en place un serveur WebSocket natif pour établir une interaction bidirectionnelle entre les deux parties.

```typescript
import { Extension } from '@thorino/ipc';

const events = {
  myEvent: (req, res) => {
    // Gérer l'événement myEvent
    res.send('Response from backend');
  },
  // Autres événements
};

const myExtension = Extension(events);

if (myExtension) {
  // Utilisation de l'extension
  myExtension.log('Extension is ready', 'INFO');
} else {
  console.error('Failed to initialize extension');
}
```

## Interfaces

Ce module fournit également des interfaces pour définir les structures de données utilisées dans l'application. Les interfaces disponibles sont : `IExtension`, `IExtensionRequest`, `IExtensionResponse`, `TExtensionEvent` et `TExtensionEvents`.

Pour plus de détails, consultez le code source ou les commentaires correspondants.

## Contribuer

Toute contribution est la bienvenue ! Si vous trouvez des problèmes ou avez des idées d'amélioration, n'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce module est distribué sous la licence MIT.