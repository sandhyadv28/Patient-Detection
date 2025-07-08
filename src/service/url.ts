import { config } from '../utils/utils';
import { environment } from '../environments/environment.staging';
import { getToken } from '../utils/localStorage.util';

const token = getToken() || '';

// API configuration constants
export const API_CONFIG = {
    HEADERS: {
        'ai-api-key': '5zXq41haNrm2D2fPfn',
        'hospital-name': 'Adarsha Hospital - Karimnagar',
        'hospital-unit': 'ICU',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

// URL constants for API endpoints
export const URLS = {
    PATIENT_SUMMARY_API: `${environment.apiUrl}pdd/summary`,
    PATIENT_DETAILED_API: `${environment.apiUrl}pdd/detailed/overall`,
    PATIENT_PER_SLOT_API: `${environment.apiUrl}pdd/detailed/per-slot`,
    PATIENT_IMAGE_API: `pdd/detailed/per-slot/image`,
    GET_NEW_TOKEN: `${config.CLOUDPHYSICIAN_LOGIN_SERVICE}api/users/requestAccessToken`,
}
