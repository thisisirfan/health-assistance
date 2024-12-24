import { BACKEND_URL } from '@/lib/constants';
import axios from 'axios';

const client = axios.create({
    baseURL: BACKEND_URL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' }
});


export default client;
