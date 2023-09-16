const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    rol: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    online: {
        type: Boolean,
        default: false
    },
    disponible: {
        type: Boolean,
        default: true
    },
});

// sobre escribiendo el metodo toJSON
UsuarioSchema.method('toJSON', function() { // limitar las propiedades que se quieren regresar
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);