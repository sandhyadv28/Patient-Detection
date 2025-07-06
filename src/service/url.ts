import { config } from '../utils/utils';
import { environment } from '../environments/environment.staging';



// API configuration constants
export const API_CONFIG = {
    HEADERS: {
        'ai-api-key': '5zXq41haNrm2D2fPfn',
        'hospital-name': 'Adarsha Hospital - Karimnagar',
        'hospital-unit': 'ICU',
        'Content-Type': 'application/json',
    }
}

// URL constants for API endpoints
export const URLS = {
    PATIENT_SUMMARY_API: `${environment.apiUrl}pdd/summary`,
    GET_NEW_TOKEN: `${config.CLOUDPHYSICIAN_LOGIN_SERVICE}api/users/requestAccessToken`,
}
