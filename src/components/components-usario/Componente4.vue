<template>
  <section class="conteiner-usario height-100vh">
    <div class="center-fomr-usario">
      <div class="conteiner-login">
        <div class="conteinter-circulo">
         <span>4/4</span>
        </div>
        <div class="form-usario">
          <!-- Headings for the form -->
          <div class="headingsContainer">
            <h1>Mis Preferencias</h1>
            <p>Complete las preferencia de su perfil</p>
          </div>
          <!-- Main container for all inputs -->
          <div class="mainContainer">
            <!-- Monto Estimado Mínimo -->
            <label>Su Monto Estimado es Mínimo {{ formatNumber(montoMinimo) }}</label>
            <input type="range" class="select" :min="min" :max="max" v-model="montoMinimo" @input="updateMinimo">
            <br><br>            
            <!-- Monto Estimado Máximo -->
            <label>Su Monto Estimado es Máximo {{ formatNumber(montoMaximo) }}</label>
            <input type="range" class="select" :min="min" :max="max" v-model="montoMaximo" @input="updateMaximo">
            <br><br>
            <label>Total de licitaciones a mostrar: {{ numLi }}</label>
            <input type="range" class="select" min="1" max="100" v-model="numLi">
            <br><br>
            <button @click="regresar" class="btn-usario">Anterior</button>
            <button @click="registrarPerfil" class="btn-usario">Finalizar</button>
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
      numLi: 20,
      min: 0, // Valor mínimo personalizado
      max: 100000000, // Valor máximo personalizado
      montoMinimo: 0, // Valor actual del monto mínimo
      montoMaximo: 1000000, // Valor actual del monto máximo
    };
  },
  methods: {
    formatNumber(value) {
      return value !== null && value !== undefined
        ? new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
          }).format(value)
        : 'No definida';
    },
    updateMinimo(event) {
      const value = parseInt(event.target.value);
      console.log("updateMinimo called with value:", value);
      if (!isNaN(value) && (value <= this.montoMaximo || value === 0)){
        this.montoMinimo = value;
        this.$emit('montos-seleccionados', {
          min: this.montoMinimo,
          max: this.montoMaximo
        });
      } else {
        this.montoMinimo = this.montoMaximo;
      }
    },
    regresar() {
      // Emitir evento para cambiar de página con regresar establecido en true
      this.$emit('cambiar-pagina', true);
    },
    updateMaximo(event) {
      const value = parseInt(event.target.value);
      if (!isNaN(value) && value >= this.montoMinimo) {
        this.montoMaximo = value;
        this.$emit('montos-seleccionados', {
          min: this.montoMinimo,
          max: this.montoMaximo
        });
      } else {
        this.montoMaximo = this.montoMinimo;
      }
    },
    registrarPerfil() {
      this.$emit('parametros-seleccionados', {
        "numero-lis": this.numLi,
        "monto-minimo": this.montoMinimo,
        "monto-maximo": this.montoMaximo
      });
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
  font-weight: 400;
  color: #444;
  padding: 0px;
  width: 400px;
  max-width: 100%; 
  margin: 10px auto;
  border-radius: .3em;
  background-color: #fff;
}
input[class=laberl]{
  width: 30%;
  margin: 0px 5px;
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;
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
