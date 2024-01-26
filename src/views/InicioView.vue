<template>
    <div class="background-image"></div>
    <div class="conteiner-InicioTitle">
        <div class="title-home">
            <h1>
                Maximiza tu tiempo: con LicitUp descubre
                <span class="text-color">{{ data.cantidad }}</span>
                Licitaciones publicadas a la fecha
                <span class="text-color">{{fechaChile}}</span>
                y usa Nuestras Herramientas
            </h1>
        </div>
    </div>
</template>
<script>
import licitUp_bk from '../authentication/licitup_request.js'
import moment from 'moment-timezone';

export default {
    data() {
        return {
            data: {
                cantidad: 0,

            },
            fechaChile: ''
        }
    },
    mounted() {
        this.fetchData()
        this.mostrarFechaChile();
    },

    methods: {
        async fetchData() {
            try {
                const response = await licitUp_bk.count()
                this.data.cantidad = response.data.total;
            } catch (error) {
                console.error("Error al obtener datos en fetchData:", error);
            }
        },
        mostrarFechaChile() {
            // Configurar moment para usar la zona horaria de Chile
            moment.tz.setDefault('America/Santiago')  ;

          // Obtener la fecha actual en formato deseado (puedes ajustar el formato según tus necesidades) DD-MM-YYYY'
          this.fechaChile = moment().format('DD-MM-YYYY');
        },
     }

}
</script>


<style scoped>
.background-image {
    position: absolute;
    top: 100px;
    left: 0;
    width: 100%;
    height: 120%;
    background-image: url('../img/fondo.png');
    background-repeat: no-repeat;
    background-position: center center;
    z-index: -1;
}

.conteiner-InicioTitle {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10%;
}

.title-home h1 {
    font-family: monospace;
    font-size: 30px;
    font-weight: 300;
    text-align: center;
}

.text-color {
    color: #0667B4;
}

@media all and (max-width: 881px) {
    .background-image {
        background-size: contain;
    }
}
</style>
