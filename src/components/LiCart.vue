<template>
  <div class="licitaciones-container">
    <div class="li-form-body">
      <div class="columno">
        <div class="conteiner-title-cart">
          <h3 class="title-cart">Estado: {{ datos.Estado }}</h3>
        </div>
        <div class="fila-li-headee">
          <div class="file-fi">
            <div class="li-data">
              <h1 id="codigo_licitacion">{{ datos.CodigoExterno }}</h1>
            </div>
            <div class="conteiner-fe">
              <h2 v-if="!datos.fecha">{{ fechasEstado(listaEstado) }}: No definida</h2>
              <h2 v-else>{{ fechasEstado(listaEstado) }}: {{ datos.fecha }}</h2>
            </div>
          </div>
          <div class="file">
            <div class="container-btn">
              <button class="btn-file pop" type="button" @click="openPopup">
                <font-awesome-icon :icon="['far', 'file-lines']" />
              </button>
            </div>
            <div>
              <button
                v-if="isFavorito"
                class="btn-amarillo"
                type="button"
                @click="mostrarAlertaConfirmacion"
              >
                <font-awesome-icon :icon="['fas', 'star']" />
              </button>
              <button
                v-else
                class="btn-favorito"
                type="button"
                @click="addToFavorites"
              >
                <font-awesome-icon :icon="['fas', 'star']" />
              </button>
            </div>
          </div>
        </div>
        <div class="columano-title">
          <p>{{ capitalizeFirstLetter(datos.Descriptive_name) }}</p>
        </div>
      </div>
    </div>
  </div>

  <Detalles
    :licitacion="datos"
    :respuesta="respuestaDetalle"
    v-if="showPopup"
    @close="closePopup"
  />
</template>

<script>
import Detalles from "../components/Detalles.vue";
import licitUp_bk from '../authentication/licitup_request';

export default {
  emits: ['actualizar-lista-seguimiento', 'actualizarListaSeguimiento'],
  components: {
    Detalles,
  },
  props: {
    datos: {
      type: Object,
      required: true,
    },
    listaDeSeguimiento: {
      type: Array,
      required: true,
    },
    listaEstado: String,
  },
  data() {
    return {
      showPopup: false,
      respuestaDetalle: "",
    };
  },
  computed: {
    isFavorito() {
      return this.listaDeSeguimiento.some(item => Array.isArray(item.fav_licitacion) && item.fav_licitacion.includes(this.datos.id_licitacion));
    },
  },
  methods: {
    fechasEstado(estado) {
      switch (estado) {
        case 'Publicada':
          return 'Fecha de publicación';
        case 'Cerrada':
          return 'Fecha de cierre';
        case 'Desierta':
          return 'Fecha de Desierta';
        case 'Adjudicada':
          return 'Fecha de Adjudicación';
        case 'Revocada':
          return 'Fecha de Revocada';
        // Agrega más casos según sea necesario para otros estados
        default:
          return 'Fecha';
      }
    },

    closePopup() {
      this.showPopup = false;
    },
    capitalizeFirstLetter(value) {
      const cleanedValue = value.replace(/"/g, '');
      return cleanedValue.charAt(0).toUpperCase() + cleanedValue.slice(1).toLowerCase();
    },
    async openPopup() {
      try {
        const response = await licitUp_bk.detalle(this.datos.id_licitacion);
        this.respuestaDetalle = response.data.detalle_li;
        this.showPopup = true;
      } catch (error) {
        console.error("Error al obtener datos en fetchData:", error);
      }
    },
    async mostrarAlertaConfirmacion() {
      const resultado = await this.$swal({
        title: '¿Estás seguro?',
        text: 'No podrás recibir notificaciones si dejas de seguir esta licitación.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true,
      });

      if (resultado.isConfirmed) {
        this.dejarDeSeguirLicitacion();
      }
    },
    async mostrarAlertaNoAutenticado() {
      if (typeof this.$swal === "function") {
        const resultado = await this.$swal({
          title: "¡No has iniciado sesión!",
          text: "Debes iniciar sesión para realizar esta acción.",
          icon: "error",
          showCancelButton: true,
          confirmButtonText: "Iniciar Sesión",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
        });

        if (resultado.isConfirmed) {
          window.location.href = "/Login";
        }
      } else {
        console.error("SweetAlert2 no está disponible");
      }
    },
    async addToFavorites() {
      if (licitUp_bk.isAuthenticated()) {
        try {
          this.$emit("actualizarListaSeguimiento");
          await licitUp_bk.addToFavorites(this.datos.id_licitacion);
          this.listaDeSeguimiento.push(this.datos.id_licitacion);
          this.$emit("actualizar-lista-seguimiento");
          
          this.mostrarAlertaExito(); // Mostrar mensaje de éxito
        } catch (error) {
          console.error("Error al agregar a favoritos:", error);
        }
      } else {
        await this.mostrarAlertaNoAutenticado();
      }
    },
    async dejarDeSeguirLicitacion() {
      try {
        await licitUp_bk.dejarDeSeguir(this.datos.id_licitacion);
        this.$emit("actualizar-lista-seguimiento");
        this.mostrarAlertaExito(); // Mostrar mensaje de éxito
      } catch (error) {
        console.error("Error al dejar de seguir la licitación:", error);
        this.mostrarAlertaError(); // Mostrar mensaje de error
      }
    },
    mostrarAlertaExito() {
      // Mostrar mensaje de éxito
      this.$swal({
        icon: 'success',
        title: 'Listo',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    },
    mostrarAlertaError() {
      // Mostrar mensaje de error
      this.$swal('Error', 'Hubo un error al realizar la acción', 'error');
    },
  },
};
</script>

<style scoped>

/* Estilo para el botón amarillo */

.li-form-body {
  box-shadow: 0px 5px 3px 2px darkgrey;
  align-items: center;
  justify-content: space-between;
  max-width: 40rem;
  margin: auto;
  color: rgb(0, 0, 0);
  padding: 10px 10px;
  border: 1px solid #00000066;
  border-radius: 10px;
  margin-bottom: 20px;
}
.conteiner-title-cart{
  margin-bottom: 0.3rem;
  font-family: cursive
}
.title-cart{
  font-weight: 400;
}
.fila-li-headee{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conteiner-fe{
  padding: 15px 0px 0px 10px;
  font-size: 11px;
  font-family: sans-serif;
  color: #000000;
    
}
.conteiner-fe h2{
  font-weight: 400;
  border-bottom: 1px solid;
}
.columano-title{
  padding: 10px;
  font-size: 18px;
  font-family: cursive;
}

.file-fi{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.li-data {
  box-shadow: 2px 2px 0px 0px #9b9b9b;
  background: #5555bbc9;
  color: white;
  font-size: 10px;
  border: 1px solid rgb(0 0 0 / 13%);
  width: 36%;
  padding: 4px 10px;
  margin-right: 5vh;
  font-family: ui-sans-serif;
  border-radius: 12px;
}
.li-data h1 {
  font-weight: 600;
  white-space: nowrap; /* Evita que el texto se divida en varias líneas */
  overflow: hidden; /* Oculta el texto que excede el ancho del contenedor */
  text-overflow: ellipsis; /* Agrega puntos suspensivos (...) al final del texto truncado */
}
.file {
  display: flex;
}

.container-btn {
  padding: 0 10px;
}

.btn-file {
  box-shadow: 2px 2px 0px 0px #9b9b9b;
  color: #fff;
  background: #55b;
  border: none;
  font-size: 5vh;
  border-radius: 15px;
  padding: 5px 15px;
}

.btn-file:hover {
  cursor: pointer;
  color: rgb(194, 194, 194);
  background: #55b;
  /* Cambio de color al pasar el ratón */
  transform: scale(1.05);
  /* Efecto de escala al pasar el ratón */
  border: 1px solid #9b9b9b;
}

.btn-file:active {
    transform: scale(0.95);
    /* Efecto de clic (escala ligeramente hacia abajo) */
}


.btn-amarillo {
  color: yellow;
  background: #55b;
  border: none;
  font-size: 5vh;
  border-radius: 15px;
  padding: 5px;
}
.btn-amarillo:hover{
  cursor: pointer;
  color: rgb(255, 255, 255);
  background: hwb(0 85% 15%);
  /* Cambio de color al pasar el ratón */
  transform: scale(1.05);
  /* Efecto de escala al pasar el ratón */
  border: 1px solid #9b9b9b;
}

.btn-amarillo:active {
    transform: scale(0.95);
    /* Efecto de clic (escala ligeramente hacia abajo) */
}
.btn-favorito {
  box-shadow: 2px 2px 0px 0px #9b9b9b;
  color: #fff;
  background: #55b;
  border: none;
  font-size: 5vh;
  border-radius: 15px;
  padding: 5px;
  /* Cambio de cursor al pasar el ratón */
    transition: background-color 0.3s, transform 0.3s;
  /* Animación de cambio de color y escala */
}

.btn-favorito:hover {
  cursor: pointer;
  color: #ffe34a;
  /* Cambio de color al pasar el ratón */
  transform: scale(1.05);
  background: #55b;
  /* Efecto de escala al pasar el ratón */
  border: 1px solid #9b9b9b;
}



.btn-favorito:active {
    transform: scale(0.95);
    /* Efecto de clic (escala ligeramente hacia abajo) */
}
@media all and (max-width: 881px) {
  .file-fi {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .li-data {
    width: 60%;
  }
  .conteiner-fe {
    padding-top: 15px;
  }

}
</style>
