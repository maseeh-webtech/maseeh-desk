# maseh-desk

## Getting started

It should be as easy as running `npm i`, then `npm start` in one terminal and `npm run hotloader` in
another!

You'll need a `.env` file in the top level directory for the Mongo connection string.

## Running in production

It's easiest to use something like `pm2` to keep the process running and easily manage it:
```
npm i -g pm2
npx webpack                     # might take a full minute or so to run
pm2 start server/server.js
pm2 save                        # save configuration so pm2 can restart server.js on VM reboot
```
