/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  useSalesStats, 
  usePilgrimsStats, 
  useGroupOccupancy,
  useFlights,
  usePilgrims
} from '../lib/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Percent, 
  ChevronRight,
  Plane,
  AlertCircle,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

// Color palette for charts
const COLORS = ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

export default function DashboardView() {
  const { data: sales, isLoading: salesLoading, error: salesError } = useSalesStats();
  const { data: pilgrimsStats, isLoading: pilgrimsLoading, error: pilgrimsError } = usePilgrimsStats();
  const { data: occupancy, isLoading: occupancyLoading, error: occupancyError } = useGroupOccupancy();
  const { data: flights } = useFlights();
  const { data: pilgrims } = usePilgrims();

  const loading = salesLoading || pilgrimsLoading || occupancyLoading;
  const error = salesError || pilgrimsError || occupancyError;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Загрузка статистики...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-xl border border-red-200 shadow-sm max-w-xl mx-auto my-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-900 mb-1">Ошибка загрузки данных</h3>
        <p className="text-sm text-red-700 mb-4">Не удалось соединиться с API. Пожалуйста, перезапустите сервер разработки.</p>
      </div>
    );
  }

  // Pre-formatted metrics
  const totalRevenue = sales?.totalRevenue ?? 0;
  const totalPilgrims = pilgrimsStats?.totalPilgrims ?? 0;
  const averageTicketPrice = flights && flights.length > 0 
    ? Math.round(flights.reduce((sum, f) => sum + f.ticketPrice, 0) / flights.length)
    : 0;

  // Pie chart data from monthly pilgrims distribution
  const pieData = pilgrimsStats?.monthlyPilgrims.map((item, index) => ({
    name: item.monthName,
    value: item.count || 1 // fallback to prevent empty slice errors
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-container">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-950 tracking-tight" id="dashboard-title">
          Панель управления Umrah
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Аналитика, распределение авиабилетов и заполняемость групп в реальном времени.
        </p>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-metrics-grid">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          id="metric-revenue"
        >
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Продажи (Общие)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">${totalRevenue.toLocaleString()}</h3>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Поступление средств
            </span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          id="metric-pilgrims"
        >
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Всего Паломников</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalPilgrims} чел.</h3>
            <span className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1">
              <Users className="w-3 h-3" /> Клиенты в базе данных
            </span>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <Users className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          id="metric-occupancy"
        >
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ср. Заполняемость</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {occupancy && occupancy.length > 0
                ? Math.round(occupancy.reduce((sum, item) => sum + item.occupancyPercentage, 0) / occupancy.length)
                : 0}%
            </h3>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <Percent className="w-3 h-3" /> Эффективность групп
            </span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
            <Percent className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          id="metric-flights"
        >
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Авиабилеты (Средняя цена)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">${averageTicketPrice}</h3>
            <span className="text-xs text-purple-600 font-medium flex items-center gap-1 mt-1">
              <Plane className="w-3 h-3" /> {flights?.length || 0} рейсов создано
            </span>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
            <Plane className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-charts-grid">
        {/* Sales Stats Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-950">Выручка по Месяцам ($)</h2>
              <p className="text-[11px] text-slate-400">Доходы от проданных пакетов и перелетов</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 py-1 px-2.5 rounded border border-slate-205">
              <Clock className="w-3.5 h-3.5" /> 2026 год
            </div>
          </div>
          <div className="h-80" id="sales-barchart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sales?.monthlySales || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="monthName" 
                  tickLine={false} 
                  stroke="#94a3b8" 
                  fontSize={11} 
                />
                <YAxis 
                  tickLine={false} 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickFormatter={(tick) => `$${tick}`}
                />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }} 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Выручка']}
                  labelStyle={{ fontWeight: 'bold', color: '#34d399' }}
                />
                <Legend iconSize={8} iconType="circle" />
                <Bar 
                  dataKey="revenue" 
                  name="Доход ($)" 
                  fill="#059669" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pilgrims Distribution Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-950">Паломники по месяцам</h2>
            <p className="text-[11px] text-slate-400">Распределение потока туристов</p>
          </div>

          <div className="h-60 relative flex items-center justify-center" id="pilgrims-piechart-container">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }}
                    formatter={(value) => [`${value} чел.`, 'Поток']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400">Нет данных</p>
            )}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-850">{totalPilgrims}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Паломники</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>Бишкек хаб (Манас)</span>
            <span className="font-bold text-emerald-700">100% активные визы</span>
          </div>
        </div>
      </div>

      {/* Low lists / groups occupancy summary */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" id="occupancy-section">
        <h2 className="text-sm font-semibold text-slate-950">Заполняемость рейсов и групп</h2>
        <p className="text-[11px] text-slate-400 mb-4">Текущая загрузка каждого группового плафона</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {occupancy?.map((group) => {
            const percentage = Math.min(100, Math.round((group.occupiedSeats / group.totalSeats) * 100));
            return (
              <div 
                key={group.groupId} 
                className="bg-slate-50/50 p-3.5 rounded-lg border border-slate-150 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-semibold text-slate-800 text-xs truncate pr-2">{group.groupName}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    percentage >= 100 ? 'bg-red-50 text-red-700 border border-red-100' :
                    percentage >= 80 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {percentage}%
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Занято: <strong>{group.occupiedSeats}</strong> / {group.totalSeats} мест</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 100 ? 'bg-red-500' :
                      percentage >= 80 ? 'bg-amber-505' :
                      'bg-emerald-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
