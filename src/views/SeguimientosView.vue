<template>
  <div>
    <Search @busqueda-en-tiempo-real="actualizarBusquedaEnTiempoReal" />
    
    <div v-for="datos in filteredArticles" :key="datos.CodigoExterno" class="carousel-item">
      <div class="conteiner">
        <button  v-if="datos.mostrarOrdenCompra" @click="mostrarOrdenCompra(datos)">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />        
        </button>
        <div>
          <Lisigumiento v-if="!datos.mostrarOrdenCompra" :datos="datos" @confirmar-dejar-de-seguir="dejarDeSeguirLicitacion" />
        </div>
        <div v-if="datos.mostrarOrdenCompra" class="orden-compra">
          <div class="overlay">
            <h1>No hay dato</h1>
          </div>
          <div class="orden-compra-content">
            <Ordencompra :datos="datos" />
          </div>
        </div>
        <button @click="mostrarOrdenCompra(datos)" v-if="datos.mostrarOrdenCompra">
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
      </div>
      <div class="circulos" v-if="datos.mostrarOrdenCompra">
        <span :class="{ activo: !datos.mostrarOrdenCompra }"></span>
        <span :class="{ activo: datos.mostrarOrdenCompra }"></span>
      </div>
    </div>
    
  </div>
</template>

<script>
import licitUp_bk from '../authentication/licitup_request';
import Search from '../components/Search.vue';
import Lisigumiento from '../components/Liseguimiento.vue';
import Ordencompra from '../components/Ordencompra.vue'

export default {
  components: {
    Search,
    Lisigumiento,
    Ordencompra,
  },
  data() {
    return {
      articles: [],
      filtro: '',
      notificacion: false,
      eventSource: null,
    };
  },
  mounted() {
    this.SegumientoLiciTodas();
    // Iniciar la lógica de notificación cada 3 minutos
    //this.iniciarNotificacion();
    //setInterval(this.iniciarNotificacion, 60000);
  },
  computed: {
    filteredArticles() {
      const busqueda = this.filtro.toLowerCase();
      return this.articles.filter(licitacion =>
        licitacion.Descriptive_name.toLowerCase().includes(busqueda) ||
        licitacion.CodigoExterno.toLowerCase().includes(busqueda)
      );
    },
  },
  methods: {
    async mostrarOrdenCompra(datos) {
      try {
        const response = await licitUp_bk.estadoUsuario()
        console.log(response.data.estado[0])
        // Verificar el estado del usuario
        if (response.data.estado[0]) {
          // Oculta Lisigumiento y muestra Ordencompra
          datos.mostrarOrdenCompra = !datos.mostrarOrdenCompra;

          // Si se está mostrando la Orden de Compra, oculta Lisigumiento
          if (datos.mostrarOrdenCompra) {
            datos.mostrarLisigumiento = false;
          }
        } else {
          // Mostrar alerta indicando que la función es para usuarios con suscripción
          this.mostrarAlertaSuscripcion();
        }
      } catch (error) {
        console.error('Error al obtener estado del usuario:', error);
        // Mostrar alerta de error
        this.mostrarAlertaError();
      }
    },

    async iniciarNotificacion() {
      try {
        const response = await licitUp_bk.eventNotificacion();
        const { notificacion_activa } = response.data;
        if (notificacion_activa) {
          this.activarNotificacion();
          this.notificacion = true;
          // Configurar el temporizador para resetear la notificación después de 1 minuto
          setTimeout(() => {
            window.focus();
            this.notificacion = false;
          }, 60000); // 1 minuto (60 * 1000 ms)
        }
      } catch (error) {
        console.error('Error al realizar la consulta:', error);
      }
    },

    activarNotificacion() {
      if (Notification.permission === 'granted') {
        const options = {
          body: 'Este es el cuerpo de la notificación',
          icon: 'icon.png',
        };
        const notification = new Notification('Seguimiento Actualizado', options);
      }
    },

    async SegumientoLiciTodas() {
      try {
        const response = await licitUp_bk.segumientoLicit();
        this.articles = response.data.licitationes;
      } catch (error) {
        console.error('Error al realizar la consulta:', error);
      }
    },

    actualizarBusquedaEnTiempoReal(data) {
      this.filtro = data;
    },

    async dejarDeSeguirLicitacion(datos) {
      try {
        const codigoExterno = datos.CodigoExterno;
        await licitUp_bk.segumientoLicitDelete(codigoExterno);

        const index = this.articles.indexOf(datos);
        if (index > -1) {
          this.articles.splice(index, 1);
        }

        this.$emit('actualizar-lista-seguimiento');
        this.mostrarAlertaExito();
      } catch (error) {
        console.error('Error al dejar de seguir la licitación:', error);
        this.mostrarAlertaError();
      }
    },

    mostrarAlertaExito() {
      this.$swal({
        icon: 'success',
        title: 'Acción realizada exitosamente',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    },
    mostrarAlertaSuscripcion() {
      this.$swal({
        icon: 'warning',
        title: 'Acceso restringido',
        text: 'Esta función es para usuarios con suscripción.',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    },

    mostrarAlertaError() {
      this.$swal('Error', 'Hubo un error al realizar la acción', 'error');
    },
  },
};
</script>


<style scoped>
/* Estilos para el componente OrdencompraList */

/* Contenedor principal */
.orden-compra {
  position: relative;
}

/* Capa de superposición para el mensaje "No hay dato" */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* Fondo blanco semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1; /* Asegura que el overlay esté al frente */
}

/* Estilos para el texto "No hay dato" */
.overlay h1 {
  margin: 0;
  font-size: 24px;
  color: #333; /* Color del texto */
}

/* Contenido de Ordencompra detrás del overlay */
.orden-compra-content {
  position: relative;
  z-index: 0; /* Asegura que el contenido de la orden de compra esté detrás del overlay */
}

/* Contenedor de cada item en el bucle v-for */
.conteiner {
  display: flex;
  align-items: center;
}

/* Estilos para cada ítem del carrusel */
.carousel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease-in-out;
  padding-bottom: 3%;
}

/* Transición para la animación de entrada y salida de Ordencompra */
.mostrar .orden-compra {
  display: block;
  transform: translateX(-100%);
}

/* Contenedor para los círculos indicadores */
.circulos {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

/* Estilos para los círculos indicadores */
.circulos span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  margin: 0 5px;
  transition: background-color 0.3s ease-in-out;
}

/* Estilos para el círculo activo */
.circulos span.activo {
  background-color: #3498db; /* Color de resaltado cuando está activo */
}

/* Estilos para los botones de flecha */
button {
  font-size: 4vh;
  background: none;
  border: none;
  margin: 0px 5px;
}

</style>
