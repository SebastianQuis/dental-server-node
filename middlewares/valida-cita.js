const Cita = require('../models/cita');

const existeCitaPorID = async ( id ) => {
    
    const existeCita = await Cita.findById(id);

    if (!existeCita) {
        throw new Error(`El id no existe ${id}`);
    }

}

module.exports = {
    existeCitaPorID
}