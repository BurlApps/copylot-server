# Getting Started

This server is mean't to run on Heroku in production and locally
in development. If you don't have a Heroku account, create one here:
https://signup.heroku.com/login


# Prerequisites

- [Heroku Account](https://signup.heroku.com/login)
- [Heroku Toolbelt](https://toolbelt.heroku.com/)
- Node & NPM
  - Install `Sails & Forever`
- Postgres
- Redis


# Update Your Enivroment

Update the `.env` file for your environment


# Run Locally

1. Install modules `npm install`
2. Confirm that you have *Postgres* and *Redis* running and configured properly
3. Run command `foreman start`. This will start the server with all the environment variables needed to make the app work.
4. Watch your logs live by running this command `forever logs -f app.js`
5. If you want to kill the server, run `forever stopall` or `forever stop <pid>`


# Create A Heroku App

1. Login into Heroku from the toolbelt cli ```heroku login```
2. Call `heroku create`
3. Set environmental variables from your `.env` on Heroku ```heroku config:set <env var> --app <app>```
4. Create a Postgres database on Heroku ```heroku addons:create heroku-postgresql:hobby-dev```
5. Create a Redis database on Heroku ```heroku addons:create heroku-redis:test```


# Run on Heroku

1. Push code to Heroku ```git push heroku master```
4. Watch your logs live by running this command ` heroku logs --tail`
