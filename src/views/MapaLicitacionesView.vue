<template>
    <div class="comuna">
      <h1>Comuna: {{ ciudad }}</h1>
    </div>
    <div v-if="cargando" class="conteiner-cargar">
        <div class="cargando-login"></div>
    </div>
        
    <div v-else>        
        <div v-for="datos in articles">
            <LiCart :datos="datos" :listaDeSeguimiento="listaDeSeguimiento" @actualizar-lista-seguimiento="listFavorito" />
        </div>
        
        <div v-if="articles.length === 0">
            <p class="texto-li" v-if="!usuarioEstaLogueado">No hay licitaciones disponibles en este momento en la comuna {{ ciudad }}.</p>
            <p class="texto-li" v-if="usuarioEstaLogueado">No tienemos licitaciones disponibles en este momento en la comuna {{ ciudad }}.</p>
        </div>
        
        <div class="conteiner-paginado">
            <div v-if="pages > 1 ">
                <button class="btn-paginado" @click="changePage(page - 1)">&lt;&lt;</button>
                <button class="btn-paginado" v-for="pageNumber in visiblePages" :key="pageNumber" @click="changePage(pageNumber)"
                        :class="{ 'active-page': pageNumber === page }"> {{ pageNumber }} </button>
                <button class="btn-paginado" @click="changePage(page + 1)">&gt;&gt;</button>
            </div>
        </div>
    </div>
</template>
<script>
import licitUp_bk from '../authentication/licitup_request';

import LiCart from '../components/LiCart.vue';

export default {
    components: {
        LiCart,
    },
    data() {
    return {
      cargando: false,
      usuarioEstaLogueado: false, // Asegúrate de ajustar esta propiedad según la lógica de autenticación en tu aplicación


      buscarEndb: '',
      busquedaEnTiempoReal: '',
      articles: [],
      page: 1,
      pages: [],
      visiblePages: [],
      ciudad: '', // Variable para almacenar el nombre de la ciudad
      id: '',     // Variable para almacenar la ID de la ciudad
      //
      listaDeSeguimiento: [], // Aquí se almacena los IDs de seguimiento
    };
  },
  async mounted() {
    // Capturar los parámetros de la URL (ciudad e id)
    this.ciudad = this.$route.params.ciudad;
    this.id = this.$route.params.id;
    this.listFavorito()
    // Llamar a la función allLici solo después de capturar los parámetros
    await this.allLici();
    
  },
  methods: {
    async allLici() {
      try {
        this.cargando = true;

        const isUserAuthenticated = licitUp_bk.isAuthenticated();
        this.usuarioEstaLogueado = isUserAuthenticated;
        
        if (isUserAuthenticated){
          // Si el usuario está logueado, realiza la consulta a perfil_licitaciones
          const response = await licitUp_bk.licitaciones_mapa_perfil(this.ciudad, this.page)
          this.articles = response.data.licitaciones_pagina;
          this.pages = response.data.total_paginas;
        } else {
          // Si el usuario no está logueado, realiza la consulta normal a licitaciones
          const response = await licitUp_bk.mapaLicitaciones(this.id, this.page);
          this.articles = response.data.licitaciones_pagina;
          this.pages = response.data.total_paginas;
        }
        const startPage = Math.max(1, this.page - 3);
        const endPage = Math.min(this.pages, startPage + 4);
        this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
      } catch (error) {
        console.error("Error al obtener datos en fetchData:", error);
      } finally {
        this.cargando = false;
      }
    },

    async listFavorito() {
        if (licitUp_bk.isAuthenticated()) {
            try {
                const response = await licitUp_bk.listFavorites();
                // Actualiza la lista de seguimiento aquí
                this.listaDeSeguimiento = response.data.lista_seguimiento;
            } catch (error) {
                console.error("Error no Cargan los datos:", error);
            }
        }
    },

    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.pages) {
        this.page = newPage;
        const scrollOptions = {
          top: 0, // Desplazar al inicio de la página
          behavior: 'smooth', // Desplazamiento suave
        };
        // Realizar el desplazamiento al inicio de la página
        window.scrollTo(scrollOptions);
        // Cargar los datos de la nueva página después del desplazamiento
        this.allLici();
      }
    },

  }

}

</script>
<style>
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
.conteiner-cargar {
    display: flex;
    justify-content: center;
    padding: 11%;
}
.cargando-login{
    border: 6px solid #fff;
    border-radius: 100%;
    border-top-color: #7967d2;
    border-bottom-color: #7967d2;
    width: 15rem;
    height: 15rem;
    animation: loading-1b5bf67c 1.5s infinite linear;
}

.comuna{
  text-align: center;
  max-width: 50rem;
  margin: auto;
  border: 1px solid rgba(255, 255, 255, 0.125);
  padding: 20px 25px;
}
</style>