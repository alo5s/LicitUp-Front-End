<template>
  <header>
      <div class="content-menu-logo">
          <div class="Logo-Menu">
            <router-link class="link-logo" to="/">
              <h1 class="logo" >Licit<span class="up">Up</span></h1>
            </router-link>
               
          </div>
          <div class="btn-menu" >
            <button @click="toggleNav" >
              <font-awesome-icon v-if="!showMenu" :icon="['fas', 'bars']" />
              <font-awesome-icon v-if="showMenu" :icon="['fas', 'xmark']" />
            </button>
          </div>
      </div>
      <div class="content-nav-login" :class=" {'nav-link-ul-visible': showMenu }">
          <nav @click="closeMenu">
              <ul class="content-ul-li-a">
                  <li><router-link class="link" to="/">Inicio</router-link></li>
                  <li><router-link class="link" to="/Licitaciones">Licitaciones</router-link></li>
                  <li><router-link class="link" to="/Seguimientos">Seguimientos</router-link></li>
                  <li><router-link class="link" to="/Analisis">Análisis</router-link></li>
                  <li><router-link class="link" to="/Mapa">Mapa</router-link></li>

                  <!--------------------
                  <li><router-link class="link" to="/eventos">eventos</router-link></li>
                  <button v-if="isLoggedIn" @click="handleLogout" class="btn-logout btn-header" >Cerrar sesión</button>

                  ----------------------> 
                  <li> 
                    <router-link v-if="!isLoggedIn" to="/Login" class="btn-header">Iniciar sesión</router-link>
                    <router-link class=" usario " v-if="isLoggedIn" to="/Perfil">Perfil de Usuario</router-link>
                  </li>
              </ul>
          </nav> 
      </div>
  </header>
</template>
<script>
import licitUp_bk from '../authentication/licitup_request.js'

export default {
  data() {
    return {
      showMenu: false,
      isLoggedIn: licitUp_bk.isAuthenticated(), // Inicializar la propiedad desde el módulo auth
    };
  },
  methods: {
    toggleNav() {
      this.showMenu = !this.showMenu;
    },
    closeMenu() {
      this.showMenu = false;
    },
    async handleLogout() {
      // Cerrar sesión
      licitUp_bk.deleteUserLogged();

      // Actualiza la propiedad isLoggedIn para ocultar el botón "Cerrar sesión"
      this.isLoggedIn = false;

      // Llama a la función para recargar la página
      // window.location.reload();
    },
  },
};
</script>

<style scoped>
.link-logo{
  padding: 0px;
}
.usario{
  width: 10vh;
  height: 5vh;
  color: rgb(0, 0, 0);
  border-radius: 25vh;
  background: #fff;
  font-size: 16px;
  font-family: sans-serif;
  border: none;
}
.btn-header{
  width: 10vh;
  background: transparent;
  height: 5vh;
  color: gainsboro;
  font-family: sans-serif;
}

.btn-header:hover{
  transition: 0.5s;
  color: rgb(0, 0, 0);
  border-radius: 25vh;
  cursor: pointer;
  background: #fff;
}

.link:hover {
  transition: 0.5s;
  border-radius: 25vh;
  cursor: pointer;
}




header {
  box-shadow: 0px 5px 5px rgb(0 0 0 / 20%);
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  padding: 20px 25px ;
  background-color: #2c2c55;
  align-items: center;
}
header .logo {
  color: whitesmoke;
  font-size: 4vh;
  font-weight: 500;
  font-family: cursive;
}

.logo .up{
  color:  lightseagreen;
}

.content-ul-li-a {
  display: flex;
}

.content-ul-li-a li {
  padding: 0px 20px;
  list-style: none;
  
}

.content-ul-li-a li ,a {
  text-decoration: none;
  font-family: system-ui;
  padding: 6px 15px;
  color: white;
  max-width: 400px;
  margin: auto;
}

.content-menu-logo {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-menu {
  display: none;
}

.btn-menu button {  
    padding: 0px;
    background: no-repeat;
    font-size: 35px;
    outline: none;
    border: none;
    color: white;
    
}



/* Mobile menu */
@media all and (max-width: 1116px) {
  header {
    display: block;
  }

  .btn-menu {
    display: flex;
  }

  .content-nav-login { 
    display: none;
    align-items: center;
    flex-direction: column;
  }

  nav, ul {
    display: flex;
    flex-direction: column;
  }

  .nav-link-ul-visible {
    padding: 10px;
	  height: calc(100% - 60px);
	  margin-top: 20px;
	  display: flex ;
	  flex-direction: column;
	  align-items: center;
  }
  
}


</style>

