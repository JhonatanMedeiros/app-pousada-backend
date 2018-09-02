'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

/** Firebase Setup **/
admin.initializeApp(functions.config().firebase);

/** Express **/
const router = require('./app/router/router');
const app = express();
router(app);

/** Add Body parser **/
app.use(bodyParser.json());

/** Automatically allow cross-origin requests **/
app.use(cors({ origin: true }));

/** Expose Express API as a single Cloud Function: **/
exports.api = functions.https.onRequest(app);
