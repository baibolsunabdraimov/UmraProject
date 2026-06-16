/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  useGroups, 
  useCreateGroup, 
  useUpdateGroup, 
  useDeleteGroup 
} from '../lib/api';
import { 
  GroupStatus, 
  UmrahGroup 
} from '../types';
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  Users, 
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GroupsView() {
  const { data: groups, isLoading, error } = useGroups();
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();
  const deleteMutation = useDeleteGroup();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal Control state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UmrahGroup | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [departureDate, setDepartureDate] = useState('2026-06-18');
  const [returnDate, setReturnDate] = useState('2026-07-02');
  const [maxSeats, setMaxSeats] = useState(25);
  const [leaderId, setLeaderId] = useState(101);
  const [status, setStatus] = useState<GroupStatus>(GroupStatus.Planning);

  const openCreateModal = () => {
    setEditingGroup(null);
    setName('');
    setDepartureDate('2026-06-18');
    setReturnDate('2026-07-02');
    setMaxSeats(25);
    setLeaderId(101);
    setStatus(GroupStatus.Planning);
    setIsModalOpen(true);
  };

  const openEditModal = (group: UmrahGroup) => {
    setEditingGroup(group);
    setName(group.name);
    setDepartureDate(group.departureDate.substring(0, 10));
    setReturnDate(group.returnDate.substring(0, 10));
    setMaxSeats(group.maxSeats);
    setLeaderId(group.leaderId);
    setStatus(group.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      departureDate: new Date(departureDate).toISOString(),
      returnDate: new Date(returnDate).toISOString(),
      maxSeats: Number(maxSeats),
      leaderId: Number(leaderId),
      status: Number(status)
    };

    try {
      if (editingGroup) {
        await updateMutation.mutateAsync({ id: editingGroup.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту группу? Все связанные паломники будут изъяты из неё.')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredGroups = groups?.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.status.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusLabel = (status: GroupStatus) => {
    switch (status) {
      case GroupStatus.Planning:
        return { text: 'Планируется', bg: 'bg-blue-50 text-blue-700 border border-blue-100', dot: 'bg-blue-500' };
      case GroupStatus.Active:
        return { text: 'Активная', bg: 'bg-emerald-50 text-emerald-700 border border-emerald-100', dot: 'bg-emerald-500' };
      case GroupStatus.Completed:
        return { text: 'Завершена', bg: 'bg-slate-100 text-slate-700 border border-slate-200', dot: 'bg-slate-500' };
      default:
        return { text: 'В планировании', bg: 'bg-blue-50 text-blue-700 border border-blue-100', dot: 'bg-blue-500' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Загрузка групп паломников...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200">
        Ошибка при загрузке групп паломников.
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in" id="groups-container">
      {/* Header element */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight" id="groups-title">
            Группы Паломников
          </h1>
          <p className="text-gray-500 text-sm mt-1">Организационные отряды, уполномоченные лидеры (Маалымы) и мониторинг наполнения.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm flex items-center justify-center gap-2 text-xs self-start sm:self-auto cursor-pointer"
          id="btn-create-group"
        >
          <Plus className="w-4 h-4" />
          Создать группу
        </button>
      </div>

      {/* Filter and search utilities */}
      <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 justify-between" id="groups-filters">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Поиск по названию группы..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 pl-9 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 text-xs"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['all', '0', '1', '2'].map((statusVal) => {
            const labels = ['Все', 'В планировании', 'Активные', 'Завершенные'];
            const val = statusVal === 'all' ? 'all' : statusVal;
            const active = statusFilter === val;
            return (
              <button
                key={statusVal}
                onClick={() => setStatusFilter(val)}
                className={`py-1.5 px-3 rounded-md font-medium text-xs transition border ${
                  active 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm font-semibold' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {labels[['all', '0', '1', '2'].indexOf(statusVal)]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid view of groups */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">Группы не найдены</h3>
          <p className="text-xs text-slate-500 mt-1">Попробуйте изменить параметры поиска или добавьте новую группу.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="groups-grid">
          {filteredGroups.map((group) => {
            const count = group.pilgrims?.length ?? 0;
            const percentAvailable = Math.round((count / group.maxSeats) * 100);
            const statusStyle = getStatusLabel(group.status);
            
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                key={group.id}
                className="bg-white rounded-xl p-4.5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow transition duration-200 relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>

                <div>
                  <div className="flex items-center justify-between mb-3 mt-1">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${statusStyle.bg} flex items-center gap-1`}>
                      <span className={`w-1 h-1 rounded-full ${statusStyle.dot}`}></span>
                      {statusStyle.text}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">#UMR-{group.id}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-950 line-clamp-1">{group.name}</h3>

                  <div className="space-y-1.5 mt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Вылет: <strong className="text-slate-800">{new Date(group.departureDate).toLocaleDateString()}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Прилет назад: <strong className="text-slate-800">{new Date(group.returnDate).toLocaleDateString()}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Лидер: <strong className="text-slate-800">Маалым {group.leaderId}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Заполнено мест
                    </span>
                    <span className="font-bold text-slate-800 text-[11px]">{count} / {group.maxSeats} чел.</span>
                  </div>

                  {/* Progress bar container */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        percentAvailable >= 100 ? 'bg-red-500' : 
                        percentAvailable >= 80 ? 'bg-amber-500' : 
                        'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(100, percentAvailable)}%` }}
                    ></div>
                  </div>

                  {/* Commands */}
                  <div className="flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => openEditModal(group)}
                      className="flex-1 py-1 px-2.5 bg-slate-50 hover:bg-slate-105 border border-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                      title="Редактировать группу"
                    >
                      <Edit3 className="w-3 h-3" />
                      Изменить
                    </button>
                    <button
                      onClick={() => handleDelete(group.id)}
                      className="py-1 px-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded transition cursor-pointer"
                      title="Удалить группу"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Dialog Modality for Create / Edit */}
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
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingGroup ? 'Редактировать группу' : 'Оформить новую группу'}
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
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Название группы</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например: Ихсан Июнь (Saudia)"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Дата вылета</label>
                    <input
                      type="date"
                      required
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Дата возврата</label>
                    <input
                      type="date"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Максимальный лимит мест</label>
                    <input
                      type="number"
                      required
                      min={5}
                      max={100}
                      value={maxSeats}
                      onChange={(e) => setMaxSeats(Number(e.target.value))}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ID Лидера (Маалым)</label>
                    <input
                      type="number"
                      required
                      value={leaderId}
                      onChange={(e) => setLeaderId(Number(e.target.value))}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Статус</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-1.5 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs"
                  >
                    <option value={GroupStatus.Planning}>Планируется</option>
                    <option value={GroupStatus.Active}>Активная</option>
                    <option value={GroupStatus.Completed}>Завершена</option>
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
                    {editingGroup ? 'Сохранить изменения' : 'Создать'}
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
