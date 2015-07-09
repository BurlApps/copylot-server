#! /app/bin/bash

sails-migrations migrate;
node app.js
