import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api'; // Убедись, что в api.ts есть getLeaders, createLeader, deleteLeader
import { Leader } from '../types';
import { Plus, User, Phone, Award, Trash2, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LeadersView() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Форма
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [exp, setExp] = useState('');

  // Запрос данных
  const { data: leaders, isLoading } = useQuery({
    queryKey: ['leaders'],
    queryFn: api.getLeaders
  });

  // Мутация на создание
  const createMutation = useMutation({
    mutationFn: api.createLeader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaders'] });
      setIsModalOpen(false);
      setName(''); setPhone(''); setExp('');
    }
  });

  // Мутация на удаление
  const deleteMutation = useMutation({
    mutationFn: api.deleteLeader,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leaders'] })
  });

  const filteredLeaders = leaders?.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <div className="p-10 text-center">Загрузка списка лидеров...</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ажы башчы (Лидеры групп)</h1>
          <p className="text-slate-500 text-sm">Управление списком руководителей для сопровождения групп.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition"
        >
          <Plus size={18} /> Добавить лидера
        </button>
      </div>

      {/* Поиск */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Поиск по имени..." 
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Список карточек */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeaders.map(leader => (
          <motion.div 
            layout
            key={leader.id}
            className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
                <User size={24} />
              </div>
              <button 
                onClick={() => confirm('Удалить лидера?') && deleteMutation.mutate(leader.id)}
                className="text-slate-300 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="font-bold text-lg text-slate-900">{leader.name}</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-400" /> {leader.phoneNumber}
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-slate-400" /> Опыт: {leader.experience || 'Не указан'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Модалка создания */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">Новый Ажы башчы</h2>
                <X className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
              </div>
              <div className="space-y-4">
                <input placeholder="ФИО Лидера" className="w-full p-2 border rounded-lg" value={name} onChange={e => setName(e.target.value)} />
                <input placeholder="Номер телефона" className="w-full p-2 border rounded-lg" value={phone} onChange={e => setPhone(e.target.value)} />
                <input placeholder="Опыт (например: 10 лет)" className="w-full p-2 border rounded-lg" value={exp} onChange={e => setExp(e.target.value)} />
                <button 
                  onClick={() => createMutation.mutate({ name, phoneNumber: phone, experience: exp })}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700"
                >
                  Сохранить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}