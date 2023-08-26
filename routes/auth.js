/**
 * 
 * path: /api/login
 * 
  */

const { Router } = require("express");
const { check } = require("express-validator");

const { crearUsuario, login, getUsuarios, eliminarUsuario, renewToken } = require("../controller/auth");
const { validarCampos } = require("../middlewares/validar-campo");
const { validarJWT } = require("../middlewares/validar-jwt");
const { existeUsuarioPorID } = require("../middlewares/validar-usuario");

const router = Router();

router.post('/new', [ // localhost:3000/api/login/new
  check('rol', 'El rol es obligatorio').not().isEmpty(),
  check('nombre', 'El nombre es obligatorio').isLength({ min: 3 }),
  check('apellido', 'El apellido es obligatorio').isLength({ min: 3}),
  check('dni', 'El DNI es obligatorio').isLength({ min: 8, max: 8 }),
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatorio').isLength({ min: 5 }),

  validarCampos
], crearUsuario);

router.post('/', [ // localhost:3000/api/login
    check('rol', 'El rol es inválido').not().isEmpty(),
    check('email', 'El correo es inválido').isEmail(),
    check('password', 'La contraseña es inválida').isLength({min: 5})
    
], login);

router.get('/usuarios', validarJWT, getUsuarios); // localhost:3000/api/login/usuarios

router.delete('/delete/:id',[ // localhost:3000/api/login/delete/id
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(existeUsuarioPorID),

  validarCampos
], eliminarUsuario);

router.get('/renew', validarJWT, renewToken) // localhost:3000/api/login/renew


module.exports = router;