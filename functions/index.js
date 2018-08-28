'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

/** Firebase Setup **/
admin.initializeApp(functions.config().firebase);

const db = admin.database();

/** Express **/
const app = express();

/** Add Body parser **/
app.use(bodyParser.json());

/** Automatically allow cross-origin requests **/
app.use(cors({ origin: true }));

/** Get List of Bedroom **/
app.get('/bedroom', (req, res) => {
    try {
        const ref = db.ref(`/bedroom`);
        let array = [];
        ref.once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                // const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                array.push(childSnapshot)
            });
            res.status(200).send(array);
        });
    } catch(error) {
        console.log('Error detecting sentiment or saving message', error.message);
        res.sendStatus(500).json({error: error.message});
    }
});

/** Get Bedroom by ID **/
app.get('/bedroom/:id', (req, res) => {
    const id = req.params.id;
    try {
        const ref = db.ref(`/bedroom/${id}`);
        ref.once('value', (snapshot) => {
            res.status(200).send(snapshot);
        });
    } catch(error) {
        console.log('Error detecting sentiment or saving message', error.message);
        res.sendStatus(500).json({error: error.message});
    }
});

/** Edit Bedroom by ID **/
app.patch('/bedroom/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const ref = db.ref(`/bedroom/${id}`);
        ref.update(body);
        ref.once('value', (snapshot) => {
            res.status(200).send(snapshot);
        });
    } catch(error) {
        console.log('Error detecting sentiment or saving message', error.message);
        res.sendStatus(500).json({error: error.message});
    }
});

/** Delete Bedroom by ID **/
app.delete('/bedroom/:id', (req, res) => {
    const id = req.params.id;
    try {
        db.ref(`/bedroom/${id}`)
            .once('value', (snapshot) => {
                if (!snapshot.exists()) {
                    res.status(404).json({message: 'O quarto não existe'});
                } else {
                    snapshot.ref.remove();
                    res.status(200).json({message: 'Quarto excluído.'});
                }
            });
    } catch(error) {
        console.log('Error detecting sentiment or saving message', error.message);
        res.sendStatus(500).json({error: error.message});
    }
});

/** Create an Bedroom **/
app.post('/bedroom', (req, res) => {
    const body = req.body;
    try {
        const data = {
            type: body.type,
            status: body.status,
            description: body.description,
            beds: body.beds
        };
        const snapshot = admin.database().ref(`/bedroom`).push(data);
        res.status(201).json(data);
    } catch(error) {
        console.log('Error detecting sentiment or saving message', error.message);
        res.sendStatus(500).json({error: error.message});
    }
});

/** Create an Bedroom **/
app.post('/v2/bedroom', (req, res) => {
    const body = req.body;
    try {
        const ref = admin.database().ref(`/bedroom`);
        const newBedroomRef = ref.push();
        const data = {
            type: body.type,
            status: body.status,
            description: body.description,
            beds: body.beds,
            id: newBedroomRef.key
        };
        newBedroomRef.set(data);
        res.status(201).json(data);
    } catch(error) {
        console.log('Error detecting sentiment or saving message', error.message);
        res.sendStatus(500).json({error: error.message});
    }
});



/** Expose Express API as a single Cloud Function: **/
exports.api = functions.https.onRequest(app);
