/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  useGroups, 
  useCreateGroup, 
  useUpdateGroup, 
  useDeleteGroup,
  useLeaders // <-- 1. ДОБАВИЛ ИМПОРТ
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
  Users, 
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GroupsView() {
  const { data: groups, isLoading: groupsLoading, error } = useGroups();
  const { data: leaders } = useLeaders(); // <-- 2. ПОЛУЧАЕМ СПИСОК ЛИДЕРОВ
  
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
  const [leaderId, setLeaderId] = useState<number>(0); // По умолчанию 0 или пусто
  const [status, setStatus] = useState<GroupStatus>(GroupStatus.Planning);

  const openCreateModal = () => {
    setEditingGroup(null);
    setName('');
    setDepartureDate('2026-06-18');
    setReturnDate('2026-07-02');
    setMaxSeats(25);
    setLeaderId(leaders && leaders.length > 0 ? leaders[0].id : 0); // Ставим первого лидера из базы
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
    if (confirm('Вы уверены, что хотите удалить эту группу?')) {
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

  if (groupsLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight">Группы Паломников</h1>
          <p className="text-gray-500 text-sm mt-1">Управление отрядами и Ажы башчы.</p>
        </div>
        <button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 text-xs">
          <Plus className="w-4 h-4" /> Создать группу
        </button>
      </div>

      {/* Grid view of groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => {
          const count = group.pilgrims?.length ?? 0;
          const percentAvailable = Math.round((count / group.maxSeats) * 100);
          const statusStyle = getStatusLabel(group.status);
          
          return (
            <motion.div key={group.id} className="bg-white rounded-xl p-4.5 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>
              <div className="flex justify-between mb-3">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${statusStyle.bg}`}>
                  {statusStyle.text}
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">#UMR-{group.id}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-950">{group.name}</h3>
              
              <div className="space-y-1.5 mt-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Вылет: <strong className="text-slate-800">{new Date(group.departureDate).toLocaleDateString()}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  {/* 3. ОТОБРАЖАЕМ ИМЯ ЛИДЕРА ИЗ БАЗЫ */}
                  <span>Лидер: <strong className="text-slate-800">
                    {leaders?.find(l => l.id === group.leaderId)?.name || `ID: ${group.leaderId}`}
                  </strong></span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                 <div className="flex justify-between text-[11px] mb-1">
                    <span>Заполнено</span>
                    <span className="font-bold">{count} / {group.maxSeats}</span>
                 </div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: `${percentAvailable}%` }}></div>
                 </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={() => openEditModal(group)} className="flex-1 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-semibold flex items-center justify-center gap-1">
                  <Edit3 className="w-3 h-3" /> Изменить
                </button>
                <button onClick={() => handleDelete(group.id)} className="p-1.5 bg-red-50 text-red-600 rounded border border-red-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-200">
              <div className="px-5 py-3.5 bg-slate-50 border-b flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{editingGroup ? 'Изменить группу' : 'Новая группа'}</h3>
                <X className="w-4 h-4 cursor-pointer" onClick={() => setIsModalOpen(false)} />
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Название группы</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 px-3 py-1.5 rounded-md border text-xs" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Вылет</label>
                    <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="w-full bg-slate-50 px-3 py-1.5 border rounded-md text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Возврат</label>
                    <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-slate-50 px-3 py-1.5 border rounded-md text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Лимит мест</label>
                    <input type="number" value={maxSeats} onChange={(e) => setMaxSeats(Number(e.target.value))} className="w-full bg-slate-50 px-3 py-1.5 border rounded-md text-xs" />
                  </div>
                  
                  {/* 4. ВЫПАДАЮЩИЙ СПИСОК ЛИДЕРОВ */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ажы башчы</label>
                    <select
                      required
                      value={leaderId}
                      onChange={(e) => setLeaderId(Number(e.target.value))}
                      className="w-full bg-slate-50 px-3 py-1.5 border rounded-md text-xs font-semibold"
                    >
                      <option value="">Выберите лидера</option>
                      {leaders?.map((leader) => (
                        <option key={leader.id} value={leader.id}>
                          {leader.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full py-2 bg-emerald-600 text-white font-bold rounded-md text-xs">
                  {editingGroup ? 'Сохранить' : 'Создать'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}