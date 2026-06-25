import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import type { FlightBooking } from '../types';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<FlightBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      const savedBookingIds = JSON.parse(localStorage.getItem('bookings') || '[]');
      
      if (savedBookingIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const bookingDetails = await Promise.all(
          savedBookingIds.map((id: number) => flightsApi.getBooking(id))
        );
        setBookings(bookingDetails);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al cargar reservas');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, navigate]);

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
        <div className="text-white text-xl">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Mis Reservas ✈️</h1>
          <div className="flex gap-4">
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
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No tienes reservas</h2>
              <p className="text-gray-600 mb-4">
                Comienza buscando vuelos y haciendo tu primera reserva.
              </p>
              <button
                onClick={() => navigate('/search')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Buscar Vuelos
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tus Reservas ({bookings.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID Reserva</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vuelo</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha Reserva</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Salida</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Llegada</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pasajero</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">#{booking.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{booking.flightNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDate(booking.bookingDate)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDate(booking.estDepartureTime)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDate(booking.estArrivalTime)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {booking.customerFirstName} {booking.customerLastName}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => navigate(`/bookings/${booking.id}`)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Ver Detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
