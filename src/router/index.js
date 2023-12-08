import { createRouter, createWebHistory } from 'vue-router';

// Vista publicas
import InicioView from '../views/InicioView.vue'
import LicitaconesViews from '../views/LicitacionesView.vue'
import MapaView from '../views/MapaView.vue'
import MapaLicitacionesViews from '../views/MapaLicitacionesView.vue'

import AnalisisViews from '../views/AnalisisView.vue'

// Vista Login y Registro
import LoginView from  '../views/LoginView.vue'
import RegistroView from  '../views/RegistroView.vue'

// Vista bloquiadas por credenciales (login)
import SeguimientosView from '../views/SeguimientosView.vue'
import eventos from '../views/eventosView.vue'
import PerfilView from '../views/PerfilVIew.vue'

// auth Credencial, estado 
import auth from '../authentication/licitup_request';


const routes  = [
    {
        path: '/',
        name: 'Inicio',
        //component: () => import (/* webpackCHunkName: "Inicio" */ '../views/InicioView.vue')
        component: InicioView
    },
    {
        path: '/Licitaciones',
        name: 'Licitaciones',
        //component: () => import (/* webpackCHunkName: "Licitaciones" */ '../views/LicitacionesView.vue')
        component: LicitaconesViews
    },
    {
        path: '/Login',
        name: 'Login',
        //component: () => import (/* webpackCHunkName: "Incio de session" */ '../views/LoginView.vue')
        component: LoginView
    },
    {
        path: '/Registro',
        name: 'Registro',
        //component: () => import (/* webpackCHunkName: "Registro de usario" */ '../views/RegistroView.vue')
        component: RegistroView
    },
    {
        path: '/Seguimientos',
        name: 'Seguimientos',
        //component: () => import (/* webpackCHunkName: "Vista de listaciones favoritas" */ '../views/SeguimientosView.vue')
        component: SeguimientosView,
        meta: { requiresAuth: true }, // Esta ruta requiere autenticación
    },
    {
      path: '/Mapa',
      name: 'Mapa',
      //component: () => import (/* webpackCHunkName: "Vista del Mapa de Licitaciones" */ '../views/MapaView.vue')
      component: MapaView
    },
    {
      path: '/mapa/Licitaciones/:ciudad/:id',
      name: 'MapaLicitacionesViews',
      //component: () => import (/* webpackCHunkName: "Vista del Mapa de Licitaciones" */ '../views/MapaView.vue')
      component: MapaLicitacionesViews
    },
    {
      path: '/Analisis',
      name: 'AnalisisViews',
      //component: () => import (/* webpackCHunkName: "Vista del Analisis " */ '../views/AnalisisViews.vue')
      component: AnalisisViews
    },

    // prueba
    {
      path: '/eventos',
      name: 'eventos',
      // component: () => import (/* webpackCHunkName: "Vista de listaciones favoritas" */ '../views/SeguimientosView.vue')
      component: eventos,
      // meta: { requiresAuth: true }, // Esta ruta requiere autenticación
    },
        {
        path: '/Perfil',
        name: 'Perfil',
        //component: () => import (/* webpackCHunkName: "Vista de listaciones favoritas" */ '../views/SeguimientosView.vue')
        component: PerfilView,
        meta: { requiresAuth: true }, // Esta ruta requiere autenticación
    },

]


const router = createRouter({
    mode: "history",
    history: createWebHistory(),
    routes
})

import Swal from 'sweetalert2'; // importar SweetAlert2

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Esta ruta requiere autenticación
    if (!auth.isAuthenticated()) {
      // Si el usuario no está autenticado, mostrar una alerta
      Swal.fire({
        title: 'Necesitas estar autenticado',
        text: 'Debes iniciar sesión para acceder a esta página.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Iniciar Sesión',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          next({ path: "/Login" });
        }
      });
    } else {
      // Si el usuario está autenticado, permitir el acceso a la ruta
      next();
    }
  } else {
    // Rutas públicas, permitir el acceso sin verificar la autenticación
    next();
  }
});


export default router


