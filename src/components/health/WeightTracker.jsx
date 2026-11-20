import React, { useState, useMemo } from 'react';
import { usePets } from '../../contexts/PetContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, Plus, Scale, Trash2, Edit2, Check, X } from 'lucide-react';
import { classNames } from '../../utils/helpers';

export default function WeightTracker() {
  const { activePet, activePetId, addWeightEntry, deleteWeightEntry } = usePets();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editWeightVal, setEditWeightVal] = useState('');

  const rawHistory = activePet?.weightHistory || [];

  // Filter out any NaN or invalid weights and sort chronologically
  const history = useMemo(() => {
    return rawHistory
      .filter(entry => entry && !isNaN(parseFloat(entry.weight)) && parseFloat(entry.weight) > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [rawHistory]);

  const chartData = useMemo(() => {
    return history.map(entry => {
      let label = entry.date;
      try {
        label = format(new Date(entry.date), 'MMM d');
      } catch {}
      return {
        ...entry,
        weight: parseFloat(entry.weight),
        displayDate: label
      };
    });
  }, [history]);

  const handleAddWeight = (e) => {
    e.preventDefault();
    const parsed = parseFloat(weight);
    if (!parsed || isNaN(parsed) || !date) return;
    
    addWeightEntry(activePetId, parsed, date);
    setWeight('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleStartEdit = (entry) => {
    setEditingId(entry.id || entry.date);
    setEditWeightVal(String(entry.weight));
  };

  const handleSaveEdit = (entry) => {
    const val = parseFloat(editWeightVal);
    if (!isNaN(val) && val > 0) {
      addWeightEntry(activePetId, val, entry.date);
    }
    setEditingId(null);
  };

  const handleDelete = (entry) => {
    deleteWeightEntry(activePetId, entry.id || entry.date);
  };

  const trend = useMemo(() => {
    if (history.length < 2) return null;
    const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = sorted[0].weight;
    const previous = sorted[1].weight;
    const diff = latest - previous;
    if (previous === 0) return { type: 'up', percent: '100', icon: TrendingUp, color: 'text-brand-500' };
    const percent = ((Math.abs(diff) / previous) * 100).toFixed(1);
    
    if (diff > 0) return { type: 'up', percent, icon: TrendingUp, color: 'text-brand-500', label: `+${diff.toFixed(1)} kg` };
    if (diff < 0) return { type: 'down', percent, icon: TrendingDown, color: 'text-emerald-500', label: `${diff.toFixed(1)} kg` };
    return { type: 'stable', percent: '0', icon: Minus, color: 'text-[var(--color-text-secondary)]', label: 'Stable' };
  }, [history]);

  const currentWeight = history.length > 0 ? history[history.length - 1].weight : (activePet?.weight || null);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header and Add Form */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 p-6 glass-card rounded-3xl border border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center">
              <Scale size={20} />
            </div>
            <h3 className="text-xl font-display font-bold text-[var(--color-text)]">
              Weight & Growth Tracker ⚖️
            </h3>
          </div>

          {currentWeight !== null && (
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl font-display font-extrabold text-[var(--color-text)]">
                {currentWeight} <span className="text-base text-[var(--color-text-secondary)] font-medium">kg</span>
              </span>
              {trend && (
                <span className={`inline-flex items-center gap-1 text-xs font-bold ${trend.color} bg-brand-50/50 dark:bg-brand-900/20 px-2.5 py-1 rounded-full border border-brand-200 dark:border-brand-800`}>
                  <trend.icon className="w-3.5 h-3.5" />
                  <span>{trend.label} ({trend.percent}%)</span>
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Add Entry Form */}
        <form onSubmit={handleAddWeight} className="flex flex-wrap items-end gap-2.5 bg-[var(--color-bg)] p-3 rounded-2xl border border-[var(--color-border)]">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
              Date
            </label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="input-field py-1.5 px-3 text-xs sm:text-sm" 
              required 
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
              Weight (kg)
            </label>
            <input 
              type="number" 
              step="0.1" 
              min="0.1"
              value={weight} 
              onChange={e => setWeight(e.target.value)} 
              className="input-field py-1.5 px-3 text-xs sm:text-sm w-28" 
              placeholder="e.g. 24.5" 
              required 
            />
          </div>
          <button type="submit" className="btn-primary py-2 px-4 rounded-xl flex items-center gap-1.5 text-xs font-bold">
            <Plus className="w-4 h-4" /> 
            <span>Log Weight</span>
          </button>
        </form>
      </div>

      {/* Chart Section */}
      {chartData.length > 0 ? (
        <div className="h-72 w-full bg-[var(--color-surface)] rounded-3xl p-5 border border-[var(--color-border)] shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} vertical={false} />
              <XAxis 
                dataKey="displayDate" 
                stroke="var(--color-text-secondary)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']} 
                stroke="var(--color-text-secondary)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                unit="kg" 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-surface)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => [`${value} kg`, 'Weight']}
                labelStyle={{ fontWeight: 'bold', color: 'var(--color-text)' }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#ee7d14" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#ee7d14', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 7 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-12 glass-card rounded-3xl border border-[var(--color-border)] border-dashed">
          <Scale className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-3 opacity-40" />
          <h4 className="font-bold text-[var(--color-text)] mb-1">No weight logs yet</h4>
          <p className="text-xs text-[var(--color-text-secondary)]">Enter a weight and date above to begin charting growth.</p>
        </div>
      )}

      {/* Weight History Table with Edit & Delete */}
      <div className="glass-card p-6 rounded-3xl border border-[var(--color-border)] shadow-sm">
        <h4 className="text-base font-display font-bold text-[var(--color-text)] mb-4">
          Weight History Log 📋
        </h4>

        {history.length === 0 ? (
          <p className="text-xs text-[var(--color-text-secondary)]">No weight entries recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Weight (kg)</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/50">
                {[...history].reverse().map((entry, idx) => {
                  const isEditing = editingId === (entry.id || entry.date);

                  return (
                    <tr key={entry.id || idx} className="hover:bg-brand-50/20 dark:hover:bg-brand-900/10">
                      <td className="py-3 font-medium text-[var(--color-text)]">
                        {entry.date}
                      </td>
                      <td className="py-3">
                        {isEditing ? (
                          <input 
                            type="number" 
                            step="0.1" 
                            className="input-field py-1 px-2 text-xs w-24"
                            value={editWeightVal}
                            onChange={e => setEditWeightVal(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <span className="font-bold text-[var(--color-text)]">{entry.weight} kg</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(entry)}
                              className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-lg"
                              title="Save"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(entry)}
                              className="p-1.5 hover:bg-brand-100 dark:hover:bg-brand-900/30 text-brand-600 rounded-lg transition-colors"
                              title="Edit weight"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(entry)}
                              className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 rounded-lg transition-colors"
                              title="Delete entry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
