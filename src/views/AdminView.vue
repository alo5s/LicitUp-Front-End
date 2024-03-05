<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Suscripción</th>
          <th>Borrar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in lista_usuarios" :key="usuario.correo">
          <td>{{ usuario.correo }}</td>
          <td>
            <button
              @click="actualizarSuscripcion(usuario.correo, !usuario.suscripcion)"
              :class="{ 'activo': usuario.suscripcion, 'inactivo': !usuario.suscripcion }"
            >
              {{ usuario.suscripcion ? 'Suscripto' : 'No suscripto' }}
            </button>
          </td>
          <td>
            <button class="btn-delete" @click="confirmarBorrarUsuario(usuario.correo)">
              Borrar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import licitUp_bk from '../authentication/licitup_request.js';

export default {
    data() {
        return {
            lista_usuarios: []
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {   
            try {
                const response = await licitUp_bk.adminDatos();
                this.lista_usuarios = response.data;
                console.log("Lista de usuarios:", this.lista_usuarios);
            } catch (error) {
                console.error("Error al obtener datos en fetchData:", error);
            }
        },
        async confirmarBorrarUsuario(correo) {
            const confirmacion = await this.$swal({
                title: '¿Está seguro de realizar estos cambios?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, borrar usuario',
                cancelButtonText: 'No, cancelar',
            });
            if (confirmacion.value) {
                // Si el usuario confirma, se llama al método para borrar el usuario
                this.borrarUsuario(correo);
            }
        },
        async borrarUsuario(correo) {
            try {
                await licitUp_bk.adminDelete_usario(correo);
                // Actualizar localmente la lista de usuarios después de borrar uno
                this.lista_usuarios = this.lista_usuarios.filter(usuario => usuario.correo !== correo);
            } catch (error) {
                console.error("Error al borrar usuario:", error);
            }
        },
        async actualizarSuscripcion(correo, nuevoEstado) {
            try {
                await licitUp_bk.adminSucri(correo, nuevoEstado);               
                // Actualizar localmente el estado después de la respuesta exitosa del servidor
                const usuarioIndex = this.lista_usuarios.findIndex(usuario => usuario.correo === correo);
                if (usuarioIndex !== -1) {
                    // Vue.js 3 maneja reactivamente los cambios en arrays automáticamente
                    this.lista_usuarios[usuarioIndex].suscripcion = nuevoEstado;
                }
            } catch (error) {
                console.error("Error al actualizar suscripción:", error);
            }
        },
    }
};
</script>


<style scoped>
  .btn-dalete {
    background-color: rgb(199, 56, 56);
    color: white;
  }

  .table-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40vh;
  }

  table {
    border-collapse: collapse;
    width: 60%;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  th, td {
    padding: 15px;
    text-align: center; /* Alinea el texto al centro */
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #3498db;
    color: #fff;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

  .activo {
    background-color: green;
    color: white;
  }

  .inactivo {
    background-color: rgb(199, 56, 56);
    color: white;
  }

  button {
    padding: 8px 12px;
    cursor: pointer;
    border: none;
    text-align: center; /* Alinea el texto del botón al centro */
    display: block; /* Hace que el botón sea un bloque para centrar el contenido */
    margin: 0 auto; /* Centra el botón horizontalmente */
  }
</style>