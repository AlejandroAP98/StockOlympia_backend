// src/routes/rolRoutes.js
const express = require('express');
const rolController = require('../controllers/rolController');

const rolRouter = express.Router();

rolRouter.get('/', rolController.findAll);
rolRouter.get('/:id', rolController.findById);
rolRouter.post('/', rolController.create);
rolRouter.put('/:id', rolController.update);
rolRouter.delete('/:id', rolController.delete);

module.exports = rolRouter;
