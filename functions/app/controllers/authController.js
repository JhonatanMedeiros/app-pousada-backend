'use strict';
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const db = admin.database();

/** Login **/
exports.login = function(req, res) {

    const body = req.body;
    res.status(200).json(body);
};

/** Signup **/
exports.signup = function(req, res) {
    const body = req.body;

    if (!body.email) {
        res.status(500).json({message: "É necessario informar um email."})
    }

    if (!body.password) {
        res.status(500).json({message: "É necessario informar uma senha."})
    }

    if (!body.name) {
        res.status(500).json({message: "É necessario informar o nome."})
    }

    admin.auth().createUser({
        email: body.email,
        emailVerified: false,
        password: body.password,
        displayName: body.name,
        disabled: false
    })
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully created new user:", userRecord.uid);
            return res.status(201).json(userRecord);
        })
        .catch((error) => {
            console.log("Error creating new user:", error);
            return res.status(500).json({error: error});
        });
};

