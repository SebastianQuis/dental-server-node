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

router.post( '/new', [ // localhost:3000/api/paciente/new

    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(), 
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('dni', 'El dni es obligatorio').not().isEmpty(), // chequear cantidad de digitos 8
    check('nacimiento', 'La fecha de nacimiento es obligatorio').not().isEmpty(), // chequear datetime - 14/09/2022  15-09-2022 14:00
    check('tratamiento', 'El tratamiento es obligatorio').isLength({ min: 5}),
    check('odontologo', 'El odontologo es obligatorio').not().isEmpty(),

    validarCampos
], crearPaciente);

router.get( '/pacientes', validarJWT, getPacientes) // localhost:3000/api/paciente/pacientes

router.put( '/actualiza/:id', validarJWT, updatePaciente) // localhost:3000/api/paciente/actualiza/asdasd

router.get( '/search/:key', findPaciente) // localhost:3000/api/paciente/search/asdasd

module.exports = router;