<template>
    <section class="conteiner-usario height-100vh">
        <div class="center-fomr-usario">
            <div class="conteiner-login">
                <div class="conteinter-circulo">
                  <span>3/4</span>
                 </div>
                <div class="form-usario">
                    <!-- Headings for the form -->
                    <div class="headingsContainer">
                        <h1>Mis Preferencias</h1>
                        <p>Complete las preferencias de su perfil</p>
                    </div>
                    <!-- Main container for all inputs -->
                    <div class="mainContainer">
                      <label>Seleccione Tipos de Licitaciones</label>
                      
                      <select class="select" v-model="codificacionSeleccionada">
                        <option v-for="codificacion in codificaciónLicitaciones" :value="codificacion.valor" >{{ codificacion.descripcion }}</option>
                      </select>
                    
                      <button @click="agregarCodificacion" class="btn-agregar">Agregar</button>
                      <br><br>
                      <label>Tipos de Licitaciones seleccionadas:</label>
                      <ul>
                        <li v-for="valor in codificaciónLicitacionesSeleccionados">
                          <span>
                            {{ codificaciónLicitaciones.find(c => c.valor === valor).descripcion }}
                            <span @mouseover="mostrarBorrar(valor)" @mouseout="ocultarBorrar()" @click="borrar(valor)" class="borrar">Borrar</span>
                          </span>
                        </li>
                      </ul>
                        <button @click="regresar" class="btn-usario">Anterior</button>
                        <button @click="registrarPerfil" class="btn-usario">Siguiente</button>
                    </div>
                </div>
            </div>          
        </div>
    </section>
</template>

<script>
export default {
  data() {
    return {
      codificaciónLicitaciones: [
      { valor: 'L1', descripcion: 'Lic. Publ Menor a 100 UTM (L1)' },
      { valor: 'LE', descripcion: 'Lic. Publ Entre 100 y 1000 UTM (LE)' },
      { valor: 'LP', descripcion: 'Lic. Publ Mayor 1000 UTM (LP)' },
      { valor: 'LR', descripcion: 'Lic. Publ Mayor a 5000 UTM (LR)' },
      { valor: 'LQ', descripcion: 'Lic. Publ entre a 2000 y 5000 UTM (LQ)' },
      { valor: 'LS', descripcion: 'Lic. Publ Servicios personales especializados (LS)' },
      { valor: 'O1', descripcion: 'Lic Codificacion O1' },
      { valor: 'E2', descripcion: 'Lic Privada Inferior a 100 UTM (E2)' },
      { valor: 'CO', descripcion: 'Lic Privada igual o superior a 100 UTM e inferior a 1000 UTM (CO)' },
      { valor: 'B2', descripcion: 'Lic Privada igual o superior a 1000 UTM e inferior a 2000 UTM (B2)' },
      { valor: 'H2', descripcion: 'Lic Privada igual o superior a 2000 UTM e inferior a 5000 UTM (H2)' },
      { valor: 'I2', descripcion: 'Lic Privada Mayor a 5000 UTM (I2)' },
      { valor: 'O2', descripcion: 'Lic Privada de Obras (O2)' }
      ],
      codificacionSeleccionada: null,
    };
  },
  props: {
    codificaciónLicitacionesSeleccionados: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    agregarCodificacion() {
      try {
        if (this.codificacionSeleccionada && !this.codificaciónLicitacionesSeleccionados.includes(this.codificacionSeleccionada)) {
          this.codificaciónLicitacionesSeleccionados.push(this.codificacionSeleccionada);
          console.log("Esta es ", this.codificaciónLicitacionesSeleccionados); // Imprime la lista actualizada
        }
      } catch (error) {
        console.error("Error en agregarCodificacion:", error);
      }
    },

    mostrarBorrar(index) {
      this.mostrarBorrarIndice = index;
    },
    ocultarBorrar() {
      this.mostrarBorrarIndice = null;
    },
    borrar(valor) {
      const index = this.codificaciónLicitacionesSeleccionados.indexOf(valor);
      if (index !== -1) {
        this.codificaciónLicitacionesSeleccionados.splice(index, 1);
      }
    },
    registrarPerfil() {
      if (this.codificaciónLicitacionesSeleccionados.length === 0) {
        // Muestra una alerta si el usuario intenta avanzar sin seleccionar ninguna comuna
        this.$swal({
          icon: 'info',
          title: 'Completa un dato',
          text: 'Por favor, Seleccione al menos un tipo de licitaciones antes de continuar.',
        });
      } else {
        // Emite un evento con las comunas seleccionadas
        this.$emit('codificaciones-seleccionadas', this.codificaciónLicitacionesSeleccionados);
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



select[class=select] {
  font-size: 16px;
  font-weight: 400;
  color: #444;
  padding: 10px 15px 10px 15px;
  width: 400px;
  max-width: 100%; 
  margin: 10px auto;
  border-radius: .3em;
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
