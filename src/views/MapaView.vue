<template>
  <div class="conteiner-map">
    <div id="map"></div>
  </div>
</template>
  
<script>

import licitUp_bk from '../authentication/licitup_request';
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {

  data() {  
    return {
      cities: [], // Aquí almacenaremos los datos de las ciudades
      usuarioEstaLogueado: false,

    };
  },


  // Crear maounta ()
  mounted() {
    // Img
    L.Marker.prototype.options.icon = L.icon({
      iconUrl: '/icon.png', // Ruta absoluta a la imagen del marcador
      shadowUrl: '/shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });

    // Crear un mapa Leaflet en el elemento con id "map"
    const map = L.map("map").setView([-33.4489, -70.6693], 5); // Coordenadas de Santiago, Chile y zoom

    // Añadir una capa de mapa base (por ejemplo, OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // Marcar ciudades obtenidas del backend
    this.fetchCityData().then((data) => {
      this.cities = data;
      this.cities.forEach((city) => {
        const marker = L.marker([city.coordenada.latitud, city.coordenada.longitud])
          .addTo(map)
          .on('mouseover', function () {
            this.openPopup();
          })
          .on('mouseout', function () {
            this.closePopup();
          });

        // Condición para mostrar diferentes popups según si el usuario está autenticado o no
        if (this.usuarioEstaLogueado) {
          marker.bindPopup(city.ciudad)
            .on("click", () => {
              this.$router.push({ name: 'MapaLicitacionesViews', params: { ciudad: city.ciudad, id: city.id } });
            });
        } else {
          marker.bindPopup(city.ciudad + ' <br> Licitaciones: ' + city.Cantidad)
            .on("click", () => {
              this.$router.push({ name: 'MapaLicitacionesViews', params: { ciudad: city.ciudad, id: city.id } });
            });
        }
      });
    });
  },
  
  // Realizar una solicitud al backend para obtener datos de la ciudad

  methods: {
    async fetchCityData() {
      try {
        const isUserAuthenticated = licitUp_bk.isAuthenticated();
        this.usuarioEstaLogueado = isUserAuthenticated;
        
        if(isUserAuthenticated){
          // Si el usuario está logueado, realiza la consulta a mapa_profile
          const response = await licitUp_bk.mapa_perfil();
          const data = response.data; // Asumiendo que los datos de las ciudades están en la propiedad 'data'
          return data;

        } else {
          // Si el usuario no está logueado, realiza la consulta normal a mapa
          // Realizar una solicitud al backend para obtener datos de la ciudad
          const response = await licitUp_bk.mapa();
          const data = response.data; // Asumiendo que los datos de las ciudades están en la propiedad 'data'
          return data;
        }
      } catch (error) {
        console.error("Error al obtener datos de la ciudad:", error);
        return [];
      }
    },
  },
};

</script>

<style>
#map {
    height: 500px;
    /* Ajusta la altura según tus necesidades */
    width: 800px;
    padding-top: 20px;
    padding-left: 10px;
    background: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 22px 35px -16px rgb(75 31 31);
}

.conteiner-map {
  background: whitesmoke;
    display: flex;
    justify-content: center;
    padding: 25px;
    
}
</style>