import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { flightsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import type { FlightBooking } from '../types';

export default function BookingDetailPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<FlightBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!id) {
      setError('ID de reserva no proporcionado');
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const data = await flightsApi.getBooking(Number(id));
        setBooking(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al cargar la reserva');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, isAuthenticated, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando reserva...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error || 'Reserva no encontrada'}
            </div>
            <button
              onClick={() => navigate('/bookings')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver a Mis Reservas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Detalle de Reserva ✈️</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/bookings')}
              className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Mis Reservas
            </button>
            <button
              onClick={() => navigate('/search')}
              className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Buscar Vuelos
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reserva #{booking.id}</h2>
            <p className="text-gray-600">Realizada el {formatDate(booking.bookingDate)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Vuelo</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de Vuelo:</span>
                  <span className="font-medium text-gray-900">{booking.flightNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salida:</span>
                  <span className="font-medium text-gray-900">{formatDate(booking.estDepartureTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Llegada:</span>
                  <span className="font-medium text-gray-900">{formatDate(booking.estArrivalTime)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Pasajero</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium text-gray-900">{booking.customerFirstName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Apellido:</span>
                  <span className="font-medium text-gray-900">{booking.customerLastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Cliente:</span>
                  <span className="font-medium text-gray-900">#{booking.customerId}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/bookings')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver a Mis Reservas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
