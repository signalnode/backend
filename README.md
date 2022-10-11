# Homenode Backend
This is the backend for Nodehome.

## Start backend
`npm start` or `yarn start`

## Config
The backend needs a few settings for working.
You can clone or rename the `.env.example` file to `.env` and set the values.

## Fake Addon API
Because it should be possible to install community made addons not all addons are local. So the addons must have to stored somewere else.
To test this there is a free service called `https://my-json-server.typicode.com` where a addon server is mocked.
The URL of the api is: `https://my-json-server.typicode.com/dawosch/homenode-backend/addons`

**Note**
The attribute `installed` will be removed soon.