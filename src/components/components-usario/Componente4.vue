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
            <!-- Monto Estimado Mínimo -->
            <label>Su Monto Estimado es Minimo <input type="number" class="laberl" :value="montoMinimo" @input="updateMinimo"></label>
            <input type="range" class="select" :min="min" :max="max" v-model="montoMinimo" @input="updateMinimo">
            <br><br>            
            <!-- Monto Estimado Máximo -->
            <label>Su Monto Estimado es Maximo <input type="number" class="laberl" :value="montoMaximo" @input="updateMaximo"></label>
            <input type="range" class="select" :min="min" :max="max" v-model="montoMaximo" @input="updateMaximo">
            <br><br>
            <label>Total de licitaciones a mostrar: {{ numLi }}</label>
            <input type="range" class="select" min="1" max="250" v-model="numLi">
            <br><br>
            <button @click="registrarPerfil" class="btn-usario">Registrar 4/4</button>
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
      numLi: 1,
      min: 1000, // Valor mínimo personalizado
      max: 1000000, // Valor máximo personalizado
      montoMinimo: 1000, // Valor actual del monto mínimo
      montoMaximo: 1000000, // Valor actual del monto máximo
    };
  },
  methods: {
    updateMinimo(event) {
      const value = parseInt(event.target.value);
      if (!isNaN(value) && value <= this.montoMaximo) {
        this.montoMinimo = value;
        this.$emit('montos-seleccionados', {
          min: this.montoMinimo,
          max: this.montoMaximo
        });
      } else {
        this.montoMinimo = this.montoMaximo;
      }
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
