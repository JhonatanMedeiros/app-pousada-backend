'use strict';
const admin = require('firebase-admin');
const db = admin.database();

/** Get List of Bedroom **/
exports.getBedrooms = function(req, res) {
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
};

/** Get Bedroom by ID **/
exports.getBedroomById = function (req, res) {
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
};

/** Edit Bedroom by ID **/
exports.editBedroom = function (req, res) {
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
};

/** Delete Bedroom by ID **/
exports.deleteBedroom = function (req, res) {
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
};

/** Create an Bedroom **/
exports.createBedroom = function (req, res) {
    const body = req.body;

    if (!body.type) {
        res.sendStatus(500).json({error: 'Informe o campo Type.'});
    }

    if (!body.status) {
        res.sendStatus(500).json({error: 'Informe o campo Status.'});
    }

    if (!body.description) {
        res.sendStatus(500).json({error: 'Informe o campo Description.'});
    }

    if (!body.beds) {
        res.sendStatus(500).json({error: 'Informe o campo Beds.'});
    }

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
};
