<template>
    <section class="conteiner-usario height-100vh">
        <div class="center-fomr-usario">
            <div class="conteiner-login">
                <div class="form-usario">
                    <!-- Headings for the form -->
                    <div class="headingsContainer">
                        <h1>Perfil</h1>
                        <p>Complete los datos de su Perfil</p>
                    </div>
                    <!-- Main container for all inputs -->
                    <div class="mainContainer">
                      <label>Seleccione sus codificaciones de licitaciones</label>
                      <select class="select" v-model="codificacionSeleccionada">
                        <option v-for="codificacion in codificaciónLicitaciones" :key="codificacion">{{ codificacion.descripcion }}</option>
                      </select>
                    
                      <button @click="agregarCodificacion" class="btn-agregar">Agregar</button>
                      <br><br>
                      <label>Codificaciones seleccionadas:</label>
                      <ul>
                        <li v-for="(codificacion, index) in codificacionesSeleccionados" :key="index">
                          <span>
                            {{ codificacion.descripcion }}
                            <span @mouseover="mostrarBorrar(index)" @mouseout="ocultarBorrar()" @click="borrar(index)" class="borrar">Borrar</span>
                          </span>
                        </li>
                      </ul>
                        <button @click="registrarPerfil" class="btn-usario">Registrar 3/4</button>
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
      mostrarBorrarIndice: null,
      codificaciónLicitaciones: [
        { valor: 'L1', descripcion: 'Lic. Publ Menor a 100 UTM (L1)' },
        { valor: 'LE', descripcion: 'Lic. Publ Entre 100 y 1000 UTM (LE)' },
        { valor: 'LP', descripcion: 'Lic. Publ Mayor 1000 UTM (LP)' },
        { valor: 'LR', descripcion: 'Lic. Publ Mayor a 5000 (LR)' },
        { valor: 'LQ', descripcion: 'Lic. Publ entre a 2000 y 5000 UTM' },
        { valor: 'LS', descripcion: 'Lic. Publ Servicios personales especializados (LS)' },
        { valor: 'O1', descripcion: 'Lic Codificacion O1'}
      ],
      codificacionesSeleccionados: [],
      codificacionSeleccionada: '',
    };
  },
  methods: {
    agregarCodificacion() {
      if (this.codificacionSeleccionada) {
        const seleccion = this.codificaciónLicitaciones.find(option => option.descripcion === this.codificacionSeleccionada);
        if (seleccion && !this.codificacionesSeleccionados.includes(seleccion)) {
          this.codificacionesSeleccionados.push(seleccion);
        }
      }
    },
    mostrarBorrar(index) {
      this.mostrarBorrarIndice = index;
    },
    ocultarBorrar() {
      this.mostrarBorrarIndice = null;
    },
    borrar(index) {
      this.codificacionesSeleccionados.splice(index, 1);
    },
    registrarPerfil() {
      // Emite un evento con las codificaciones seleccionadas (solo los valores)
      const valoresSeleccionados = this.codificacionesSeleccionados.map(seleccion => seleccion.valor);
      this.$emit('codificaciones-seleccionadas', valoresSeleccionados);
      // Emite el evento para cambiar de página
      this.$emit('cambiar-pagina');
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
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
