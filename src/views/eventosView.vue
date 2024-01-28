<template>
  <div>
    <componente1 :datos="datoComunas" :comunas-seleccionadas="comunasSeleccionadas" v-if="paginaActual === 1" @cambiar-pagina="cambiarPagina" @comunas-seleccionadas="capturarComunas" />
    <componente2 v-if="paginaActual === 2"  :productos-servicios-seleccionados="productosServiciosSeleccionados" @cambiar-pagina="cambiarPagina" @producto-servicio="capturarPsSs" />
    <componente3 v-if="paginaActual === 3" :codificaciónLicitacionesSeleccionados="codificaciónLicitacionesSeleccionados" @cambiar-pagina="cambiarPagina" @codificaciones-seleccionadas="capturarCodificaciones"/>
    <componente4 v-if="paginaActual === 4"  @cambiar-pagina="cambiarPagina" @parametros-seleccionados="capturarParametros"/>
  </div>
</template>

<script>
import licitUp_bk from '../authentication/licitup_request';
import Componente1 from '../components/components-usario/Componente1.vue';
import Componente2 from '../components/components-usario/Componente2.vue';
import Componente3 from '../components/components-usario/Componente3.vue';
import Componente4 from '../components/components-usario/Componente4.vue';


export default {

  components: {
    Componente1,
    Componente2,
    Componente3,
    Componente4,
  },
  data() {
    return {
      paginaActual: 1,
      datoComunas: [],
      // Esta son los datos de lo componentes
      comunasSeleccionadas: [],
      productosServiciosSeleccionados: [],
      codificaciónLicitacionesSeleccionados: [],
      parametosLicitacionesSeleccionados: [],
      
    };
  },
  methods: {
    cambiarPagina(regresar = false) {
      if (regresar) {
        // Si se está regresando, simplemente disminuye la página actual
        if (this.paginaActual > 1) {
          this.paginaActual--;1
        } else {
          // Página actual ya es 1, no se puede disminuir más
          console.warn('Ya estás en la primera página.');
        }
      } else {
        // Si no se está regresando, aumenta la página actual
        if (this.paginaActual < 4) {
          this.paginaActual++;
        } else {
          // Aquí puedes agregar lógica para manejar la situación después de completar todas las páginas.
          console.log('Formularios completados. Redirigir o hacer algo más.');
          // Aquí puedes agregar la lógica para redirigir a la página de inicio.
          // Ejemplo: this.$router.push('/inicio');
          this.datosUsarioPreferencia(
            this.comunasSeleccionadas, 
            this.productosServiciosSeleccionados, 
            this.codificaciónLicitacionesSeleccionados,
            this.parametosLicitacionesSeleccionados
          );
          this.mostrarAlertaExito();
          this.$router.push('/');

        }
      }
      // Al cambiar de página, emitir un evento con las comunas seleccionadas
      this.$emit('comunas-seleccionadas', this.comunasSeleccionadas);
    },

    capturarComunas(comunasSeleccionadas) {
      this.comunasSeleccionadas = comunasSeleccionadas;
    },
    capturarPsSs(productosServiciosSeleccionados) {
      this.productosServiciosSeleccionados = productosServiciosSeleccionados;
    },
    capturarCodificaciones(codificaciónLicitacionesSeleccionados){
      this.codificaciónLicitacionesSeleccionados = codificaciónLicitacionesSeleccionados
    },

    capturarParametros(parametosLicitacionesSeleccionados){
      this.parametosLicitacionesSeleccionados = parametosLicitacionesSeleccionados
    },

    async datosUsarioPreferencia(ls1, ls2, ls3, ls4){
    try {
      const response = await licitUp_bk.datoCuestionarioUsuario(ls1, ls2, ls3, ls4);
      console.log(response);
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
    }
  },
  mostrarAlertaExito() {
      // Mostrar mensaje de éxito
      this.$swal({
        icon: 'success',
        title: 'El perfil completado con éxito.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    },
  },
};
</script>








