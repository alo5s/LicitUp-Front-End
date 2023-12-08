<template>
    <div class="conteiner-lista-ls">
        <div style="padding-bottom: 5%;">
            <h4>Licitacion</h4>
            <div class="custom-details" >
                <summary class="title">
                    <div class="header-details">
                        <span>{{ datos.CodigoExterno }}</span>
                        <button class="btn-delate" @click="mostrarAlertaConfirmacion(datos)">X</button>
                    </div>
                    <div class="data">
                        <p>{{ capitalizeFirstLetter(datos.Descriptive_name) }}</p>
                    </div>
                    <div class="cont">
                        <div class="progreso-contenedor">
                            <div class="progreso" :style="{width: progresoWidth}"></div>
                            <div class="tooltip" >
                              <span  v-if="datos.Estado === 'Publicada'" class="tooltiptext">{{ tooltipText }}</span>
                              <div :class="{ 'circulo': true, 'active': circulo1 }">1</div>
                            </div>
                            <div class="tooltip">
                              <span v-if="datos.Estado === 'Adjudicada' || datos.Estado === 'Revocada' || datos.Estado === 'Desierta'" class="tooltiptext">{{ tooltipText }}</span>
                              <div :class="{ 'circulo': true, 'active': circulo2 }">2</div>

                            </div>
                            <div class="tooltip">
                              <span v-if="datos.Estado === 'Cerrada'" class="tooltiptext">{{ tooltipText }}</span>
                              <div :class="{ 'circulo': true, 'active': circulo3 }">3</div>
                            </div>
                        </div>
                    </div>
                    <div class="conteiner-btn-detalle">
                      <button @click="mostrarDetalles">{{ detallesVisible ? 'Ocultar Detalles' : 'Mostrar Detalles' }}</button>
                    </div>
                </summary>
                <div class="data conteiner-dettalle" v-if="detallesVisible">
                    <div class="mb-3">
                        <div>
                            <summary>
                                <label style="border-bottom: 1px solid #bebebf;">Fechas:</label>
                            </summary>
                            <div class="row">
                                <span>Fecha de Creacion: </span>
                                <p>{{ capitalizeFirstLetter(datos.FechaCreacion) ?? 'No definida' }}</p>
                            </div>
                            <div class="row">
                                <span>Fecha de Publicacion: </span>
                                <p>{{ capitalizeFirstLetter(datos.FechaPublicacion) ?? 'No definida' }}</p>
                            </div>
                            <!-------------- Variable ---------------------->
                            <div class="row">
                              <span>{{ mostrarFecha(0) }}</span>
                              <p>{{ mostrarFecha(1) }}</p>
                            </div>
                            <!----------------------------------------------->
                            <div class="row">
                                <span>Fecha de Cierre: </span>
                                <p>{{ capitalizeFirstLetter(datos.FechaCerrada) ?? 'No definida' }}</p>
                            </div>
                        </div>
                        
                    </div>
                    <div class="mb-3">
                        <span>Estado actual:</span>
                        <p>{{ capitalizeFirstLetter(datos.Estado) ?? 'No definida' }}</p>
                    </div>
                    <div class="mb-3">
                        <span>Ubicación:</span>
                        <p>{{ capitalizeFirstLetter(datos.ComunaUnidad) ?? 'No definida' }}</p>
                    </div>
                    <div class="mb-3">
                        <span>Producto Demandado:</span>
                        <p>{{ capitalizeFirstLetter(datos.Producto) ?? 'No definida' }}</p>
                    </div>
                    <div class="mb-3">
                        <span>Preció del Producto:</span>
                        <p>{{ capitalizeFirstLetter(datos.Precio) ?? 'No definida' }}</p>
                    </div>
                </div>
              </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    datos: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      detallesVisible: false,
      circulo1: false,
      circulo2: false,
      circulo3: false,
    };
  },
  computed: {
  progresoWidth() {
      if (this.datos.Estado === 'Publicada') {
        return 0;
      } else if (this.datos.Estado === 'Adjudicada' || this.datos.Estado === 'Revocada'|| this.datos.Estado === 'Desierta' ) {
        return '50%';
      } else if (this.datos.Estado === 'Cerrada') {
        return '99%';
      }
    },
  tooltipText() {
      if (this.datos.Estado === 'Publicada') {
        return 'Publicada';
      } else if (this.datos.Estado === 'Adjudicada' || this.datos.Estado === 'Revocada') {
        return this.datos.Estado;
      } else if (this.datos.Estado === 'Cerrada') {
        return 'Cerrada';
      } else {
        return 'Estado no definido';
      }
    }
  },
  mounted() {
    this.actualizarCirculosActivos();
  },
  methods: {
  actualizarCirculosActivos() {
    this.circulo1 = this.datos.Estado === 'Publicada';
    this.circulo2 = ['Adjudicada', 'Revocada', 'Desierta'].includes(this.datos.Estado);
    this.circulo3 = this.datos.Estado === 'Cerrada';

    if (this.circulo3) {
      this.circulo2 = true;
    }

    if (this.circulo2) {
      this.circulo1 = true;
    }
  },

    mostrarDetalles() {
      this.detallesVisible = !this.detallesVisible; // Alternar la visibilidad
    },
    capitalizeFirstLetter(value) {
      if (!value) return 'No definida';
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    },
    mostrarFecha(index) {
      const fechas = {
        FechaAdjudicacion: "Fecha de Adjudicación",
        FechaDesierta: "Fecha de Desierta",
        FechaRevocada: "Fecha de Revocada",
        FechaSuspendido: "Fecha de Suspendido",
      };

      const fechaKey = Object.keys(fechas).find(
        key => this.datos[key] !== 'No definida'
      );

      if (fechaKey) {
        if (index === 0) {
          return fechas[fechaKey];
        } else {
          return this.capitalizeFirstLetter(this.datos[fechaKey]);
        }
      } else {
        return 'No definida';
      }
    },
    mostrarAlertaConfirmacion() {
      this.$swal({
        title: '¿Estás seguro?',
        text: 'No podrás recibir notificaciones si dejas de seguir esta licitación.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$emit('confirmar-dejar-de-seguir', this.datos);

        }
      });
    },
  },
};
</script>

<style>


:root{
--linea--borde-relleno:#3498db;
--linea--borde-vacio:#e0e0e0;
}

.conteiner-lista-ls{
  display: flex;
  align-items: center;
  justify-content: center;
}

h4 {
  color: #444c;
  font-weight: 100;
}

.custom-details{
    box-shadow: 5px 10px 10px -5px #ccd2d3a3 ;
    border: 1px solid #444;
    width: 80vh;
}

.title{
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    border-bottom: 1px solid;
    background: white;
    font-size: 3vh;
}
.header-details{
    display: flex;
    justify-content: space-between;
}
.header-details span {
  border-bottom: 1px solid #c3c1c1;
}

.data{
background: #Fff;
padding: 5px 0px;
}
.data p {
  font-size: 14px;
  font-family: sans-serif;
}

.data span {
    font-weight: bold;
    padding-right: 10px;
}
.row {
    display: flex;
    padding-top: 10px;
    font-size: 15px;
}
.row span{
    font-weight: bold;
    padding-right: 10px;
}
.mb-3{
    border-bottom: 1px solid #c9c4c4;
    display: flex;
    margin-bottom: 1rem;
    padding-bottom: 5px;
}
.btn-delate{
    border: none;
    background: none;
    font-size: 25px;
}
.btn-delate:hover{
    color: rgb(255, 23, 23);
    cursor: pointer;
}


.cont{
  padding-top: 50px;
  display: flex;
  justify-content: center;
}

.progreso-contenedor{
display: flex;
justify-content: space-between;
position: sticky;
max-width: 100%;
width: 350px;
}


.progreso-contenedor::before {
content: '';
background-color: var(--linea--borde-vacio);
position: absolute;
top: 50%;
left: 0;
transform: translateY(-50%);
height: 4px;
width: 100%;
z-index: -1;
transition: 0.4s ease;
}

/*------- Barra de progreso -------------*/

.progreso {
background-color: var(--linea--borde-relleno);
position: absolute;
top: 50%;
left: 0;
transform: translateY(-50%);
height: 4px;
width: 0%;  /* 1=0 2=50 3=99 Barra de progres */
z-index: -1;
transition: 0.4s ease;
}

/*--------------------------------------*/
.circulo{
background-color: #fff;
color: #999;
border-radius: 50%;
height: 30px;
width: 30px;    
display: flex;
align-items: center;
justify-content: center;
border: 3px solid var(--linea--borde-vacio);
transition: 0.4s ease;
}

.circulo.active{
border-color: var(--linea--borde-relleno);
}


/*--------------------Toltip---------------------------*/

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}
.tooltiptext {
  font-size: 12px;
  visibility: visible;
  width: 120px;
  background-color: #555555ab;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;

  /* Fade in tooltip */
  transition: opacity 1.3s;
  opacity: 1;

}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: hidden;
  opacity: 0;
}

/*-----------------------------------------------------*/

.conteiner-dettalle {
  padding: 5px 25px;
}
.conteiner-btn-detalle{
  padding-top: 15px;
}
.conteiner-btn-detalle button{
  background: white;
  font-size: 12px;
  padding: 5px 14px;
  border: 1px solid #444;
}
.conteiner-btn-detalle button:hover{
  cursor: pointer;
  color: rgb(0, 0, 0);
  /* Cambio de color al pasar el ratón */
  transform: scale(1.05);
  /* Efecto de escala al pasar el ratón */
}

.conteiner-btn-detalle button:active{
  transform: scale(0.95);
  /* Efecto de clic (escala ligeramente hacia abajo) */
}


@media (max-width: 405px) {
.custom-details{
    width: 50vh;
}
}
</style>