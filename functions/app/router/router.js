'use stric';
const bedRoomController = require('../controllers/bedroom');
const authController = require('../controllers/authController');

module.exports = function (app)  {

    //=========================
    // Authentication Routes
    //=========================

    app.post('/login', authController.login);

    app.post('/signup', authController.signup);


    //=========================
    // Bedroom Routes
    //=========================

    /** Get List of Bedroom **/
    app.get('/bedroom', bedRoomController.getBedrooms);

    /** Get Bedroom by ID **/
    app.get('/bedroom/:id', bedRoomController.getBedroomById);

    /** Edit Bedroom by ID **/
    app.patch('/bedroom/:id', bedRoomController.editBedroom);

    /** Delete Bedroom by ID **/
    app.delete('/bedroom/:id', bedRoomController.deleteBedroom);

    /** Create an Bedroom **/
    app.post('/bedroom', bedRoomController.createBedroom);

    /** Api Ping **/
    app.get('/ping', (req, res) => {
        res.status(200).json({ message: 'Pong!' });
    });

};
