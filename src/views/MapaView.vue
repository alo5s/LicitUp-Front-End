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
      cities: [],
      usuarioEstaLogueado: false,
    };
  },

  mounted() {
    L.Marker.prototype.options.icon = L.icon({
      iconUrl: "/icon.png",
      shadowUrl: "/shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });

    const map = L.map("map").setView([-33.4489, -70.6693], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    this.fetchCityData().then((data) => {
      this.cities = data;
      this.markCitiesOnMap(map);
    });
  },

  methods: {
    async fetchCityData() {
      try {
        const isUserAuthenticated = licitUp_bk.isAuthenticated();
        this.usuarioEstaLogueado = isUserAuthenticated;

        const response = isUserAuthenticated
          ? await licitUp_bk.mapa_perfil()
          : await licitUp_bk.mapa();

        return response.data || [];
      } catch (error) {
        console.error("Error al obtener datos de la ciudad:", error);
        return [];
      }
    },

    markCitiesOnMap(map) {
      this.cities.forEach((city) => {
        if (this.shouldMarkCity(city)) {
          const marker = L.marker([city.coordenada.latitud, city.coordenada.longitud])
            .addTo(map)
            .on("mouseover", () => marker.openPopup())
            .on("mouseout", () => marker.closePopup())
            .bindPopup(this.getPopupContent(city))
            .on("click", () => this.navigateToCity(city));
        }
      });
    },

    shouldMarkCity(city) {
      return (
        this.usuarioEstaLogueado ||
        (city.Cantidad !== undefined && city.Cantidad > 0)
      );
    },

    getPopupContent(city) {
      return this.usuarioEstaLogueado
        ? city.ciudad
        : `${city.ciudad} <br> Licitaciones: ${city.Cantidad}`;
    },

    navigateToCity(city) {
      this.$router.push({ name: "MapaLicitacionesViews", params: { ciudad: city.ciudad, id: city.id } });
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