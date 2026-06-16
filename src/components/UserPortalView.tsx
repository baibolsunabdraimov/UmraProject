/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  useGroups, 
  useCreateUserRequest, 
  useUserRequests 
} from '../lib/api';
import { 
  Compass, 
  Calendar, 
  User, 
  FileText, 
  Phone, 
  CheckCircle, 
  Clock, 
  Send, 
  Search, 
  UserCheck, 
  AlertCircle,
  Users,
  ShieldAlert,
  HelpCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function UserPortalView() {
  const { data: groups, isLoading: groupsLoading } = useGroups();
  const { data: userRequests } = useUserRequests();
  const submitRequestMutation = useCreateUserRequest();

  // Form states
  const [fullName, setFullName] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  
  // Custom status tracker query
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);

  // Success message modal
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle submit registration request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!fullName.trim() || !passportNumber.trim() || !phoneNumber.trim() || !selectedGroupId) {
      setErrorMessage('Пожалуйста, заполните все поля формы.');
      return;
    }

    try {
      const response = await submitRequestMutation.mutateAsync({
        fullName: fullName.trim(),
        passportNumber: passportNumber.trim().toUpperCase(),
        phoneNumber: phoneNumber.trim(),
        groupId: Number(selectedGroupId)
      });
      
      setSubmittedRequest(response);
      
      // Clear form
      setFullName('');
      setPassportNumber('');
      setPhoneNumber('');
      setSelectedGroupId('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Произошла ошибка при отправке заявки. Попробуйте еще раз.');
    }
  };

  // Find requests matching passport or phone for status tracker
  const trackedRequests = searchQuery.trim() 
    ? userRequests?.filter(r => 
        r.passportNumber.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        r.phoneNumber.replace(/\s+/g, '').includes(searchQuery.replace(/\s+/g, '').trim())
      ) || []
    : [];

  const handleApplyGroup = (groupId: number) => {
    setSelectedGroupId(groupId.toString());
    const formElement = document.getElementById('apply-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in animate-duration-300" id="user-portal-container">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden" id="user-hero-banner">
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Compass className="w-64 h-64 animate-spin-slow" />
        </div>
        <div className="max-w-2xl space-y-3 z-10 relative">
          <span className="bg-emerald-500 bg-opacity-20 text-emerald-300 font-bold px-2.5 py-1 rounded text-[10px] uppercase tracking-wider border border-emerald-500/20 inline-block">
            Официальный портал паломников • Ихсан Умра
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Оформите заявку на паломничество Священной Умры
          </h1>
          <p className="text-emerald-100/90 text-sm leading-relaxed">
            Выберите желаемую группу, занесите свои паспортные данные и отправьте интерактивную заявку. Органы авиаперелетов и администраторы забронируют для вас билет и визу.
          </p>
        </div>
      </div>

      {/* Main interactive split design: Groups display & Form submission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column (8cols in lg): Catalog of Groups */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Каталог доступных групп</h2>
              <p className="text-[11px] text-slate-500">Планы поездок, даты заездов и наличие свободных мест в автобусах.</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 py-1 px-2.5 rounded">
              {groups?.length || 0} направлений
            </span>
          </div>

          {groupsLoading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 min-h-[250px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="mt-3 text-xs text-slate-500 font-medium">Получение актуального списка программ...</p>
            </div>
          ) : !groups || groups.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              В настоящее время нет доступных для бронирования групп. Пожалуйста, попробуйте зайти позже.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map(group => {
                // Determine occupied seats
                const occupied = group.pilgrims?.length || 0;
                const freeSeats = Math.max(0, group.maxSeats - occupied);
                const pct = Math.round((occupied / group.maxSeats) * 100);

                return (
                  <div 
                    key={group.id} 
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-500/20 hover:shadow-sm transition flex flex-col justify-between"
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-800 rounded-md px-2 py-0.5 border border-emerald-100">
                          <Compass className="w-3 h-3 text-emerald-600" />
                          Ихсан Групп
                        </span>
                        <span className="text-slate-450 text-[10px] font-bold font-mono">ID: {group.id}</span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-xs tracking-tight line-clamp-1">{group.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(group.departureDate).toLocaleDateString()} &mdash; {new Date(group.returnDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Seats indicator progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-500">Заполняемость:</span>
                          <span className={freeSeats <= 3 ? 'text-red-600' : 'text-emerald-700'}>
                            {occupied} / {group.maxSeats} мест
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${freeSeats <= 3 ? 'bg-red-500' : 'bg-emerald-605 bg-emerald-600'}`} 
                            style={{ width: `${Math.min(100, pct)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-105 flex items-center justify-between">
                      <div className="text-[10px] text-slate-500">
                        Осталось: <strong className="text-slate-800 font-mono text-xs">{freeSeats}</strong> мест
                      </div>
                      <button
                        onClick={() => handleApplyGroup(group.id)}
                        disabled={freeSeats === 0}
                        className={`py-1 px-3.5 text-[11px] font-bold rounded-md transition cursor-pointer flex items-center gap-1 ${
                          freeSeats === 0
                            ? 'bg-slate-200 text-slate-450 border-slate-300 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                        }`}
                      >
                        {freeSeats === 0 ? 'Группа полная' : 'Выбрать группу'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Real-time Request Status Live Tracker Portal */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Экспресс-проверка статуса заявки
                </h3>
                <p className="text-[11px] text-slate-500">
                  Введите номер вашего загранпаспорта или телефон, чтобы узнать статус в реальном времени.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Например: AC1234567 или +996 550..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearched(true);
                }}
                className="flex-1 bg-white text-slate-900 min-w-0 px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
              />
            </div>

            {searchQuery.trim() && (
              <div className="space-y-2 pt-2 border-t border-slate-200 border-dashed" id="tracked-results-container">
                {trackedRequests.length === 0 ? (
                  <div className="flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Курьерская служба и администратор пока не обнаружили активных заявок по запросу. Проверьте правильность занесения символов загранпаспорта.</span>
                  </div>
                ) : (
                  trackedRequests.map(req => (
                    <div 
                      key={req.id} 
                      className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{req.fullName}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">{req.passportNumber}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Заявка #100{req.id} в группу: <strong className="text-slate-700">{req.group?.name || 'Загрузка...'}</strong>
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Отправлено: {new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>

                      <div>
                        {req.status === 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-yellow-55 bg-amber-50 text-amber-750 border border-amber-100 font-sans uppercase tracking-tight">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            На рассмотрении
                          </span>
                        )}
                        {req.status === 1 && (
                          <div className="space-y-1 text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 font-sans uppercase tracking-tight">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Утверждено
                            </span>
                            <p className="text-[9px] text-emerald-600 font-semibold max-w-[150px] leading-tight">Вас успешно занесли в реестр паломников!</p>
                          </div>
                        )}
                        {req.status === 2 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-red-50 text-red-700 border border-red-100 font-sans uppercase tracking-tight">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            Отклонено
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right column (5cols in lg): Form panel */}
        <div className="lg:col-span-5" id="apply-form-section">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 sticky top-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Форма бронирования места</h3>
                <p className="text-[11px] text-slate-500 leading-none mt-1">Внесите точные данные по паспорту.</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-[11px] font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ФИО как в загранпаспорте</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Например: Sadykov Chingiz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 pl-9 pr-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:focus:ring-emerald-500/10 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Номер Загранпаспорта</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Пример: AC223344"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 pl-9 pr-3.5 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:focus:ring-emerald-500/10 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Номер мобильного телефона</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="+996 550 11 22 33"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 pl-9 pr-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:focus:ring-emerald-500/10 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Группа паломников</label>
                <select
                  required
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:focus:ring-emerald-500/10 focus:bg-white"
                >
                  <option value="">-- Выберите группу оператора --</option>
                  {groups?.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} (осталось {(g.maxSeats - (g.pilgrims?.length || 0))} мест)
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-2 text-[10px] text-slate-500">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Нажимая кнопку «Отправить заявку», вы передаете паспортные данные нашему оператору-организаторам для начала оформления визовой поддержки.</span>
              </div>

              <button
                type="submit"
                disabled={submitRequestMutation.isPending}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg shadow-sm hover:shadow text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                id="btn-submit-request"
              >
                {submitRequestMutation.isPending ? (
                  <span className="animate-spin border-2 border-white rounded-full h-3.5 w-3.5 border-b-0"></span>
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Отправить заявку операторам
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal Indicator Pop-up */}
      <AnimatePresence>
        {submittedRequest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-55 bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900">Заявка успешно направлена!</h3>
                  <p className="text-[11px] text-slate-500">
                    Ваш запрос внесен в базу под номером <strong className="font-mono text-emerald-600 font-bold">#100{submittedRequest.id}</strong>.
                  </p>
                </div>

                <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 font-medium">
                  <div>ФИО заявителя: <strong className="text-slate-900 font-bold">{submittedRequest.fullName}</strong></div>
                  <div>Загранпаспорт: <strong className="text-slate-900 font-mono font-bold">{submittedRequest.passportNumber}</strong></div>
                  <div>Выбранная группа: <strong className="text-slate-900 font-bold">{submittedRequest.group?.name || 'Загрузка...'}</strong></div>
                </div>

                <p className="text-[10px] text-slate-500 italic leading-snug">
                  Вы можете отслеживать статус этой заявки в реальном времени на этой странице по номеру паспорта ({submittedRequest.passportNumber}). Ожидайте звонка!
                </p>

                <button
                  onClick={() => setSubmittedRequest(null)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg cursor-pointer"
                >
                  Оформить новую или закрыть окно
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
