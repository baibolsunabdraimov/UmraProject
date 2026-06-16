/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  useLeaders, 
  useCreateLeader, 
  useUpdateLeader, 
  useDeleteLeader 
} from '../lib/api';
import { Leader } from '../types';
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  Award, 
  Trash2, 
  Edit3, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LeadersView() {
  const { data: leaders, isLoading, error } = useLeaders();
  const createMutation = useCreateLeader();
  const updateMutation = useUpdateLeader();
  const deleteMutation = useDeleteLeader();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Control state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [experience, setExperience] = useState('');

  const openCreateModal = () => {
    setEditingLeader(null);
    setName('');
    setPhoneNumber('');
    setExperience('');
    setIsModalOpen(true);
  };

  const openEditModal = (leader: Leader) => {
    setEditingLeader(leader);
    setName(leader.name);
    setPhoneNumber(leader.phoneNumber);
    setExperience(leader.experience || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneNumber.trim()) return;

    const payload = {
      name,
      phoneNumber,
      experience
    };

    try {
      if (editingLeader) {
        await updateMutation.mutateAsync({ id: editingLeader.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этого лидера?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredLeaders = leaders?.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Загрузка списка лидеров...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight">Ажы башчы (Лидеры)</h1>
          <p className="text-gray-500 text-sm mt-1">Управление списком руководителей групп и их контактными данными.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          Добавить лидера
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Поиск лидера по имени..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 pl-9 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 text-xs"
          />
        </div>
      </div>

      {/* Grid view */}
      {filteredLeaders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">Лидеры не найдены</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeaders.map((leader) => (
            <motion.div
              layout
              key={leader.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition duration-200 group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-emerald-50 p-3 rounded-full text-emerald-600">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(leader)} className="p-1.5 hover:bg-slate-100 rounded text-slate-600">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(leader.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">{leader.name}</h3>
              
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{leader.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>Опыт: <strong>{leader.experience || 'Не указан'}</strong></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200"
            >
              <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{editingLeader ? 'Редактировать лидера' : 'Добавить лидера'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ФИО Лидера</label>
                  <input
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Например: Абдулла ажы"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Номер телефона</label>
                  <input
                    type="text" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0555 123 456"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Опыт / Описание</label>
                  <input
                    type="text" value={experience} onChange={(e) => setExperience(e.target.value)}
                    placeholder="Например: 10 лет опыта, 15 поездок"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition shadow-sm text-sm"
                >
                  {editingLeader ? 'Сохранить изменения' : 'Создать запись'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}