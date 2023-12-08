<template>
  <div class="profile-container">
    <div class="profile-sidebar">  
      <div class="text-center">
        <img :src="avatarSrc" class="avatar img-circle img-thumbnail" alt="avatar">
        <h4>Datos del Perfil</h4>
        <h5>{{ correo }}</h5>
        <br>
        <div class="conteriner-data">
          <div>
            <label for="montoMin">Monto Min:</label>
            <input type="text" id="montoMin" v-model="mon_min" placeholder="Ingrese el monto mínimo" :readonly="!editando">
          </div>
          <br>
          <div>
            <label for="montoMin">Monto Max:</label>
            <input type="text" id="montoMin" v-model="mon_max" placeholder="Ingrese el monto mínimo" :readonly="!editando">
          </div>
          <br>
          <div>
            <label for="montoMin">N ° Licitaciones:</label>
            <input type="text" id="montoMin" v-model="num_li" placeholder="Ingrese el monto mínimo" :readonly="!editando">
          </div>
        </div>
      </div>
      <br>
      <div class="cont-btn"> 
        <button class="btn_2" v-if="!editando" @click="iniciarEdicion">Editar Datos</button>
        <button class="btn_2" v-else @click="guardarCambios">Guardar Cambios</button>
        <button class="btn_2"  @click="handleLogout">Cerrar sesión</button>
      </div>
      <br>

    </div>
    <div class="body_form">
      <div  class="colum">
        <label>Comuna</label>
        <p v-for="(comuna, index) in ciudades" :key="index">
          <div class="input-container"> 
            <input class="edit" v-if="!editando || (editando && index < ciudades.length - nuevosCuidades)" type="text" :value="comuna" placeholder="Texto aquí" readonly>
            <input class="edit" v-if="editando && index >= ciudades.length - nuevosCuidades" type="text" v-model="comuna[index]" placeholder="Texto aquí" list="comunaDbLicitup">            
            <span v-if="editando" @click="borrarContenidoComuna(comuna)">X</span>
          </div>
        </p>        

        <datalist id="comunaDbLicitup">
          <option v-for="comunaDbLicitup in comunasDbLicitup" :value="comunaDbLicitup"></option>
        </datalist>
        <p v-if="editando">
          <button class="brn_1" @click="agregarComuna">Agregar</button>
        </p>  
     
      </div>
      <div  class="colum">
        <label>Productos o Servicios</label>
        <p v-for="(producto, index) in productos" :key="index">
          <div class="input-container">
            <input class="edit" v-if="!editando || (editando && index < productos.length - nuevosProductos)" type="text" :value="producto" placeholder="Texto aquí" readonly>
            <input class="edit" v-if="editando && index >= productos.length - nuevosProductos" type="text" v-model="productos[index]" placeholder="Texto aquí">
            <span v-if="editando" @click="borrarContenidoProductos(producto)">X</span>
          </div>
        </p>
        <p v-if="editando">
          <button class="brn_1" @click="agregarProducto">Agregar</button>
        </p>          
      </div>
      <div  class="colum">
        <label>Tipos Licitaciones</label>
        <p v-for="(codi, index) in ls_codifi" :key="index">
          <div class="input-container">
            <input class="edit" v-if="!editando" type="text" :value="codi" placeholder="Texto aquí" readonly>
            <input class="edit" v-if="editando" type="text" v-model="ls_codifi[index]" placeholder="Texto aquí" list="codificacion" >            
            <span v-if="editando" @click="borrarCodifi(codi)">X</span>
          </div>
        </p>
        <datalist id="codificacion">
          <option v-for="codificacion in codificaciónLicitaciones" :value="codificacion.valor">{{ codificacion.descripcion }}</option>
        </datalist>
        <p v-if="editando">
          <button class="brn_1" @click="agregarCodigo">Agregar</button>
        </p>  
      </div>
    </div>
  </div>
</template>

<script>
import licitUp_bk from '../authentication/licitup_request.js'
export default {
  data() {
    return {
      avatarSrc: "https://ssl.gstatic.com/accounts/ui/avatar_2x.png",
      editando: false, // Variable para controlar si se está editando

      nuevosProductos: 0,
      nuevosCodigos:   0,
      nuevosCuidades:  0,

      // Datos del usario usario
      correo: "",
      ciudades: [],
      productos: [],
      ls_codifi: [],

      mon_min: "",
      mon_max: "",
      num_li: "",

      
      // ls de Comunas de db para el cliente 
      comunasDbLicitup: ['Argentina', 'chile'],
      codificaciónLicitaciones: [
        { valor: 'L1', descripcion: 'Licitación Pública Menor a 100 UTM (L1)' },
        { valor: 'LE', descripcion: 'Licitación Pública Entre 100 y 1000 UTM (LE)' },
        { valor: 'LP', descripcion: 'Licitación Pública Mayor 1000 UTM (LP)' },
        { valor: 'LR', descripcion: 'Licitación Pública Mayor a 5000 (LR)' },
        { valor: 'LQ', descripcion: 'Licitación Pública entre a 2000 y 5000 UTM' },
        { valor: 'LS', descripcion: 'Licitación Pública Servicios personales especializados (LS)' },
        { valor: 'O1', descripcion: 'Licitación Codificacion O1'}
      ],
    };
  },
  mounted() {
    this.datosPerfil();
  },
  watch: {
    // Observadores para manejar cambios en las propiedades y reformatear los números
    mon_min: function (newVal, oldVal) {
      this.mon_min = this.formatNumber(newVal);
    },
    mon_max: function (newVal, oldVal) {
      this.mon_max = this.formatNumber(newVal);
    },
    num_li: function (newVal, oldVal) {
      this.num_li = this.formatNumber(newVal);
    },
  },
  methods: {
    formatNumber(value) {
      // Formatea el número con separador de miles
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    agregarCodigo() {
      this.ls_codifi.push("");
    },
    agregarProducto() {
      this.productos.push("");
      this.nuevosProductos++;
    },
    agregarComuna() {
      this.ciudades.push("");
      this.nuevosCuidades++;

    },
    borrarContenidoComuna(comuna) {
      // Encuentra el índice del producto en el array y elimínalo
      const index = this.ciudades.indexOf(comuna);

      if (index !== -1) {
        // Llama a la función para borrar el dato en el servidor
        licitUp_bk.borraDato(comuna, null, null)
        // Elimina el producto localmente
        this.ciudades.splice(index, 1);

      }
    },
    borrarContenidoProductos(producto) {
      // Encuentra el índice del producto en el array y elimínalo
      const index = this.productos.indexOf(producto);
      if (index !== -1) {
        // Elimina el producto localmente
        this.productos.splice(index, 1);
        if (this.productos.length > 0){
          // Llama a la función para borrar el dato en el servidor
          licitUp_bk.borraDato(null, null, producto);
        }
      }
    },
    borrarCodifi(codi) {
      // Encuentra el índice del producto en el array y elimínalo
      const index = this.ls_codifi.indexOf(codi);
      if (index !== -1) {
        // Llama a la función para borrar el dato en el servidor
        licitUp_bk.borraDato(null, codi, null)
        // Elimina el producto localmente
        this.ls_codifi.splice(index, 1);
      }
    },

    iniciarEdicion() {
      this.editando = true;
    },
    guardarCambios() {
      this.editando = false;
      // Filtra elementos vacíos antes de asignar a this.productos
      this.productos = [...new Set(this.productos
        .filter(producto => producto !== null && producto !== undefined)
        .map(producto => (producto && typeof producto.trim === 'function') ? producto.trim() : producto)
      )];
          
      this.ciudades = [...new Set(this.ciudades
        .filter(comuna => comuna !== null && comuna !== undefined)
        .map(comuna => (comuna && typeof comuna.trim === 'function') ? comuna.trim() : comuna)
      )];
          
      this.ls_codifi = [...new Set(this.ls_codifi
        .filter(codi => codi !== null && codi !== undefined)
        .map(codi => (codi && typeof codi.trim === 'function') ? codi.trim() : codi)
      )];
      
      // Establece nuevosProductos a 0
      this.nuevosProductos = 0;
      // tomar los datos 

      // hacer la consulta al back-end para envia los datos al back-end
      // Tomar los datos 
      const ls_comuna = this.ciudades;
      const ls_ps_ss = this.productos;
      const ls_codificacións = this.ls_codifi;
      const ls_parametos = {
        numero_lis: parseInt(this.num_li.replace(/\./g, ''), 10), // Transforma a entero eliminando los puntos
        monto_minimo: parseFloat(this.mon_min.replace(/\./g, '')), // Transforma a decimal eliminando los puntos
        monto_maximo: parseFloat(this.mon_max.replace(/\./g, '')) // Transforma a decimal eliminando los puntos
      };
      console.log("Lista de Comunas:", ls_parametos);
      licitUp_bk.updateDatoPerfil(ls_comuna, ls_ps_ss, ls_codificacións, ls_parametos);
    },

    // ... otras funciones
    
    
    async handleLogout() {
      // Cerrar sesión
      licitUp_bk.deleteUserLogged();
      // Llama a la función para recargar la página
       window.location.reload();
    },
    
    async datosPerfil(){
      try {
        const response = await licitUp_bk.dataPerfi()
        this.correo = response.data.perfil.correo;
        this.ciudades = response.data.perfil.ciudades;
        this.productos = response.data.perfil.productos;
        this.mon_min = response.data.perfil.Salario_min;
        this.mon_max = response.data.perfil.Salario_max;
        this.num_li = response.data.perfil.nLicitacion;
        this.ls_codifi = response.data.perfil.codificacio
      } catch (error) {
          console.error('Error al realizar la consulta:', error);
      }
    }
  },
};
</script>

<style scoped>
#montoMin:focus {
    outline: none;
}
.conteriner-data{
  display: flex;
  flex-direction: column;
  align-items: center;
  
}
.conteriner-data div{
  font-size: 14px;
  font-weight: 100;
  color: black;
  border-bottom: 1px solid;
  width: 75%;
  text-align: justify;
  display: flex;
}
.conteriner-data div input {
  width: 40%;
  border: none;
}
.conteriner-data div label {
  margin: 0px 5px 0px 0px;
}

.input-container {
  position: relative;
  display: inline-block;
}

.input-container input {
  padding-right: 20px; /* Espacio para la X */
}

.input-container span {
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  cursor: pointer;
}
.profile-container {
  padding: 2rem 5rem;
  display: flex;
  justify-content: space-between; /* Ajusta el espacio entre los hijos */
  /* align-items: center; /* Centra los hijos verticalmente */
}
.avatar {
  width: 10rem;
  border-radius: 100%;
  border: 5px solid #d7d7d738;
  color: #444c;
  font-weight: 100;
  text-align: center;
  padding: 7px;
}
.text-center {
  text-align: center;
}
.text-center h4 {
  padding: 5px;
}
.cont-btn{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.brn_1 {
  width: 100%;
  padding: 4px 0px;
  border: 1px solid #979696;
  margin-bottom: 15px;
}
.btn_2 {
  width: 70%;
  padding: 4px 0px;
  border: 1px solid #979696;
  margin-bottom: 15px;
  box-shadow: 5px 5px 5px 0px #afafaf78;
  background: #2c2c5596;
  color: white;
}
.btn_2:hover {
  cursor: pointer;
  color: rgb(255, 255, 255);
  background: #55b;
  /* Cambio de color al pasar el ratón */
  transform: scale(1.05);
  /* Efecto de escala al pasar el ratón */
  border: 1px solid #9b9b9b;
}

.btn_2:active {
    transform: scale(0.95);
    /* Efecto de clic (escala ligeramente hacia abajo) */
}

/* Agrega estilos adicionales según sea necesario */

.body_form{
  padding: 20px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  font-family: 'Quicksand', sans-serif;
    background-color: transparent; 
}
.colum{
    padding: 0px 8px;
}
.content-title-contact{
    text-align: center;
}

.colum-2{
    display: flex;
}

p {
    padding: 5px 10px;
    display: flex;
    flex-direction: column;

}
label{
    padding: 0px 0px;
    margin-bottom: 5px;
}
.edit {
  padding: 3px 1px 3px 4px;
  border-radius: 5px;
  border: 1px solid #44444475;
}

@media all and (max-width: 1049px){
  .profile-container{
    flex-direction: column;
  }
  .conteriner-data div{
    width: 50%
  }
  .btn_2 {
    width: 50%;
  }
  
}
@media all and (max-width: 772px){
  .body_form{
    flex-direction: column;
    align-items: center;
  }

}
@media all and (max-width: 540px){
  .conteriner-data div{
    width: 100%
  }
}
</style>
