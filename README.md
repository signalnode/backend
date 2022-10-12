# Homenode Backend

This is the backend for Homenode.

## Create Database
The database is currently running in a podman container.
Therefore you need to create a new podman pod.

```
podman pod create --name database -p 5432:5432 -p 9876:80
podman run --pod database --name postgres -d -e POSTGRES_PASSWORD=<YOUR_PASSWORD> -e POSTGRES_USER=<YOUR_USERNAME> docker.io/library/postgres
podman run --pod database --name pgadmin -d -e PGADMIN_DEFAULT_EMAIL=<YOUR_EMAIL_ADDRESS> -e PGADMIN_DEFAULT_PASSWORD=<YOUR_PGADMIN_PASSWORD> docker.io/dpage/pgadmin4
```

Now you have a podman pod with a running postgres database and a pgadmin web interface for postgres

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
