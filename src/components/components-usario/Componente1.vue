<template>
    <section class="conteiner-usario height-100vh">
        <div class="center-fomr-usario">
            <div class="conteiner-login">
                <div class="conteinter-circulo">
                  <span>1/4</span>
                </div>
                <div class="form-usario">
                    <!-- Headings for the form -->
                    <div class="headingsContainer">
                        <h1>Mis Preferencias</h1>
                        <p>Complete las preferencia de su perfil</p>
                    </div>
                    <!-- Main container for all inputs -->
                    <div class="mainContainer">
                        <label for="comuna">Sus comuna:</label>
                        <input v-model="comunaSeleccionada" list="comunasList"  class="input-selector" placeholder="Escribe para buscar la comuna" />
                        <datalist id="comunasList" class="custom-datalist">
                          <option v-for="comuna in filteredComunas" :key="comuna" :value="comuna"></option>
                        </datalist>

                        <!-- Correo -->
                        <button @click="agregarComuna" class="btn-agregar">Agregar</button>
                        <br><br>
                        <label>Comuna de Interés:</label>
                        <ul>
                          <li v-for="(comuna, index) in comunasSeleccionadas" :key="index">
                            <span>
                              {{ comuna }}
                              <span @mouseover="mostrarBorrar(index)" @mouseout="ocultarBorrar()" @click="borrarComuna(index)" class="borrar">Borrar</span>
                            </span>
                          </li>
                        </ul>
                        <br><br>
                        <button @click="registrarPerfil" class="btn-usario">Siguiente</button>

                    </div>
                </div>
            </div>          
        </div>
    </section>
</template>

<script>
import comunas from '../../lscomunas/ListadeComunas.js';

export default {
  props: {
    datos: {
      type: Object,
      required: true,
    },
    comunasSeleccionadas: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      comunas: comunas,
      selectedComuna: '',
      showDropdown: false,

      comunaSeleccionada: '',
      // No necesitas declarar las comunasSeleccionadas aquí ya que se recibirá como prop
      mostrarBorrarIndice: null,
      datosPrevios: [],
    };
  },
  
  computed: {
    filteredComunas() {
      return this.comunas.filter(comuna =>
        comuna.toLowerCase().includes(this.comunaSeleccionada.toLowerCase())
      );
    },
  },
  methods: {
    agregarComuna() {
      // Obtener la comuna más cercana en la lista
      const comunaCorrecta = this.comunas.find(comuna =>
        comuna.toLowerCase() === this.comunaSeleccionada.toLowerCase()
      );

      if (comunaCorrecta) {
        // Agregar la comuna correcta en lugar del valor ingresado
        if (!this.comunasSeleccionadas.includes(comunaCorrecta)) {
          this.comunasSeleccionadas.push(comunaCorrecta);
        } else {
          // Muestra una alerta si la comuna ya ha sido seleccionada
          this.$swal({
            icon: 'info',
            title: 'Valor repetido',
            text: 'Esta comuna ya ha sido seleccionada. Ingresa una comuna diferente.',
          });
        }
      } else if (this.comunaSeleccionada.trim() === '') {
        // Muestra una alerta si el input está vacío
        this.$swal({
          icon: 'info',
          title: 'Campo vacío',
          text: 'Por favor, ingresa una comuna antes de agregar.',
        });
      } else {
        // Muestra una alerta si la comuna no está en la lista
        this.$swal({
          icon: 'info',
          title: 'Comuna no válida',
          text: 'La comuna ingresada no es válida. Por favor, elige una comuna de la lista.',
        });
      }
      // Limpia el input después de agregar la comuna
      this.comunaSeleccionada = '';
    },
    establecerDatosPrevios(datosPrevios) {
      // Método para establecer los datos previos antes de mostrar el componente
      this.datosPrevios = datosPrevios;
    },
    mostrarBorrar(index) {
      this.mostrarBorrarIndice = index;
    },
    ocultarBorrar() {
      this.mostrarBorrarIndice = null;
    },
    borrarComuna(index) {
      this.comunasSeleccionadas.splice(index, 1);
    },
    registrarPerfil() {
      if (this.comunasSeleccionadas.length === 0) {
        // Muestra una alerta si el usuario intenta avanzar sin seleccionar ninguna comuna
        this.$swal({
          icon: 'info',
          title: 'Completa un dato',
          text: 'Por favor, ingresada al menos una comuna antes de continuar.',
        });
      } else {
        // Emite un evento con las comunas seleccionadas
        this.$emit('comunas-seleccionadas', this.comunasSeleccionadas);
        // Emite el evento para cambiar de página
        this.$emit('cambiar-pagina');
      }
    },
  }
};
</script>


<style scoped>




.borrar {
  color: red;
  cursor: pointer;
  margin-left: 5px;
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
    position: relative;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}


.conteinter-circulo {
    position: absolute;
    top: -20px;
    right: -22px;
    background-color: #2c2c55;
    border-radius: 50%;
    padding: 14px;
    margin-top: 1px;
    margin-right: 1px;
    box-shadow: 0px 0px 16px 5px #1414146b;
    border: 2px solid #fff;
}

.conteinter-circulo span {
    color: #fff;
    font-weight: bold;
    font-size: 18px;
}


.form-usario {
    width: 25rem;
    margin: auto;
    color: rgb(255, 255, 255);
    border: 1px solid rgba(255, 255, 255, 0.125);
    padding: 20px 25px;
}



input[class=input-selector] {
  border: 1px solid;
  font-size: 16px;
  font-weight: 400;
  color: #444;
  padding: 10px 15px 10px 15px;
  width: 340px;
  max-width: 100%;
  margin: 10px auto;
  border-radius: 0.3em;
  background-color: #fff;
}

option {
  font-weight:normal;
  font-size: 16px;
}
.btn-agregar{
    border: 0px;
    background-color: transparent;
    color: #fff;
    border: 2px solid #fff;
    padding: 10px 10px;
    margin: 7px 0;
    width: 100%;
    font-size: 18px;
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
button[class=btn-agregar]:hover,
button[class=btn-usario]:hover {
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
