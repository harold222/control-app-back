const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// cuando un supervisor abre la opcion de registrar horarios de ingreso en el dia del panel principal
// se despliega una opcion de escojer en que estacion lo desea, al escojer envio el
// id del supervisor y el id estacion, busco la estacion con el id, obtengo todos los ids de los operarios
// con eso por cada operario creo un registro nuevo donde guardo los ids,
// con eso ya tengo los registros por dia por cada operario en cada estacion

// cuando el supervisor ya terminar de registrar horarios de ingreso, se devuelve del buscador de cedula
// y debera eliminarse la opcion "registrar horarios de ingreso" por "registrar horarios de salida"
// donde se hara lo mismo que el primer caso
// para obtener el horario de salida, como se guarda en el historial con el id
// puedo buscar en esa tabla con idSupervisor y obtener todos los historiales que estan aun abiertos
// sin importar la fecha, esto se le muestra en el front al darle a la opcion "registrar horarios de salida",
// opcion de escojer en que estacion lo desea y hay si mostrar los diferentes historiales abiertos
// una vez le de seleccionar al registro que quiera enviar una peticion al backend para cambiar el estado
// de ese historial por medio del idHistorial para cerrar el openRegistration


// por medio del idStation = obtengo la estacion, verifico que en idOperators este el id del operario
// sino mostrar mensaje que ese operario no pertenece a esta estacion 

// para el registro de abrir, envio la fecha, id supervisor y el id del operario y lo guardo asi
// para el registro de cierre, envio la fecha, id supervisor y el id del operario
// verifico que exista ya un documento con ese id y la fecha de ese dia
// sino se encuentra mostrar un mensaje de que no se puede cerrar horario ya que no realizo el ingreso
// si se encuentra actualizo closingTime y state en true


// para obtner las faltas de los operarios, lo puede hacer solo el supervisor, a el le aparecen
// un listado con las estaciones que tiene encargadas al darle click a cada una debera aparecer la opcion
// de editar datos de la estacion y obtener fallas del dia =
// para obtener las faltas de los operarios puedo realizar un filtro que se tenga
// de fechas ejemplo hace un dia, una semana, un mes y genero una agregacion que me haga ese filtrado por
// la fecha de openingTime y que el estado sea falso, mediante esto determino si solo hizo un registro
// de ingreso o sino realizo ningun registro, enviar notificacion al correo registrado de la falla

const RegistrationSchema = Schema({
    createdTime:{
        type: Date,
        required: true,
    },
    openingTime: {
        type: Date,
        required: false,
        default: null
    },
    closingTime: {
        type: Date,
        required: false,
        default: null
    },
    idSupervisor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    idOperator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    idStation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    state: {
        type: Boolean,
        required: false,
        default: false
    }
}, { versionKey: false })

const db = mongoose.connection.useDb('controlApp');
RegistrationSchema.methods.toJSON = function() {
    const { _id, ...data  } = this.toObject();
    return data;
}

module.exports = db.model('registration', RegistrationSchema);