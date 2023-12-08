<template>
    <div class="popus">
        <div class="popups-inner">
            <div class="header">
                <h2>Licitacion: {{ respuesta.CodigoExterno }}</h2>
                <button class="popup-close" @click="$emit('close')">
                    <font-awesome-icon :icon="['fas', 'xmark']" />
                </button>
            </div>
            <div class="container">
                <div class="row">
                    <span>Nombre:</span>
                    <p>{{ capitalizeFirstLetter(respuesta.Descriptive_name) ?? 'No definida' }}</p>
                </div>
                <div class="row">
                    <span>Nombre del Organismo:</span>
                    <p>{{ capitalizeFirstLetter(respuesta.Nombre_del_Organismo) ?? 'No definida' }}</p>
                </div>
                <div class="row">
                    <span>Comuna:</span>
                    <p>{{ capitalizeFirstLetter(respuesta.ComunaUnidad) ?? 'No definida' }}</p>
                </div>
                <div class="row">
                    <span>Producto:</span>
                    <p>{{ capitalizeFirstLetter(respuesta.Producto) ?? 'No definida' }}</p>
                </div>
                <div class="row">
                    <span>Precio Estimado:</span>
                    <p>{{ PesosChileno(respuesta.Precio) ?? 'No definida' }}</p>

                </div>
                <div class="row">
                    <span>Cantidad:</span>
                    <p>{{ respuesta.Cantidad ?? 'No definida' }}</p>
                </div>
                <div class="row">
                    <span>Estado:</span>
                    <p>{{ capitalizeFirstLetter(respuesta.Estado) ?? 'No definida' }}</p>
                </div>
                <div>
                    <div class="row">
                        <span>Fecha de Creacion: </span>
                        <p>{{ (respuesta.FechaCreacion) ?? 'No definida' }}</p>
                    </div>
                    <div class="row">
                        <span>Fecha de Publicacion: </span>
                        <p>{{(respuesta.FechaPublicacion) ?? 'No definida' }}</p>
                    </div>
                    <!-------------- Variable ---------------------->
                    <div class="row">
                        <span>{{ mostrarFecha(0) }}</span>
                        <p>{{ mostrarFecha(1) }}</p>
                    </div>
                    <!----------------------------------------------->
                    <div class="row">
                        <span>Fecha de Cierre: </span>
                        <p>{{ (respuesta.FechaCerrada) ?? 'No definida' }}</p>
                    </div>
                </div>

                <div class="row">
                    <span>URL:</span>
                    <a href="http://www.mercadopublico.cl" target="_blank">www.mercadopublico.cl</a>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    licitacion: {
      type: Object,
      required: true
    },
    respuesta: {
      type: Object, // El tipo de datos de respuestaDetalle, ajusta esto según sea necesario
      required: true
    }
    
  },
    methods: {
        mostrarFecha(index) {
            const fechas = {
                FechaAdjudicacion: "Fecha de Adjudicación",
                FechaDesierta: "Fecha de Desierta",
                FechaRevocada: "Fecha de Revocada",
                FechaSuspendido: "Fecha de Suspendido",
            };
        
            const fechaKey = Object.keys(fechas).find(
                key => this.respuesta[key] !== 'No definida'
            );
        
            if (fechaKey) {
                return index === 0 ? fechas[fechaKey] : this.capitalizeFirstLetter(this.respuesta[fechaKey]);
            } else {
                return 'No definida';
            }
        },
        
        capitalizeFirstLetter(value) {
            if (typeof value === 'string' && value.length > 0) {
                return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            } else {
                return 'No definida';
            }
        },
        PesosChileno(monto) {
            if (monto !== undefined && monto !== null) {
                // Formatear el monto como moneda chilena
                const formatter = new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    minimumFractionDigits: 0
                });

                return formatter.format(monto);
            } else {
                return 'No definida';
            }
        }
    }
  // Resto de la lógica de tu componente Detalles
};
</script>

<style scoped>
.popus {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;

    .popups-inner {
        background: #fff;
        padding: 32px;

        width: 600px;
        height: 470px;

        box-shadow: 0px 5px 5px rgb(0 0 0 / 70%);
        border-radius: 20px;
    }
}

.header{
    display: flex;
    justify-content: space-between;
}
.conteiner{
    padding-top: 10px;
}
.row {
    display: flex;
    padding-top: 10px;
    /* border-bottom: 1px solid #bebebf; */
    border-bottom: 1px solid #000000
}
.row span{
    padding-left: 5px;
    padding-right: 0px;
    /* font-weight: bold; */
    font-size: 17px;
    font-family: monospace;
}
.row p {
    padding-left: 10px;
    padding-right: 10px;
    /* font-weight: bold; */
    font-size: 16px;
    font-family: monospace;
}
.footer{
    padding: 20px;
}
.footer button {
    padding: 10px;
}


.btn-favorito{
    color: #fff;
    background: #55B;
    border: 1px solid rgb(0 0 0 / 13%);
    font-size: 2vh;
    font: bold;
}
.btn-favorito:hover {
    background-color: #7575e3;
    color: black;
}

.popup-close{
    background: none;
    border: none;
    font-size: 4vh;
}
.popup-close:hover{
    color: red;
}
a { 
    color: #0000eeb5;
    text-decoration: none;
}
</style>
