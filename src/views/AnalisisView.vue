<template>
  <div>
    <div class="container">
      <div class="container-chart">
        <div id="chart">
        <select v-model="selectedOption" @change="updateChartData">
          <option v-for="option in options" :value="option">{{ option }}</option>
        </select>
        <div class="scrollable-div">
          <div>
            <apexchart
              v-if="chartSeries.length > 0"
              width="800"
              type="line"
              :options="chartOptions"
              :series="chartSeries"
            ></apexchart>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import licitUp_bk from '../authentication/licitup_request';

export default {
  data() {
    return {
      selectedOption: 'seleccionar',
      options: ['seleccionar'],
      chartOptions: {
        chart: {
          id: "vuechart-example",
        },
        title: {
          text: 'Análisis exponencial para predecir productos mas demandado del 2023',
          align: 'center',
          style: {
            fontSize: "14px",
            color: '#666'
          }
        },
        xaxis: {
          categories: [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ],
        },
      },
      chartSeries: [],
    };
  },
  mounted() {
    this.fetchDataFromAPI();
  },
  methods: {
    async fetchDataFromAPI() {
      try {
        const response = await licitUp_bk.analisis();
        this.apiResponse = response.data || {};
        this.chartSeries = Object.keys(this.apiResponse).map(option => ({
          name: option,
          data: this.apiResponse[option],
        }));
        this.options = ['seleccionar', ...Object.keys(this.apiResponse)];
      } catch (error) {
        console.error('Error al realizar la consulta:', error);
      }
    },
    updateChartData() {
      if (this.selectedOption === 'seleccionar') {
        this.chartSeries = Object.keys(this.apiResponse).map(option => ({
          name: option,
          data: this.apiResponse[option],
        }));
      } else {
        const selectedData = this.apiResponse[this.selectedOption] || [];
        this.chartSeries = [{
          name: this.selectedOption,
          data: selectedData,
        }];
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 10px;
}
select {
  background-color: white;
  /* position: absolute; */
  z-index: 11;
  max-width: 176px;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
}
.container-chart{
  padding: 15px 20px;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 22px 35px -16px rgb(75 31 31);
}
#chart {
  padding: 15px 30px;
}

.scrollable-div{
  padding-top: 30px;
}
/* Aplica el estilo de desplazamiento solo en tamaños de pantalla más pequeños */
@media (max-width: 768px) {
  .scrollable-div {
    overflow-y: auto;
  }
}
</style>