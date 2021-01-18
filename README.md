# maseeh-desk

## Getting started

It should be as easy as running `yarn install`, then `yarn server` in one terminal and `yarn client` in
another!

You'll need a `.env` file in the `server/` directory with the Mongo connection string.

## Running in production

It's easiest to use something like `pm2` to keep the process running and easily manage it:

```
npm i -g pm2
yarn build:client               # might take a full minute or so to run
pm2 start server/server.js
pm2 save                        # save configuration so pm2 can restart server.js on VM reboot
```
