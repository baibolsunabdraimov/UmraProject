/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  useFlights, 
  usePilgrims, 
  useCreateFlight, 
  useDeleteFlight,
  useAssignFlightToPilgrim,
  useRemoveFlightFromPilgrim
} from '../lib/api';
import { 
  Flight, 
  Pilgrim 
} from '../types';
import { 
  Plane, 
  Plus, 
  Calendar, 
  Trash2, 
  UserX, 
  Users, 
  X, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FlightManagementView() {
  const { data: flights, isLoading: flightsLoading } = useFlights();
  const { data: pilgrims, isLoading: pilgrimsLoading } = usePilgrims();

  const createFlightMutation = useCreateFlight();
  const deleteFlightMutation = useDeleteFlight();
  const assignMutation = useAssignFlightToPilgrim();
  const removeMutation = useRemoveFlightFromPilgrim();

  // Selected Flight for distribution context
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);

  // New Flight Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Flight Form state
  const [airline, setAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [departureTime, setDepartureTime] = useState('2026-06-18T09:30');
  const [arrivalTime, setArrivalTime] = useState('2026-06-18T14:45');
  const [ticketPrice, setTicketPrice] = useState(850);

  // Get selected flight details
  const activeFlight = flights?.find(f => f.id === selectedFlightId) || flights?.[0] || null;

  // React state fallback when loading is done
  React.useEffect(() => {
    if (flights && flights.length > 0 && selectedFlightId === null) {
      setSelectedFlightId(flights[0].id);
    }
  }, [flights, selectedFlightId]);

  // Filters unassigned pilgrims (no flightId set)
  const unassignedPilgrims = pilgrims?.filter(p => p.flightId === null) || [];

  // Handle Create Flight Ticket
  const handleCreateFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!airline.trim() || !flightNumber.trim()) return;

    try {
      await createFlightMutation.mutateAsync({
        airline,
        flightNumber: flightNumber.trim().toUpperCase(),
        departureTime: new Date(departureTime).toISOString(),
        arrivalTime: new Date(arrivalTime).toISOString(),
        ticketPrice: Number(ticketPrice)
      });
      setIsModalOpen(false);
      // Reset form
      setAirline('');
      setFlightNumber('');
      setDepartureTime('2026-06-18T09:30');
      setArrivalTime('2026-06-18T14:45');
      setTicketPrice(850);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Assignment
  const handleAssignTicket = async (pilgrimId: number) => {
    if (!activeFlight) return;
    try {
      await assignMutation.mutateAsync({
        pilgrimId,
        flightId: activeFlight.id
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle De-assignment
  const handleDetachTicket = async (pilgrimId: number) => {
    try {
      await removeMutation.mutateAsync(pilgrimId);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete flight
  const handleDeleteFlight = async (flightId: number) => {
    if (confirm('Вы уверены, что хотите удалить этот рейс из системы? Все билеты будут аннулированы.')) {
      try {
        await deleteFlightMutation.mutateAsync(flightId);
        if (selectedFlightId === flightId) {
          setSelectedFlightId(null);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const loading = flightsLoading || pilgrimsLoading;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Загрузка управления авиаперелетами...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in animate-duration-300" id="flight-management-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight" id="flight-title">
            Распределение Авиабилетов
          </h1>
          <p className="text-gray-500 text-sm mt-1">Создание реестра авиарейсов, продажа и распределение посадочных мест среди паломников.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm flex items-center justify-center gap-2 text-xs self-start sm:self-auto cursor-pointer"
          id="btn-add-flight"
        >
          <Plus className="w-4 h-4" />
          Добавить авиарейс
        </button>
      </div>

      {/* Main split work board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Flights List */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Доступные рейсы</h3>
          
          {(!flights || flights.length === 0) ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              Рейсы не найдены. Создайте рейс для начала распределения.
            </div>
          ) : (
            flights.map(flight => {
              const pilgrimsInFlight = pilgrims?.filter(p => p.flightId === flight.id) || [];
              const isSelected = activeFlight?.id === flight.id;

              return (
                <div
                  key={flight.id}
                  onClick={() => setSelectedFlightId(flight.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition duration-150 relative overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-emerald-50 bg-opacity-[0.15] border-emerald-600/30 shadow-xs' 
                      : 'bg-white border-slate-200 hover:bg-slate-50/50 hover:shadow-2xs'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-600"></div>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                        <Plane className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{flight.airline}</h4>
                        <span className="text-[10px] font-mono font-bold text-emerald-700">{flight.flightNumber}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFlight(flight.id);
                      }}
                      className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100 transition cursor-pointer"
                      title="Удалить рейс"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-450" />
                      <span>{new Date(flight.departureTime).toLocaleDateString()} {new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold pt-2 border-t border-slate-100 mt-2 text-slate-900 text-[11px]">
                      <span>Цена билета:</span>
                      <span className="text-emerald-700 font-bold">${flight.ticketPrice}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Пассажиров:
                    </span>
                    <strong className="text-slate-800">{pilgrimsInFlight.length} чел.</strong>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Area: Flight details & distribution grid */}
        <div className="lg:col-span-2 space-y-4">
          {activeFlight ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
              {/* Active Flight Header Card */}
              <div className="bg-slate-50/50 p-3.5 rounded-lg border border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white rounded px-1.5 py-0.5">Активный рейс</span>
                    <span className="text-[10px] font-semibold text-slate-400">ID: {activeFlight.id}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">{activeFlight.airline} {activeFlight.flightNumber}</h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Вылетает: {new Date(activeFlight.departureTime).toLocaleString()} &rarr; Прилетает: {new Date(activeFlight.arrivalTime).toLocaleString()}
                  </p>
                </div>
                <div className="text-right sm:text-right self-stretch sm:self-auto flex sm:flex-col justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Стоимость:</span>
                  <span className="text-lg font-bold text-emerald-700">${activeFlight.ticketPrice}</span>
                </div>
              </div>

              {/* Grid split: Assigned vs Unassigned */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="distribution-split">
                {/* Distributed list */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Оформленные билеты</h4>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-100/30">
                      {(pilgrims?.filter(p => p.flightId === activeFlight.id) || []).length} паломн.
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1" id="assigned-list">
                    {(() => {
                      const assigned = pilgrims?.filter(p => p.flightId === activeFlight.id) || [];
                      if (assigned.length === 0) {
                        return (
                          <div className="text-center py-8 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 text-[11px] text-slate-400">
                            Паломники еще не добавлены на этот рейс. Привяжите паломника справа &rarr;
                          </div>
                        );
                      }
                      return assigned.map(p => (
                        <div 
                          key={p.id} 
                          className="bg-slate-50/50 p-2.5 rounded border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{p.fullName}</p>
                            <p className="text-slate-450 font-mono text-[10px]">{p.passportNumber}</p>
                          </div>
                          <button
                            onClick={() => handleDetachTicket(p.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                            title="Изъять билет"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Unassigned list */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Свободные паломники</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded border border-slate-150">
                      {unassignedPilgrims.length} чел.
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1" id="unassigned-list">
                    {unassignedPilgrims.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 text-[11px] text-slate-400">
                        Все зарегистрированные клиенты получили авиабилеты!
                      </div>
                    ) : (
                      unassignedPilgrims.map(p => (
                        <div 
                          key={p.id} 
                          className="bg-white p-2.5 rounded border border-slate-200 flex items-center justify-between text-xs hover:border-emerald-500 transition duration-150"
                        >
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{p.fullName}</p>
                            <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-1.5 py-0.5 rounded border border-slate-100 mt-1 inline-block">
                              Группа: {p.group?.name || 'Нет'}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAssignTicket(p.id)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-0.5 px-2 rounded font-semibold text-[10px] flex items-center gap-1 cursor-pointer border border-emerald-150"
                            title="Назначить этот рейс"
                          >
                            <span>Билет</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
              Выберите авиарейс слева или создайте новый, чтобы приступить к диспетчеризации билетов.
            </div>
          )}
        </div>
      </div>

      {/* New Flight Dialog Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-200"
            >
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Оформление авиарейса</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-1 rounded text-slate-400 hover:bg-slate-150 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateFlight} className="p-5 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Авиакомпания (Airline)</label>
                  <input
                    type="text"
                    required
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    placeholder="Например: Saudia, flynas, TK"
                    className="w-full bg-slate-50 text-slate-905 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Номер рейса (Flight Number)</label>
                  <input
                    type="text"
                    required
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="Например: SV-340"
                    className="w-full bg-slate-50 text-slate-905 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Время вылета</label>
                    <input
                      type="datetime-local"
                      required
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full bg-slate-50 text-slate-905 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Время прилета</label>
                    <input
                      type="datetime-local"
                      required
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="w-full bg-slate-50 text-slate-905 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Стоимость билета ($ USD)</label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={5000}
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-905 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs font-semibold"
                  />
                </div>

                <div className="pt-3 border-t border-slate-150 flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-1.5 px-3 border border-slate-200 text-slate-650 rounded-md text-xs font-semibold hover:bg-slate-105 cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    Создать рейс
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
