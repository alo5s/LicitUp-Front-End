<template>
  <div>
    <Search @busqueda-en-tiempo-real="actualizarBusquedaEnTiempoReal" />
    <div class="center">
      <div v-for="licitacion in filteredArticles" :key="licitacion.CodigoExterno" class="carousel-item">
      <div class="conteiner">
        <div v-if="licitacion.id_orden_compra !== null">
          <button v-if="licitacion.mostrarOrdenCompra" @click="mostrarOrdenCompra(licitacion)" class="btn-arrow-left">
            <font-awesome-icon :icon="['fas', 'arrow-left']" />        
          </button>
        </div>
        <div>
          <div>
            <Lisigumiento v-if="!licitacion.mostrarOrdenCompra" :datos="licitacion" @confirmar-dejar-de-seguir="dejarDeSeguirLicitacion" />
          </div>
          <div  v-if="licitacion.mostrarOrdenCompra">
            <Ordencompra :datos="licitacion.ordenCompra ? licitacion.ordenCompra : {}" />
          </div>
        </div>
        
        <div v-if="licitacion.id_orden_compra !== null">
          <button @click="mostrarOrdenCompra(licitacion)" v-if="!licitacion.mostrarOrdenCompra" class="btn-arrow-right">
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </button>
        </div>
      </div>
      <div class="circulos" v-if="licitacion.id_orden_compra !== null">
        <span :class="{ activo: !licitacion.mostrarOrdenCompra }"></span>
        <span :class="{ activo: licitacion.mostrarOrdenCompra }"></span>
      </div>
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

    actualizarBusquedaEnTiempoReal(data) {
      this.filtro = data;
    },

    async mostrarOrdenCompra(licitacion) {
      try {
          let estadoUsuario = this.getEstadoUsuarioFromCookie(); // Obtener el estado del usuario desde la cookie
          if (!estadoUsuario) {
              // Si no hay estado en la cookie o ha expirado, hacer la consulta al backend
              const response = await licitUp_bk.estadoUsuario();
              estadoUsuario = response.data.estado[0];
              // Guardar el estado del usuario en la cookie con un tiempo de expiración de 3 minutos
              this.setEstadoUsuarioCookie(estadoUsuario);
              // Establecer el temporizador para que la cookie expire después de 3 minutos
              setTimeout(() => {
                  this.removeEstadoUsuarioCookie();
              }, 3 * 60 * 1000); // 3 minutos en milisegundos
          }

          console.log(estadoUsuario);

          if (estadoUsuario) {
              // Oculta Lisigumiento y muestra Ordencompra
              licitacion.mostrarOrdenCompra = !licitacion.mostrarOrdenCompra;
              // Si se está mostrando la Orden de Compra, oculta Lisigumiento
              if (licitacion.mostrarOrdenCompra) {
                  licitacion.mostrarLisigumiento = false;
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
  getEstadoUsuarioFromCookie() {
      // Obtener todas las cookies
      const cookies = document.cookie;
      if (cookies) {
          // Buscar la cookie 'estadoUsuario'
          const cookieEstadoUsuario = cookies.split('; ').find(row => row.startsWith('estadoUsuario='));
          if (cookieEstadoUsuario) {
              // Si se encuentra la cookie 'estadoUsuario', obtener su valor
              return cookieEstadoUsuario.split('=')[1];
          }
      }
      // Si la cookie 'estadoUsuario' no está presente, devolver null
      return null;
    },
    setEstadoUsuarioCookie(estadoUsuario) {
        // Guardar el estado del usuario en la cookie con un tiempo de expiración de 3 minutos
        document.cookie = `estadoUsuario=${estadoUsuario};max-age=180`; // 3 minutos en segundos
    },
    removeEstadoUsuarioCookie() {
        // Eliminar la cookie del estado del usuario
        document.cookie = "estadoUsuario=;max-age=0";
    },

    async SegumientoLiciTodas() {
      try {
        const response = await licitUp_bk.segumientoLicit();
        const { licitaciones, ordenes_de_compra } = response.data;
        
        for (const licitacion of licitaciones) {
          // Agregar propiedad mostrarOrdenCompra
          licitacion.mostrarOrdenCompra = false;
          
          console.log('Código externo de la licitación:', licitacion.CodigoExterno);


          // Buscar la orden de compra asociada
          const ordenCompra = ordenes_de_compra.find(orden => orden.id === licitacion.id_orden_compra);

          // licitacion.ordenCompra = ordenCompra;
          licitacion.ordenCompra = ordenCompra || null; // Asignar null si no se encuentra la orden de compra        
          this.articles.push(licitacion);
        }
      } catch (error) {
        console.error('Error al realizar la consulta:', error);
      }
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

  }
}
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
.btn-arrow-right {
  position: absolute;
  font-size: 4vh;
  background: none;
  border: none;
  margin: 0px 5px;
}
.btn-arrow-left{
  position: absolute;
  font-size: 4vh;
  background: none;
  border: none;
  margin: 0px -30px;
}

</style>
