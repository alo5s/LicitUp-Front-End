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
          <!-- Producto o Servicio -->
            <label>Productos o Servicios</label>
            <input
              type="text"
              class="select"
              v-model="ProductoServicioSeleccionada"
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
            <button @click="registrarPerfil" class="btn-usario">Registrar 2/4</button>

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
      ProductoServicioSeleccionada: '',
      productosServiciosSeleccionados: [],
      mostrarBorrarIndice: null,
    };
  },
  methods: {
    agregarProductoServicio() {
      if (
        this.ProductoServicioSeleccionada &&
        !this.productosServiciosSeleccionados.includes(this.ProductoServicioSeleccionada)
      ) {
        this.productosServiciosSeleccionados.push(this.ProductoServicioSeleccionada);
        this.ProductoServicioSeleccionada = ''; // Limpiar el input después de agregar
      }
    },
    mostrarBorrar(index) {
      this.mostrarBorrarIndice = index;
    },
    ocultarBorrar() {
      this.mostrarBorrarIndice = null;
    },
    borrarProductoServicio(index) {
      this.productosServiciosSeleccionados.splice(index, 1);
    },
    registrarPerfil() {
      // Emite un evento con las comunas seleccionadas
      this.$emit('producto-servicio', this.productosServiciosSeleccionados);
      // Emite el evento para cambiar de página
      this.$emit('cambiar-pagina');
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
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
