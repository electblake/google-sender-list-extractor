Google Sender List Extractor
============================

I coded this up in 2015, and wanted to publish it for others to learn from or play with - not for production use.

Features
--------
* Any Google Address (Login with Google)
* Choose Labels
* Extract Last 2 Years of Email Contacts

Techstack
---------
* Angular 1.3
* Node 5.3.0 / Express 4
* MongoDB
* Redis

Requirements
------------

* node 5.3.0 (`nvm <https://github.com/creationix/nvm/>` is reccomended)
* bower
* nvm (optional)
* gulp

Install
-------

Only has been tested on node 5.3.0 `nvm <https://github.com/creationix/nvm/>`_::
    
    nvm install && nvm use

Install dependencies::

    npm install
    bower install

Create and modify a file named `.env`::

    PORT=9000

    MONGO_URI=mongodb://localhost:27017/dbname

    REDIS_HOST=localhost:17510
    REDIS_PASS=pass

    DEBUG=*,-express:router:layer,-express:*,-send,-body-parser:*

    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    GOOGLE_REDIRECT_URL=http://localhost:9000/auth/google/callback

Run server::

    npm start

or run devserver::

    npm run dev

or gulp::

    gulp