<template>
  <div>
    <componente1 :datos="datoComunas" v-if="paginaActual === 1" @cambiar-pagina="cambiarPagina" @comunas-seleccionadas="capturarComunas" />
    <componente2 v-if="paginaActual === 2"  @cambiar-pagina="cambiarPagina" @producto-servicio="capturarPsSs" />
    <componente3 v-if="paginaActual === 3"  @cambiar-pagina="cambiarPagina" @codificaciones-seleccionadas="capturarCodificaciones"/>
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
  mounted() {
    this.datosCuestionarios();
  },
  methods: {
    cambiarPagina() {
      if (this.paginaActual < 4) {
        this.paginaActual++;
      } else {
        // Aquí puedes agregar lógica para manejar la situación después de completar todas las páginas.
        console.log(this.comunasSeleccionadas)
        console.log(this.productosServiciosSeleccionados)
        console.log(this.codificaciónLicitacionesSeleccionados)
        console.log(this.parametosLicitacionesSeleccionados)
        console.log('Formularios completados. Redirigir o hacer algo más.');
        // Aquí puedes agregar la lógica para redirigir a la página de inicio.
        // Ejemplo: this.$router.push('/inicio');
        this.datosUsarioPreferencia(
          this.comunasSeleccionadas, 
          this.productosServiciosSeleccionados, 
          this.codificaciónLicitacionesSeleccionados,
          this.parametosLicitacionesSeleccionados
        );
        this.$router.push('/');
      }
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
      console.log('Parámetros capturados:', parametosLicitacionesSeleccionados);
      this.parametosLicitacionesSeleccionados = parametosLicitacionesSeleccionados
    },

    async datosCuestionarios() {
      try {
        const response = await licitUp_bk.datoCuestionario();
        this.datoComunas = response.data.comunas;
      } catch (error) {
        console.error('Error al realizar la consulta:', error);
      }
    },

    async datosUsarioPreferencia(ls1, ls2, ls3, ls4){
    try {
      const response = await licitUp_bk.datoCuestionarioUsuario(ls1, ls2, ls3, ls4);
      console.log(response);
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
    }
  }

  },
};
</script>








