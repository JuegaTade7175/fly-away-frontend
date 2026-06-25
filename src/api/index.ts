import axios from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Flight,
  FlightSearchRequest,
  FlightSearchResponse,
  FlightBooking,
} from '../types';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.detail ?? err.response?.data?.message ?? err.message ?? 'Error del servidor';
    return Promise.reject(new ApiError(msg, err.response?.status));
  }
);

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  register: (data: RegisterRequest) =>
    api.post<{ id: number }>('/users/register', data).then((r) => r.data),
};

export const usersApi = {
  current: () => api.get<User>('/users/current').then((r) => r.data),
};

export const flightsApi = {
  search: (params: FlightSearchRequest) =>
    api.get<FlightSearchResponse>('/flights/search', { params }).then((r) => r.data),
  getById: (id: number) =>
    api.get<Flight>(`/flights/${id}`).then((r) => r.data),
  book: (flightId: number) =>
    api.post<{ id: number }>('/flights/book', { flightId }).then((r) => r.data),
  getBooking: (id: number) =>
    api.get<FlightBooking>(`/flights/book/${id}`).then((r) => r.data),
};

export default api;
