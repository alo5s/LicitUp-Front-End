<template>
  <div id="app">
    <div class="content">
      <NavBar></NavBar>
      <router-view />
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue'

export default {
  components: {
    NavBar,
    Footer
  },
};

</script > 
  
<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  /* Esto permite que el contenido principal ocupe todo el espacio disponible en el contenedor */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;

}
</style>