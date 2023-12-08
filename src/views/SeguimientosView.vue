<template>
  <div>
    <Search @busqueda-en-tiempo-real="actualizarBusquedaEnTiempoReal" />
    <div v-for="datos in filteredArticles" :key="datos.CodigoExterno">
        <Lisigumiento :datos="datos" @confirmar-dejar-de-seguir="dejarDeSeguirLicitacion" />
    </div>
  </div>
</template>

<script>
import licitUp_bk from '../authentication/licitup_request';
import Search from '../components/Search.vue';
import Lisigumiento from '../components/Liseguimiento.vue';

export default {
  components: {
    Search,
    Lisigumiento
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
        console.log(this.articles);
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

    mostrarAlertaError() {
      this.$swal('Error', 'Hubo un error al realizar la acción', 'error');
    },
  },
};
</script>
