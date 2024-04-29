<template>
    <Search @busqueda-en-tiempo-real="actualizarBusquedaEnTiempoReal" @busqueda-realizada="capturarBusqueda" />
    <div v-if="!usuarioEstaLogueado">
        <div class="conteiner-btn-consulta">
            <div style="margin-right: 1rem;" >
                <button class="btm-consulta" @click="toggleConsulta">{{ consultaVisible ? 'Ocultar Filtro' : 'Mostrar Filtro' }}</button>
            </div>
        </div>
        <div class="conteiner-consulta" :class="{ 'consulta-visible': consultaVisible }">
            <div class="form-consulta">
                <label class="mr-3">Estado:</label>
                <select id="ets" name="ets" class="form-control mr-3" ref="ets" v-model="estado" @change="actualizarElementosPorEstado">
                    <option value="Publicada">Publicada</option>
                    <option value="Cerrada">Cerrada</option>
                    <option value="Desierta">Desierta</option>
                    <option value="Adjudicada">Adjudicada</option>
                    <option value="Revocada">Revocada</option>
                    <!-- Agrega aquí las otras opciones -->
                </select>
                <label class="mr-3" >Fecha inicial</label>
                <input type="date" class="form-control mr-3" v-model="fecha_inicial" :max="getMaxStartDate()"  @change="actualizarElementosPorFechas('inicio')">
                
                <label class="mr-3">Fecha Final</label>
                <input type="date" class="form-control mr-3" v-model="fecha_final" :min="fecha_inicial" @change="actualizarElementosPorFechas('final')">
            </div>
            <div class="button-container">
              <button class="mr-3 btn-reset" @click="resetearValores">Limpiar Filtro</button>
            </div>
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

    <div v-if="cargando" class="conteiner-cargar">
        <div class="cargando-login"></div>
    </div>
        
    <div v-else>        
        <div v-for="datos in articles">
            <LiCart :datos="datos" :listaDeSeguimiento="listaDeSeguimiento" :listaEstado="estado" @actualizar-lista-seguimiento="listFavorito" />
        </div>
        
        <div v-if="articles.length === 0">
            <p class="texto-li" v-if="!usuarioEstaLogueado">No hay licitaciones disponibles en este momento.</p>
            <p class="texto-li" v-if="usuarioEstaLogueado">No tienes licitaciones disponibles en este momento.</p>
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

import Search from '../components/Search.vue';
import LiCart from '../components/LiCart.vue';

export default {
    components: {
        Search,
        LiCart,
    },
    data() {
        return {
            cargando: false,
            usuarioEstaLogueado: false, // Asegúrate de ajustar esta propiedad según la lógica de autenticación en tu aplicación

            consultaVisible: false, // Agrega esta propiedad

            buscarEndb: '',
            busquedaEnTiempoReal: '',
            // allLici
            articles: [],
            page: 1,
            orden: "desc",
            pages: [],
            visiblePages: [],
            // estados
            elementosPorPagina: '25', // Valor predeterminado
            estado: 'Publicada',
            //
            date:"",
            fecha_inicial: null,
            fecha_final: null,
            //
            listaDeSeguimiento: [], // Aquí se almacena los IDs de seguimiento
        };
    },
    mounted() {
        this.liciTodas()
        this.listFavorito()
    },
    methods: {
        toggleConsulta() {
          this.consultaVisible = !this.consultaVisible;
        },
        resetearValores() {
          this.fecha_inicial = null;
          this.fecha_final = null;
          this.estado = 'Publicada';
          this.liciTodas();
        },
        actualizarBusquedaEnTiempoReal(data) {
            this.busquedaEnTiempoReal = data;
        },
        capturarBusqueda(data) {
            // console.log('capturado en el componente padre', data);
            this.buscarEndb = data;
            this.realizarConsulta();
        },
        actualizarElementosPorEstado(){
            this.estado = this.$refs.ets.value;
            this.liciTodas();
        },

        actualizarElementosPorPagina() {
            // Obtener el valor seleccionado en el campo "Ordenar" y actualizar elementosPorPagina
            this.elementosPorPagina = this.$refs.top.value;
            // Realizar la consulta nuevamente con el nuevo valor
            this.liciTodas();
        },

        getMaxStartDate() {
          const today = new Date();
          today.setDate(today.getDate() - 1); // Agrega un día a la fecha actual
          return today.toISOString().split('T')[0];
        },
  
        actualizarElementosPorFechas(seleccion) {
            if (seleccion === 'inicio' && this.fecha_inicial) {
                // Llama a la función para enviar al backend la fecha de inicio
            } else if (seleccion === 'final' && this.fecha_final) {
                // Verifica si la fecha final es anterior a la fecha inicial
                if (this.fecha_inicial && this.fecha_final < this.fecha_inicial) {
                    // Si la fecha final es anterior, establece la fecha final como igual a la fecha inicial
                    this.fecha_final = this.fecha_inicial;
                    console.log("La fecha final no puede ser anterior a la fecha inicial. Se ha ajustado automáticamente.");
                }
                // Llama a la función para enviar al backend la fecha final
            } else {
                console.error("Fecha no válida. Asegúrese de que la fecha seleccionada esté definida y sea válida.");
            }
            this.liciTodas();
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
        
        async realizarConsulta() {
            try {
                if (this.buscarEndb.trim() === '') {
                    // Si la búsqueda está vacía, carga los datos de liciTodas
                    this.liciTodas();
                } else {
                    // Si hay una búsqueda, realiza la consulta de búsqueda
                    const response = await licitUp_bk.li_search(this.buscarEndb);
                    this.articles = response.data.licitaciones_pagina; // Actualiza los resultados
                    this.pages = response.data.total_paginas;
                    
                    
                
                    const startPage = Math.max(1, this.page - 3);
                    const endPage = Math.min(this.pages, startPage + 4);
                    this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
                }
            } catch (error) {
                console.error('Error al realizar la consulta:', error);
            }
        },

        async liciTodas() {
            try {
                this.cargando = true;

                const isUserAuthenticated = licitUp_bk.isAuthenticated();
                this.usuarioEstaLogueado = isUserAuthenticated;
                
                let totalLicitaciones = 0; // Variable para almacenar el total de licitaciones

                if (isUserAuthenticated) {
                    // Si el usuario está logueado, realiza la consulta a perfil_licitaciones
                    const response = await licitUp_bk.perfil_licitaciones(this.page);
                    this.articles = response.data.licitaciones_pagina;
                    this.pages = response.data.total_paginas;

                    totalLicitaciones = response.data.total_licitaciones;
                    
                } else {
                    // Si el usuario no está logueado, realiza la consulta normal a licitaciones
                    const response = await licitUp_bk.licitaciones(this.page, this.orden, this.estado, this.fecha_inicial, this.fecha_final);
                    this.articles = response.data.licitaciones_pagina;
                    this.pages = response.data.total_paginas;

                    totalLicitaciones = response.data.total_licitaciones;
                }
            
                const startPage = Math.max(1, this.page - 3);
                const endPage = Math.min(this.pages, startPage + 4);
                this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
                
                // Mostrar el mensaje de éxito con el número total de licitaciones
                this.mostrarTotalLicitacion(totalLicitaciones);
            
            } catch (error) {
                console.error('Error al realizar la consulta:', error);
            } finally {
                this.cargando = false;
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
                this.liciTodas();
            }
        },
        mostrarTotalLicitacion(totalLicitaciones) {
            // Obtener el número total de licitaciones
            // const totalLicitaciones = this.articles.length;

            // Mostrar un mensaje con el número total de licitaciones
            this.$swal({
                title: `Número de licitaciones: ${totalLicitaciones}`,
                toast: true,
                position: 'bottom-start',
                showConfirmButton: false,
                color: "#ffffff",
                background: "#2c2c55",
            });
        },
    },
};
</script>

<style scoped>
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

.texto-li{
    display: flex;
    justify-content: center;
    font-size: 2rem;
    padding: 5rem;
    color: #00000087;
    text-align: center;
}

.conteiner-paginado {
    display: flex;
    justify-content: center;
    padding: 40px;
}
.active-page {
  background-color: #ffffff !important;  /* Cambia el color de fondo a blanco */
  color: #000000; /* Cambia el color del texto a negro */
  box-shadow: 2px 2px 0px 0px #9b9b9b;
  border: 1px solid #9b9b9b !important;
  transform: scale(1.05);
  /* Otros estilos que desees aplicar a la página activa */
}   

.btn-paginado {
    box-shadow: 2px 2px 0px 0px #9b9b9b;
    padding: 15px 15px;
    margin: 0px 10px;
    background: #55B;
    border: none;
    font-size: 3vh;
    border-radius: 10px;
    cursor: pointer;
    /* Cambio de cursor al pasar el ratón */
    transition: background-color 0.3s, transform 0.3s;
    /* Animación de cambio de color y escala */
}

.btn-paginado:hover {
    background: white;
    /* Cambio de color al pasar el ratón */
    transform: scale(1.05);
    /* Efecto de escala al pasar el ratón */
    border: 1px solid #9b9b9b;
}

.btn-paginado:active {
    transform: scale(0.95);
    /* Efecto de clic (escala ligeramente hacia abajo) */
}



/* fomr consulta */
.conteiner-consulta {
    margin-bottom: 10vh;
}

.form-consulta {
    display: flex;
    width: auto;
    max-width: 50rem; /* Agregamos max-width para limitar el ancho máximo */
    margin: auto;
    border: 1px solid rgba(255, 255, 255, 0.125);
    padding: 20px 29px;
    justify-content: center;
}

.form-consulta label {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0;
}

.form-control {
    display: block;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.btn-consulta {
    border: 1px solid #00000080;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
}

.mr-3 {
    margin-right: 1rem;
}

.btn-reset{
    display: block;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;


    margin-left: 37px;
    width: 9rem;
}
.button-container {
  display: flex;
  justify-content: center;
}
.conteiner-btn-consulta{
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    align-items: center;
}
.btm-consulta {
    padding: 0.375rem 0.75rem;

    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    margin-left: 0;
    width: 10rem;

    border-radius: 0.25rem;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.btm-consulta:hover {
  cursor: pointer;
  /* Cambio de color al pasar el ratón */
  transform: scale(1.05);
  /* Efecto de escala al pasar el ratón */
  border: 1px solid #9b9b9b;
}



.btm-consulta:active {
    transform: scale(0.95);
    /* Efecto de clic (escala ligeramente hacia abajo) */
}

.conteiner-btn-consulta{
    display: none;
}
/* Mobile menu */
@media all and (max-width: 870px){
    .conteiner-consulta{
        display: none;
    }
    .btm-consulta {
        display: block;
    }

    .consulta-visible{
	height: calc(100% - 60px);
	display: flex ;
	flex-direction: column;
	align-items: center;
  }
  .form-consulta{
    flex-direction: column;
  }
  .btn-reset{
    margin-left: 0;
    width: 10rem;
  }
  .conteiner-btn-consulta{
    display: flex;
    }
}
</style>