/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  usePilgrims, 
  useGroups, 
  useFlights,
  useCreatePilgrim, 
  useUpdatePilgrim, 
  useDeletePilgrim 
} from '../lib/api';
import { 
  Pilgrim, 
  PaymentStatus 
} from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  CreditCard,
  Edit2, 
  Trash2, 
  X, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Phone,
  Plane,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PilgrimsView() {
  const { data: pilgrims, isLoading: pilgrimsLoading } = usePilgrims();
  const { data: groups, isLoading: groupsLoading } = useGroups();
  const { data: flights } = useFlights();

  const createMutation = useCreatePilgrim();
  const updateMutation = useUpdatePilgrim();
  const deleteMutation = useDeletePilgrim();

  // Search, Status, and Group filters
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPilgrim, setEditingPilgrim] = useState<Pilgrim | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [groupId, setGroupId] = useState<number>(1);
  const [flightId, setFlightId] = useState<string>('null');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.Unpaid);

  const openCreateModal = () => {
    setEditingPilgrim(null);
    setFullName('');
    setPassportNumber('');
    setPhoneNumber('');
    if (groups && groups.length > 0) {
      setGroupId(groups[0].id);
    }
    setFlightId('null');
    setPaymentStatus(PaymentStatus.Unpaid);
    setIsModalOpen(true);
  };

  const openEditModal = (pilgrim: Pilgrim) => {
    setEditingPilgrim(pilgrim);
    setFullName(pilgrim.fullName);
    setPassportNumber(pilgrim.passportNumber);
    setPhoneNumber(pilgrim.phoneNumber);
    setGroupId(pilgrim.groupId);
    setFlightId(pilgrim.flightId ? pilgrim.flightId.toString() : 'null');
    setPaymentStatus(pilgrim.paymentStatus);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    
    const payload = {
      id: editingPilgrim ? editingPilgrim.id : 0,
      fullName,
      passportNumber: passportNumber.trim(),
      phoneNumber: phoneNumber.trim(),
      groupId: Number(groupId),
      flightId: flightId === 'null' ? null : Number(flightId),
      paymentStatus: Number(paymentStatus)
    };

    try {
      if (editingPilgrim) {
        // Мы отправляем id и в URL, и в данных (data: payload)
        await updateMutation.mutateAsync({ id: editingPilgrim.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
    }
  };
  const handleDelete = async (id: number) => {
    if (confirm('Вы действительно хотите удалить данного паломника из системы?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Status mapping
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Unpaid:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-red-50 text-red-700 border border-red-100 uppercase tracking-tight">
            <XCircle className="w-3 h-3 text-red-500" />
            Не оплачен
          </span>
        );
      case PaymentStatus.PartiallyPaid:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-tight">
            <AlertTriangle className="w-3 h-3 text-amber-555" />
            Частично
          </span>
        );
      case PaymentStatus.Paid:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-tight">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Оплачено
          </span>
        );
    }
  };

  // Master filter logic
  const filteredPilgrims = pilgrims?.filter(p => {
    const query = search.toLowerCase();
    const matchText = p.fullName.toLowerCase().includes(query) || p.passportNumber.toLowerCase().includes(query);
    const matchPayment = paymentFilter === 'all' || p.paymentStatus.toString() === paymentFilter;
    const matchGroup = groupFilter === 'all' || p.groupId.toString() === groupFilter;
    return matchText && matchPayment && matchGroup;
  }) || [];

  const loading = pilgrimsLoading || groupsLoading;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Загрузка картотеки клиентов...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in animate-duration-300" id="pilgrims-container">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight" id="pilgrims-title">
            Реестр Паломников
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            База паломников компании, паспортный контроль, статусы оплат и привязки к перелетам.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm flex items-center justify-center gap-2 text-xs self-start sm:self-auto cursor-pointer"
          id="btn-add-pilgrim"
        >
          <Plus className="w-4 h-4" />
          Добавить паломника
        </button>
      </div>

      {/* Filter and utility section */}
      <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3" id="filters-panel">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="ФИО паломника или паспорт..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 pl-9 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 py-1.5 px-3 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-xs font-semibold"
          >
            <option value="all">Все Группы</option>
            {groups?.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 py-1.5 px-3 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-xs font-semibold"
          >
            <option value="all">Все статусы оплаты</option>
            <option value="0">Не оплачено</option>
            <option value="1">Частично</option>
            <option value="2">Оплачено</option>
          </select>
        </div>
      </div>

      {/* Table grid element */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" id="pilgrims-table">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Паломник (ФИО)</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Паспорт</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Контакты</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Группа</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Авиабилет</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Оплата</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPilgrims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 font-medium text-xs">
                    В картотеке не найдено подходящих паломников.
                  </td>
                </tr>
              ) : (
                filteredPilgrims.map((pilgrim) => (
                  <tr key={pilgrim.id} className="hover:bg-slate-50/50 transition duration-150">
                    {/* FIO */}
                    <td className="py-2.5 px-4 font-semibold text-slate-900 text-xs">
                      {pilgrim.fullName}
                    </td>

                    {/* Passport */}
                    <td className="py-2.5 px-4">
                      <span className="flex items-center gap-1.5 font-mono text-slate-600 text-[11px] font-medium">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {pilgrim.passportNumber}
                      </span>
                    </td>

                    {/* Contacts */}
                    <td className="py-2.5 px-4">
                      <span className="flex items-center gap-1 text-[11px] text-slate-600">
                        <Phone className="w-3 h-3 text-slate-450" />
                        {pilgrim.phoneNumber}
                      </span>
                    </td>

                    {/* Group */}
                    <td className="py-2.5 px-4">
                      {pilgrim.group ? (
                        <span className="inline-flex items-center gap-1 py-0.5 px-1.5 bg-emerald-50 text-emerald-700 rounded text-[11px] font-medium border border-emerald-100/50">
                          <Users className="w-3 h-3 text-emerald-600" />
                          {pilgrim.group.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Не закреплен</span>
                      )}
                    </td>

                    {/* Airline Ticket */}
                    <td className="py-2.5 px-4">
                      {pilgrim.flight ? (
                        <span className="inline-flex items-center gap-1.5 text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 font-medium text-[11px]">
                          <Plane className="w-3.5 h-3.5 text-purple-600" />
                          {pilgrim.flight.airline} {pilgrim.flight.flightNumber}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-450 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                          Без авиабилета
                        </span>
                      )}
                    </td>

                    {/* Payment status badge */}
                    <td className="py-2.5 px-4 text-center">
                      {getPaymentStatusBadge(pilgrim.paymentStatus)}
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(pilgrim)}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-205 text-slate-700 p-1.5 rounded transition cursor-pointer"
                          title="Редактировать паломника"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(pilgrim.id)}
                          className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 p-1.5 rounded transition cursor-pointer"
                          title="Удалить из реестра"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialogue Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-205"
            >
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingPilgrim ? 'Редактировать паломника' : 'Регистрация нового паломника'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-1 rounded text-slate-400 hover:bg-slate-150 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ФИО клиента</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Например: Каныбек уулу Нурбек"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Номер загранпаспорта</label>
                    <input
                      type="text"
                      required
                      placeholder="AC1234567"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Номер телефона</label>
                    <input
                      type="text"
                      required
                      placeholder="+996 550 112 233"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Группа</label>
                    <select
                      value={groupId}
                      onChange={(e) => setGroupId(Number(e.target.value))}
                      className="w-full bg-slate-50 text-slate-950 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-xs"
                    >
                      {groups?.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Рейс/Авиабилет</label>
                    <select
                      value={flightId}
                      onChange={(e) => setFlightId(e.target.value)}
                      className="w-full bg-slate-50 text-slate-950 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-xs"
                    >
                      <option value="null">Без билета</option>
                      {flights?.map(f => (
                        <option key={f.id} value={f.id}>{f.airline} ({f.flightNumber})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Статус Оплаты</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-950 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-xs"
                  >
                    <option value={PaymentStatus.Unpaid}>Не оплачено</option>
                    <option value={PaymentStatus.PartiallyPaid}>Частично оплачено</option>
                    <option value={PaymentStatus.Paid}>Полностью оплачено</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-150 flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-1.5 px-3 border border-slate-200 text-slate-600 rounded-md text-xs font-semibold hover:bg-slate-105 cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <span className="animate-spin border-2 border-white rounded-full h-3 w-3 border-b-0"></span>
                    ) : null}
                    {editingPilgrim ? 'Сохранить изменения' : 'Зарегистрировать'}
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
