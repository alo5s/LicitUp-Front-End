import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../config"

// Función para obtener el token desde la cookie
function getTokenFromCookie() {
    return Cookies.get("access_token");
}

export default {
    // Request a home datos
    count (){
        return axios.post(`${BASE_URL}home`); // Corregido Listo
    },
    // Requestes licitaciones
    licitaciones(page, orden, estado, fecha_inicial, fecha_final){
        const data = {"pagina": page, "formato_ordende":orden, "estado":estado,"fecha_inicial":fecha_final ,"fecha_final":fecha_inicial }
        return axios.post(`${BASE_URL}licit`, data); // Corregido, Listo
    },

    li_search(datos){
        const data = {'buscar': datos}
        return axios.post(`${BASE_URL}buscar`, data); // Corregido, Listo
    },
    detalle(id_li){
        return axios.post(`${BASE_URL}licitaciones/detalle=${id_li}`); // Corregido, Listo
    },
    // Requestes Usuario
    register(email, password) {
        const data = { email, password };
        return axios.post(`${BASE_URL}register`, data); // Error, Listo
    },

    login(email, password) {
        const data = { email, password };
        return axios.post(`${BASE_URL}login`, data)
    },

    saveTokenToCookie(token) {
        Cookies.set("access_token", token, { expires: 7 }); // El token expira en 7 días (ajusta según tus necesidades)
    },

    
    isAuthenticated() {
        const token = Cookies.get("access_token");
        return !!token; // Devuelve true si el token existe, de lo contrario, false
    },
    deleteUserLogged() {
        Cookies.remove('access_token');
    },
    someAuthenticatedRequest() {
        const token = getTokenFromCookie();
        if (token) {
          // Agregar el token a las cabeceras de la solicitud
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          // Manejar el caso en el que no haya token
        }
        // Realizar la solicitud autenticada aquí
    },

    addToFavorites(id){
        const data = {"item":id}
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}add-favorite`, data)
    },
    dejarDeSeguir(id){
        const data = {"item":id}
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}dalate-favorite`, data)
    },
    // Lista de favoritos id_licitacion
    listFavorites(){
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}lista-favorite-id`)
    },

    // Requestes Segumientos
    segumientoLicit(){
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}segumientos`)
    },
    segumientoLicitDelete(codigo){
        const data = {"item":codigo}
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}segumientos/dalate`, data)
    },
    // Mapa
    mapa(){
        return axios.get(`${BASE_URL}mapa`)
    },
    mapaLicitaciones(id_ciudad,page){
        //const ciudadSinEspacios = ciudad.replace(/\s+/g, '-');
        return axios.get(`${BASE_URL}/mapa/licitaciones/${id_ciudad}/pagina=${page}`);
    },
    // Analissi
    analisis(){
        return axios.get(`${BASE_URL}analisis`)
    },
    // Preuba
    eventSource(){
        this.someAuthenticatedRequest();
    },
    // Notificacion
    eventNotificacion(){
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}notificacion`)
    },

    // Perfil de usario ( Cuestionario )
    datoCuestionario(){
        return axios.get(`${BASE_URL}cuestionario`)
    },

    datoCuestionarioUsuario(ls_comuna_fa, ls_PsSs_fa, ls_codificacións_fa, ls_parametos){
        const data = {"ls_comuna_fa":ls_comuna_fa, "ls_PsSs_fa":ls_PsSs_fa, 'ls_codificacións_fa':ls_codificacións_fa,'ls_parametos':ls_parametos}
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}profile/datos`, data)
    },
    dataPerfi(){
        this.someAuthenticatedRequest();
        return axios.get(`${BASE_URL}perfil`)
    },
    // Licitaciones del preferencia de usario
    perfil_licitaciones(page){
        const data = {"pagina": page}
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}licitaciones/perfil`, data)
    },

    // Mapa 
    mapa_perfil(){
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}perfil/mapas`)
    },
    licitaciones_mapa_perfil(ciudad, page) {
        const data = {
            "pagina": page,
            "comuna": ciudad
        }
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}licitaciones/perfil/mapa`, data)
    },
    borraDato(comuna, codificacion, producto) {
        this.someAuthenticatedRequest();
        const params = {
            comuna: comuna,
            codificacion: codificacion,
            producto_servicio: producto
        };
        return axios.delete(`${BASE_URL}perfil/borrar_dato`, { params: params });
    },
    updateDatoPerfil(ls_comuna_fa, ls_PsSs_fa, ls_codificacións_fa, ls_parametos){
        const data = {"ls_comuna_fa":ls_comuna_fa, "ls_PsSs_fa":ls_PsSs_fa, 'ls_codificacións_fa':ls_codificacións_fa,'ls_parametos':ls_parametos}
        this.someAuthenticatedRequest();
        return axios.put(`${BASE_URL}perfil/datos/update`, data);
    },

    // administrador
    adminDatos (){
        return axios.post(`${BASE_URL}admin`); // Corregido Listo
    },
    adminSucri(corre, estado){
        const data = {"correo":corre, "suscripcion":estado}
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}admin/activar`, data)
    },
    estadoUsuario(){
        this.someAuthenticatedRequest();
        return axios.post(`${BASE_URL}admin/estado`)
    },

}

