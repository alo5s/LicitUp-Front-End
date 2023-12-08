<template>
  <section class="conteiner-usario height-100vh">
    <div class="center-fomr-usario">
      <div class="conteiner-login">
        <form @submit.prevent="handleSubmit" class="form-usario">
          <!-- Headings for the form -->
          <div class="headingsContainer">
            <h1>Iniciar sesión</h1>
            <p>Inicie sesión con su nombre de usuario y contraseña</p>
          </div>
          <!-- Main container for all inputs -->
          <div class="mainContainer">
            <!-- Username -->
            <label>Su nombre de usuario o Email</label>n
            <input v-model="correo" type="text" placeholder="Enter Username o Email" required class="input-username">

            <br><br>

            <!-- Password -->
            <label>Tu contraseña</label>
            <input v-model="contraseña" type="password" placeholder="Enter Password" required class="input-password">

            <br>

            <!-- Submit button -->
            <button class="btn-usario" type="submit">Iniciar sesion</button>

            <!-- Sign up link -->
            <p class="register">¿No es un miembro? <router-link to="Registro">¡Registrar aquí!</router-link></p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import licitUp_bk from '../authentication/licitup_request';
import router from '../router'; // Ajusta la ruta según la ubicación real de tu archivo de configuración del router

export default {
  data() {
    return {
      correo: '',
      contraseña: '',
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.correo || !this.contraseña) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, completa todos los campos.'
        });
        return;
      }
      try {
        const response = await licitUp_bk.login(this.correo, this.contraseña);
        if (response.data.access_token) {
          // Guardar el token en una cookie
          const token = response.data.access_token;
          licitUp_bk.saveTokenToCookie(token);

          // Emitir un evento para actualizar el estado del usuario
          this.$root.$emit('updateUserStatus', true);

          // Redirigir a la página principal
          window.location.href = "/";
        } else if (response.data.message === 'Contraseña inválida' || response.data.message === 'Usuario no encontrado') {
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'El correo o la contraseña son incorrectos.'
          });
        } else {
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error en el registro. Por favor, inténtalo de nuevo más tarde.'
          });
        }
      } catch (error) {
        console.error('Error al registrar:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar. Por favor, inténtalo de nuevo más tarde.'
        });
      }
    }
  }
};
</script>





<style scoped>
.height-100vh {
  height: 100vh;
}

header {
  display: none;
}

.conteiner-usario {
  background-color: #2c2c55;
  display: flex;
  padding-top: 7%;
  justify-content: center;
}

.center-fomr-usario {
  display: flex;
  justify-content: center;
}

.conteiner-login {
  height: fit-content;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-usario {
  width: 25rem;
  margin: auto;
  color: whitesmoke;
  border: 1px solid rgba(255, 255, 255, 0.125);
  padding: 20px 25px;
}

input[class=input-username],
input[class=input-password] {
  border: 0px;
  width: 100%;
  margin: 10px 0;
  border-radius: 5px;
  padding: 15px 18px;
  box-sizing: border-box;
}

.btn-usario {
  border: 0px;
  background-color: transparent;
  color: #fff;
  border: 2px solid #fff;
  padding: 14px 20px;
  margin: 7px 0;
  width: 100%;
  font-size: 18px;
}

.btn-usario:hover {
  cursor: pointer;
  color: rgb(0, 0, 0);
  cursor: pointer;
  background: #fff;
}

.headingsContainer {
  text-align: center;
}

.headingsContainer h1 {
  font-size: 5vh;
}

.headingsContainer p {
  color: #ddd9d9;
}

.mainContainer {
  padding: 16px;
}

span.forgotpsd a {
  float: right;
  color: whitesmoke;
  padding-top: 16px;
}

.forgotpsd a {
  color: rgb(74, 146, 235);
}

.forgotpsd a:link {
  text-decoration: none;
}

.register {
  color: white;
  text-align: center;
}

.register a {
  color: lightseagreen;
}

.register a:link {
  text-decoration: none;
}
</style>
