/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  useUserRequests, 
  useUpdateUserRequestStatus, 
  useDeleteUserRequest ,
  useApproveUserRequest
} from '../lib/api';
import { 
  UserRequest, 
  RequestStatus 
} from '../types';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Trash2, 
  Info, 
  AlertTriangle,
  UserCheck,
  Calendar,
  Phone,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function UserRequestsAdminView() {
  const { data: requests, isLoading: requestsLoading, error } = useUserRequests();
  const approveMutation = useApproveUserRequest(); // Для одобрения
  const updateStatusMutation = useUpdateUserRequestStatus(); // Оставляем для "Отклонить"
  const deleteMutation = useDeleteUserRequest();

  // Search and filter status values
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Local notification inside component for error states (e.g., group full)
  const [localError, setLocalError] = useState<string | null>(null);

  // Handle Approve Application request
  const handleApprove = async (id: number) => {
    setLocalError(null);
    try {
      // Теперь вызываем специальную мутацию одобрения
      await approveMutation.mutateAsync(id);
    } catch (err: any) {
      console.error(err);
      setLocalError(err.response?.data?.message || 'Ошибка одобрения. Проверьте, существует ли группа.');
    }
  };

  // Handle Reject Application request
  const handleReject = async (id: number) => {
    setLocalError(null);
    if (confirm('Вы действительно желаете отклонить заявку данного соискателя?')) {
      try {
        await updateStatusMutation.mutateAsync({
          id,
          status: RequestStatus.Rejected
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Handle Delete request trace
  const handleDelete = async (id: number) => {
    setLocalError(null);
    if (confirm('Вы хотите безвозвратно удалить карточку заявки из архива?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Search/Filter logic on requests list
  const filteredRequests = requests?.filter(r => {
    const query = search.toLowerCase();
    const matchText = r.fullName.toLowerCase().includes(query) || r.passportNumber.toLowerCase().includes(query);
    const matchStatus = statusFilter === 'all' || r.status.toString() === statusFilter;
    return matchText && matchStatus;
  }) || [];

  // Count pending applications
  const pendingCount = requests?.filter(r => r.status === RequestStatus.Pending).length || 0;

  if (requestsLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Загрузка заявок паломников...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in animate-duration-300" id="requests-admin-panel">
      {/* Upper stats banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight" id="requests-title">
            Заявки на бронирование
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Обработка электронных заявок, поступающих от клиентов из внешнего портала. Одобрение автоматически переносит клиентов в реестр паломников.
          </p>
        </div>
        
        {pendingCount > 0 && (
          <div className="bg-amber-50 text-amber-800 font-semibold py-1.5 px-3 rounded-lg border border-amber-200 text-xs self-start sm:self-auto flex items-center gap-1.5 shadow-3xs animate-pulse">
            <Clock className="w-4 h-4 text-amber-555 text-amber-600" />
            <span>Требует внимания: {pendingCount} заявок</span>
          </div>
        )}
      </div>

      {/* Error notification component */}
      {localError && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>{localError}</span>
          </div>
          <button onClick={() => setLocalError(null)} className="p-1 hover:bg-red-100/50 rounded text-red-700/60 font-black cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Filters bar */}
      <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3" id="requests-filters">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Претендент, ФИО или паспорт..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 pl-9 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-xs font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 py-1.5 px-3 rounded-md border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-xs font-semibold"
          >
            <option value="all">Все заявки</option>
            <option value="0">Ожидают (Pending)</option>
            <option value="1">Одобрены (Approved)</option>
            <option value="2">Отклонены (Rejected)</option>
          </select>
        </div>
      </div>

      {/* Grid containing Requests table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" id="requests-table">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center w-12">ID</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Заявитель ФИО</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Паспортные данные</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Телефонный контакт</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Выбранная Группа</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Статус</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Дата подачи</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500 font-medium text-xs">
                    Не найдено поданных заявок по заданным фильтрам.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition duration-150">
                    {/* ID */}
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-400 text-[11px]">
                      #{1000 + req.id}
                    </td>

                    {/* FIO */}
                    <td className="py-2.5 px-4 font-bold text-slate-900 text-xs">
                      {req.fullName}
                    </td>

                    {/* Passport */}
                    <td className="py-2.5 px-4">
                      <span className="flex items-center gap-1.5 font-mono text-slate-700 text-[11px] font-semibold">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {req.passportNumber}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-2.5 px-4">
                      <span className="flex items-center gap-1 text-slate-600 text-[11px] font-medium">
                        <Phone className="w-3 h-3 text-slate-450" />
                        {req.phoneNumber}
                      </span>
                    </td>

                    {/* Assigned Group */}
                    <td className="py-2.5 px-4">
                      {req.group ? (
                        <span className="inline-flex items-center gap-1 py-0.5 px-1.5 bg-sky-50 text-sky-800 rounded text-[11px] font-semibold border border-sky-100/50">
                          <Calendar className="w-3 h-3 text-sky-600" />
                          {req.group.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Зависшая группа</span>
                      )}
                    </td>

                    {/* Work status */}
                    <td className="py-2.5 px-4 text-center">
                      {req.status === 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold rounded bg-yellow-55 bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider">
                          <Clock className="w-3 h-3 text-amber-500" />
                          Ожидает
                        </span>
                      )}
                      {req.status === 1 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Одобрено
                        </span>
                      )}
                      {req.status === 2 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold rounded bg-red-50 text-red-700 border border-red-105 uppercase tracking-wider">
                          <XCircle className="w-3 h-3 text-red-500" />
                          Отклонен
                        </span>
                      )}
                    </td>

                    {/* Submit Date */}
                    <td className="py-2.5 px-4 text-slate-500 text-[11px] font-medium">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions panel */}
                    <td className="py-2 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {req.status === RequestStatus.Pending ? (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="bg-emerald-55 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-150 py-1 px-2 rounded-md font-bold text-[10px] flex items-center gap-1 transition cursor-pointer"
                              title="Одобрить заявку"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Одобрить
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-150 py-1 px-2 rounded-md font-bold text-[10px] flex items-center gap-1 transition cursor-pointer"
                              title="Отклонить заявку"
                            >
                              Отклонить
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDelete(req.id)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-205 text-slate-500 hover:text-red-655 p-1.5 rounded transition cursor-pointer"
                            title="Удалить заявку"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
