
const { Schema, model } = require('mongoose');

const CitaSchema = Schema({

    paciente: {
        type: String,
        required: true
    },
    odontologo: {
        type: String,
        required: true
    },
    horaInicial: {
        type: String,
        required: true
    },
    horaFinal: {
        type: String,
        required: true,
    },
    nota: {
        type: String,
        required: true,
    },
    fecha: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true
    },
    atendida: {
        type: Boolean,
        default: false
    }
});

// sobre escribiendo el metodo toJSON
CitaSchema.method('toJSON', function() { // limitar las propiedades que se quieren regresar
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Cita', CitaSchema);

