

const hallarEdad = ( nacimiento = '' ) => {

    const fechaActual = new Date();
    const fechaNac = new Date(nacimiento);
    
    const edad = fechaActual.getFullYear() - fechaNac.getFullYear();

    if ( fechaActual.getMonth() < fechaNac.getMonth() || (fechaActual.getMonth() === fechaNac.getMonth() && fechaActual.getDate() < fechaNac.getDate())) {
        return `${edad - 1}`;
    }    
    
    // console.log({fechaNac});
    
    return `${edad}`;
}

module.exports = hallarEdad;