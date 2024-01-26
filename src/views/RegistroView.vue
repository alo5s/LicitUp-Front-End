<template>
    <section class="conteiner-usario height-100vh">
        <div class="center-fomr-usario">
            <div class="conteiner-login">
                <form @submit.prevent="handleSubmit" class="form-usario">
                    <!-- Headings for the form -->
                    <div class="headingsContainer">
                        <h1>Registrar</h1>
                        <p>Complete los datos para registrarte</p>
                    </div>
                    <!-- Main container for all inputs -->
                    <div class="mainContainer">
                        <!-- Correo -->
                        <label>Tu Correo</label>
                        <input v-model="correo" type="email" placeholder="Ingrese un Correo" required
                            class="input-username">

                        <br><br>

                        <!-- Password -->
                        <label>Tu contraseña</label>
                        <input v-model="contraseña" type="password" placeholder="Ingrese su Password" required
                            class="input-password">

                        <br><br>

                        <label>Repite tu contraseña</label>
                        <input v-model="confirmar_contraseña" type="password" placeholder="Repita su Password" required
                            class="input-password">

                        <br>

                        <!-- Submit button -->
                        <button type="submit" class="btn-usario" :disabled="cargando">Registrar</button>

                        <div v-if="cargando" class="conteiner-cargar">
                          <div class="cargando-login"></div>
                        </div>
                        <!-- Sign up link -->
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
import licitUp_bk from '../authentication/licitup_request';
//import auth from '../authentication/auth';
export default {
  data() {
    return {
      correo: '',
      contraseña: '',
      confirmar_contraseña: '',
      cargando: false, // Variable de carga
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.correo || !this.contraseña || !this.confirmar_contraseña) {
        this.mostrarAlerta('Error', 'Por favor, completa todos los campos.', 'error');
        return;
      }

      if (this.contraseña !== this.confirmar_contraseña) {
        this.mostrarAlerta('Error', 'Las contraseñas no coinciden.', 'error');
        return;
      }

      try {
        // Iniciar la carga
        this.cargando = true;

        const response = await licitUp_bk.register(this.correo, this.contraseña);
        if (response.data.message === 'Usuario registrado exitosamente') {
          this.mostrarAlerta('Éxito', '¡Te has registrado exitosamente!', 'success');
          // Guardar el token en una cookie
          const token = response.data.access_token;
          licitUp_bk.saveTokenToCookie(token);
          // Emitir un evento para actualizar el estado del usuario
          this.$root.$emit('updateUserStatus', true);
          this.$router.push('/eventos');
        } else if (response.data.message === 'El correo electrónico ya existe') {
          this.mostrarAlerta('Advertencia', 'El correo ya está registrado.', 'warning');
        } else {
          this.mostrarAlerta('Error', 'Hubo un error en el registro. Por favor, inténtalo de nuevo más tarde.', 'error');
        }
      } catch (error) {
        console.error('Error al registrar:', error);
        this.mostrarAlerta('Error', 'Hubo un error al registrar. Por favor, inténtalo de nuevo más tarde.', 'error');
      } finally {
        // Detener la carga, independientemente del resultado
        this.cargando = false;
      }
    },
    mostrarAlerta(title, text, icon) {
      this.$swal({
        title: title,
        text: text,
        icon: icon,
      });
    },
  },
};

</script>


<style scoped>

/* carga */
/* carga */
.conteiner-cargar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(0 0 0 / 29%);/* Color de fondo semi-transparente para superponerse al formulario */
  display: flex;
  justify-content: center;
  align-items: center;
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



.height-100vh {
    height: 100vh;
}

header {
    display: none;
}

.conteiner-usario {
    background-color: #2c2c55;
    display: flex;
    padding-top: 2%;
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
    opacity: 0.6;
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