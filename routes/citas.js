/**
 * 
 * path: /api/citas
 * 
  */

 const { Router } = require("express");
 const { check } = require("express-validator");

 const { crearCita, eliminarCita, getCitasPorFecha, getCitasCantidad, findCita } = require("../controller/cita");
 const { validarCampos } = require("../middlewares/validar-campo");
const { existeCitaPorID } = require("../middlewares/valida-cita");
const { validarJWT } = require("../middlewares/validar-jwt");


const router = Router();

// localhost:3000/api/citas/new
router.post( '/new', [ 
    check('paciente', 'El paciente es obligatorio').not().isEmpty(),
    check('odontologo', 'El odontologo es obligatorio').not().isEmpty(),
    check('horaInicial', 'La hora inicial es obligatorio').not().isEmpty(),
    check('horaFinal', 'El horaFinal es obligatorio').not().isEmpty(), 
    check('nota', 'El fecha es obligatorio').isLength({ min: 4}),
    check('fecha', 'La nota de nacimiento es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),

    validarCampos
], crearCita );

// localhost:3000/api/citas/delete/id
router.delete('/delete/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCitaPorID),
    validarCampos
], eliminarCita);

// localhost:3000/api/citas/odontologo/Darwin Fernandez/fecha/2023-05-24
router.get('/odontologo/:odontologo/fecha/:key', validarJWT, getCitasPorFecha); 

// localhost:3000/api/citas/cantidad/odontologo/:key
router.get('/cantidad/odontologo/:odontologo', validarJWT, getCitasCantidad); 

// localhost:3000/api/citas/search/Darwin
router.get('/search/:key', findCita); 

module.exports = router;


