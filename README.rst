Google Sender List Extractor
============================

Features
--------
* Any Google Address
* Choose Labels
* Captures Last 2 Years

Requirements
------------

* node version 5.3.0 (I think)
* bower

Install
-------

Install dependencies::

    npm install

Create and modify a file named .env::

    PORT=9000

    MONGO_URI=mongodb://localhost:27017/dbname

    REDIS_HOST=redishost.com:17510
    REDIS_PASS=pass

    DEBUG=*,-express:router:layer,-express:*,-send,-body-parser:*

    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    GOOGLE_REDIRECT_URL=http://localhost:9000/auth/google/callback

Run devserver

    npm start

or

    gulp