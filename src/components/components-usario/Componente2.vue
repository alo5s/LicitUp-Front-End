<template>
  <section class="conteiner-usario height-100vh">
    <div class="center-fomr-usario">
      <div class="conteiner-login">
        <div class="conteinter-circulo">
          <span>2/4</span>
        </div>
        <div class="form-usario">
          <!-- Headings for the form -->
          <div class="headingsContainer">
            <h1>Mis Preferencias</h1>
            <p>Complete las preferencias de su perfil</p>
          </div>
          <!-- Main container for all inputs -->
          <div class="mainContainer">
            <!-- Producto o Servicio -->
            <label>Productos o Servicios</label>
            <input
              type="text"
              class="select"
              v-model="productoServicioSeleccionada"
              list="productosServiciosList"
              placeholder="ejmplo Motores o Reparacion .."
            />
            <!-- 
            <datalist id="productosServiciosList">
              <option v-for="productoServicio in ProductosServicios" :value="productoServicio"></option>
            </datalist>
            -->
            <button @click="agregarProductoServicio" class="btn-agregar">Agregar</button>
            <br /><br />
            <label>Productos y Servicios de Interés:</label>
            <ul>
              <li v-for="(productoServicio, index) in productosServiciosSeleccionados" :key="index">
                <span>
                  {{ productoServicio }}
                  <span
                    @mouseover="mostrarBorrar(index)"
                    @mouseout="ocultarBorrar()"
                    @click="borrarProductoServicio(index)"
                    class="borrar"
                  >
                    Borrar
                  </span>
                </span>
              </li>
            </ul>

            <br /><br />
            <button @click="regresar" class="btn-usario">Anterior</button>
            <button @click="registrarPerfil" class="btn-usario">Siguiente </button>
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
      ProductosServicios: ['Ropa', 'Reparacion'],
      productoServicioSeleccionada: '',
      mostrarBorrarIndice: null,
    };
  },
  props: {
    productosServiciosSeleccionados: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    agregarProductoServicio() {
      if (
        this.productoServicioSeleccionada &&
        !this.productosServiciosSeleccionados.includes(this.productoServicioSeleccionada) // Cambié el nombre del dato local
      ) {
        this.productosServiciosSeleccionados.push(this.productoServicioSeleccionada); // Cambié el nombre del dato local
        this.productoServicioSeleccionada = ''; // Limpiar el input después de agregar
      }
    },
    mostrarBorrar(index) {
      this.mostrarBorrarIndice = index;
    },
    ocultarBorrar() {
      this.mostrarBorrarIndice = null;
    },
    borrarProductoServicio(index) {
      this.productosServiciosSeleccionados.splice(index, 1); // Cambié el nombre del dato local
    },
    regresar() {
      // Emitir evento para cambiar de página con regresar establecido en true
      this.$emit('cambiar-pagina', true);
    },
    registrarPerfil() {
      if (this.productosServiciosSeleccionados.length === 0) {
        // Muestra una alerta si el usuario intenta avanzar sin seleccionar ninguna comuna
        this.$swal({
          icon: 'info',
          title: 'Completa un dato',
          text: 'Por favor, ingresada al menos una Producto o Servicio antes de continuar.',
        });
      } else {
        // Emite un evento con las comunas seleccionadas
        this.$emit('producto-servicio', this.productosServiciosSeleccionados);
        // Emite el evento para cambiar de página
        this.$emit('cambiar-pagina');
      }
    },
  },
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



input[class=select] {
  font-size: 16px;
  font-weight: 400;
  color: #444;
  padding: 10px 15px 10px 15px;
  width: 340px;
  max-width: 100%;
  margin: 10px auto;
  border-radius: 0.3em;
  border: 1px solid;
  background-color: #fff;
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
