/**
 * 
 * path: /api/paciente
 * 
  */

const { Router } = require("express");
const { validarCampos } = require("../middlewares/validar-campo");
const { check } = require("express-validator");
const { crearPaciente, getPacientes, updatePaciente, findPaciente } = require("../controller/paciente");
const { validarJWT } = require("../middlewares/validar-jwt");


const router = Router();

// localhost:3000/api/paciente/new
router.post( '/new', [ 

    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio y debe tener 9 dígitos').isLength({ min: 9, max: 9 }),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('dni', 'El dni es obligatorio y debe tener 8 dígitos').isLength({ min: 8, max: 8 }), // chequear cantidad de digitos 8
    check('nacimiento', 'La fecha de nacimiento es obligatorio').not().isEmpty(), // chequear datetime - 14/09/2022  15-09-2022 14:00
    check('tratamiento', 'El tratamiento es obligatorio').isLength({ min: 5}),
    check('odontologo', 'El odontologo es obligatorio').not().isEmpty(),

    validarCampos
], crearPaciente);

// localhost:3000/api/paciente/pacientes
router.get( '/pacientes', validarJWT, getPacientes) 

// localhost:3000/api/paciente/actualiza/asdasd
router.put( '/actualiza/:id', validarJWT, updatePaciente) 

// localhost:3000/api/paciente/search/asdasd
router.get( '/search/:key', findPaciente)

module.exports = router;