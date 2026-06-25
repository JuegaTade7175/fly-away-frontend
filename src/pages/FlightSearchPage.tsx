import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import type { Flight, FlightSearchRequest } from '../types';

interface SearchForm {
  flightNumber: string;
  airlineName: string;
  estDepartureTimeFrom: string;
  estDepartureTimeTo: string;
}

function buildSearchParams(form: SearchForm): FlightSearchRequest {
  const params: FlightSearchRequest = {};
  if (form.flightNumber.trim()) params.flightNumber = form.flightNumber.trim();
  if (form.airlineName.trim()) params.airlineName = form.airlineName.trim();
  if (form.estDepartureTimeFrom) {
    params.estDepartureTimeFrom = new Date(form.estDepartureTimeFrom).toISOString();
  }
  if (form.estDepartureTimeTo) {
    params.estDepartureTimeTo = new Date(form.estDepartureTimeTo).toISOString();
  }
  return params;
}

export default function FlightSearchPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [search, setSearch] = useState<SearchForm>({
    flightNumber: '',
    airlineName: '',
    estDepartureTimeFrom: '',
    estDepartureTimeTo: '',
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFlights([]);

    try {
      const response = await flightsApi.search(buildSearchParams(search));
      setFlights(response.items);
      if (response.items.length === 0) {
        setError('No se encontraron vuelos con los criterios especificados');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al buscar vuelos');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (flightId: number) => {
    setBookingError('');
    setBookingSuccess('');

    try {
      const response = await flightsApi.book(flightId);
      setBookingSuccess(`¡Reserva exitosa! ID de reserva: ${response.id}`);

      const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      savedBookings.push(response.id);
      localStorage.setItem('bookings', JSON.stringify(savedBookings));
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : 'Error al reservar vuelo');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Fly Away ✈️</h1>
            {user && (
              <p className="text-white/80 text-sm mt-1">
                Hola, {user.firstName} {user.lastName}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/bookings')}
                  className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Mis Reservas
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Buscar Vuelos</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Vuelo</label>
              <input
                type="text"
                value={search.flightNumber}
                onChange={(e) => setSearch({ ...search, flightNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: LA123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aerolínea</label>
              <input
                type="text"
                value={search.airlineName}
                onChange={(e) => setSearch({ ...search, airlineName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: LATAM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Salida Desde</label>
              <input
                type="datetime-local"
                value={search.estDepartureTimeFrom}
                onChange={(e) => setSearch({ ...search, estDepartureTimeFrom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Salida Hasta</label>
              <input
                type="datetime-local"
                value={search.estDepartureTimeTo}
                onChange={(e) => setSearch({ ...search, estDepartureTimeTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Buscando...' : 'Buscar Vuelos'}
              </button>
            </div>
          </form>
        </div>

        {bookingSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {bookingSuccess}
          </div>
        )}

        {bookingError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {bookingError}
          </div>
        )}

        {error && !flights.length && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {flights.length > 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resultados ({flights.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vuelo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aerolínea</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Salida</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Llegada</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Asientos</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((flight) => (
                    <tr key={flight.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{flight.flightNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{flight.airlineName}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(flight.estDepartureTime)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(flight.estArrivalTime)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{flight.availableSeats}</td>
                      <td className="px-4 py-3 text-sm">
                        {isAuthenticated ? (
                          <button
                            onClick={() => handleBook(flight.id)}
                            disabled={flight.availableSeats === 0}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Reservar
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Iniciar sesión para reservar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
