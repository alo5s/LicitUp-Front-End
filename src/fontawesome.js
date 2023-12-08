// fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { far } from '@fortawesome/free-regular-svg-icons';

// Esto son los Iconos fa-house
import { faUserSecret, faStar, faSearch, faFileLines, faEarthAmerica, faBars, faXmark} from '@fortawesome/free-solid-svg-icons'

library.add(faUserSecret, faStar, faSearch, faFileLines, far, faEarthAmerica, faBars, faXmark);


export { FontAwesomeIcon };