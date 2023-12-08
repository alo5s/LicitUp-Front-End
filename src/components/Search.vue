<template>
  <div class="conteiner-search">
    <form @submit.prevent="buscarEndb" method="GET" class="form-search">
      <div class="search-container">
        <button>
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </button>
        <input type="search-text" v-model="codigoBusqueda" @input="buscarEnTiempoReal" placeholder="Buscar Por Codigo o nombre ..."
          name="search" />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      codigoBusqueda: "",
    };
  },
  methods: {
    buscarEndb() {
      // Emitir el evento cuando se envía el formulario
      this.$emit("busqueda-realizada", this.codigoBusqueda);
    },
    buscarEnTiempoReal() {
      // Emitir el evento en tiempo real
      this.$emit("busqueda-en-tiempo-real", this.codigoBusqueda);
    },
  },
};
</script>

<style scoped>
input[type="search-text"] {
  width: 99%;
  font-size: 15px;
  border: 1px solid rgb(0 0 0 / 13%);
  margin: 10px 0px;
  border-radius: 5px;
  padding: 15px 18px;
  box-sizing: border-box;
}
.form-search {
  max-width: 50rem;
  margin: auto;
  border: 1px solid rgba(255, 255, 255, 0.125);
  padding: 20px 25px;
}

.search-container {
  position: relative;
  margin: 0px 10px;
}
.search-container button {
  font-size: 25px;
  border: none;
  padding: 5px 10px;
  background: transparent;
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  color: #5e5e5e;
  cursor: pointer;
}
</style>
