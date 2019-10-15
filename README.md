# API PrPose

Cette section concerne le côté serveur de PrPose, notamment l'installation et les requêtes.

-   [Installation](#installation)
-   [Requêtes de l'API](#Requêtes-de-l'API)

## Installation

Dans cette partie nous verrons comment mettre en place le backend du projet PrPose.

Après avoir téléchargé le code rendez vous dans le dossier du serveur et installez les dépendances à l'aide des commandes suivantes:

    > cd server
    > npm install

Afin de lancer le serveur:

    > npm start

Les sessions des utilisateurs sont gérées à l'aide du logiciel Redis. Il vous faut alors installer Redis sur votre machine et lancer le serveur Redis.

Vous pouvez également entrer vos propres variables d'environnment. Pour cela ajoutez un fichier _.env_ dans le dossier _server_ et ajoutez (et modifier) les variables comme dans l'expemple ci-dessous.

    PORT = 3000
    NODE_ENV = development
    DB_HOST = localhost
    DB_USER = dev_account
    DB_PASSWORD = <your_password>
    DB_DATABASE = prpose
    SESS_ID = user_session
    SESS_SECRET = secret
    UCLASSIFY_TOKEN = <your_token>

1. NODE*ENV peut être en \_development\* ou en \_production*.
2. PORT est le port du serveur.
3. DB_HOST, DB_USER, DB_PASSWORD et DB_DATABASE sont respectivement l'adresse, l'utilisateur, le mot de passe et le nom de la base de données.
4. REDIS_HOST et REDIS_PORT concernent l'adresse du serveur Redis.
5. SESS_SECRET est la clé de session
6. UCLASSIFY_TOKEN et le Token donné par uClassify pour utliser leurs API. Il ne faut pas entrer la partie Token, seulement votre clé doit être entrée.
