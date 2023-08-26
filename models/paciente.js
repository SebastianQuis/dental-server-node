const { Schema, model } = require('mongoose');

const PacienteSchema = Schema({

    nombres: {
        type: String,
        required: true,
    },
    apellidos: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        required: true,
    },
    dni: {
        type: String,
        required: true,
        unique: true
    },
    nacimiento: {
        type: Date,
        required: true,
    },
    edad: {
        type: String,
        default: '0'
    },
    tratamiento: {
        type: String,
        required: true,
    },
    odontologo: {
        type: String,
        required: true,
    },
    activo: {
        type: Boolean,
        default: true,
    },
});

PacienteSchema.method('toJSON', function(){ // limitar las propiedades que se quieren regresar
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Paciente', PacienteSchema);