"use client";

import { useState, useMemo } from 'react';
import { 
  ArchiveBoxIcon,
  CloudArrowUpIcon, 
  ClockIcon, 
  ServerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';

// Couleurs personnalisées
const primaryColor = '#b03ff3'; // Mauve principal
const accentColors = {
  blue: '#6366f1',
  purple: '#8b5cf6',
  pink: '#ec4899',
  teal: '#14b8a6'
};

type Backup = {
  id: number;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
  size: string;
  type: 'auto' | 'manual';
};

const mockBackups: Backup[] = [
  { id: 1, timestamp: new Date('2024-03-20T00:30'), status: 'success', size: '2.4 GB', type: 'auto' },
  { id: 2, timestamp: new Date('2024-03-19T00:30'), status: 'error', size: 'N/A', type: 'auto' },
  { id: 3, timestamp: new Date('2024-03-18T12:15'), status: 'success', size: '1.8 GB', type: 'manual' },
];

const backupGraphData = [
  { day: 'Lun', backups: 2 },
  { day: 'Mar', backups: 4 },
  { day: 'Mer', backups: 3 },
  { day: 'Jeu', backups: 5 },
  { day: 'Ven', backups: 2 },
  { day: 'Sam', backups: 1 },
  { day: 'Dim', backups: 0 },
];

export default function Sauvegarde() {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [filter, setFilter] = useState<'all' | 'auto' | 'manual'>('all');
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const filteredBackups = useMemo(() => {
    return mockBackups.filter(backup => 
      filter === 'all' ? true : backup.type === filter
    );
  }, [filter]);

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCreatingBackup(false);
  };

  const getStatusConfig = (status: Backup['status']) => {
    const config = {
      success: {
        icon: CheckCircleIcon,
        color: 'text-green-400',
        bg: 'bg-green-100/50',
        label: 'Succès'
      },
      error: {
        icon: ExclamationTriangleIcon,
        color: 'text-rose-400',
        bg: 'bg-rose-100/50',
        label: 'Erreur'
      },
      pending: {
        icon: ArrowPathIcon,
        color: 'text-amber-400',
        bg: 'bg-amber-100/50',
        label: 'En cours'
      }
    };
    return config[status];
  };

  return (
    <section className="p-6 bg-white dark:bg-slate-900 rounded-2xl space-y-8">
      {/* En-tête avec animation fluide */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: -15, scale: 1.1 }}
            className="p-3 bg-white/10 rounded-xl backdrop-blur-sm"
          >
            <CloudArrowUpIcon className="w-12 h-12 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Sauvegarde Intelligente
            </h1>
            <p className="text-white/90 font-light max-w-2xl">
              Protection automatique de vos données avec chiffrement AES-256.
              <span className="block mt-1 text-sm opacity-75">Dernière synchronisation: 20 mars 2024 14:30</span>
            </p>
          </div>
        </div>
      </motion.header>

      {/* Cartes de statistiques avec effet de profondeur */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: ArchiveBoxIcon, title: "Espace utilisé", value: "15.2 GB", subtitle: "64% de 24 GB", color: accentColors.purple },
          { icon: ClockIcon, title: "Intervalle", value: "24 heures", color: accentColors.blue },
          { icon: ServerIcon, title: "Prochaine sauvegarde", value: "03h15", subtitle: "Estimation", color: accentColors.teal }
        ].map((card, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-4">
              <div 
                className="p-3 rounded-lg" 
                style={{ backgroundColor: `${card.color}20` }}
              >
                <card.icon className="w-8 h-8" style={{ color: card.color }} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">{card.title}</h3>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{card.value}</p>
                {card.subtitle && <p className="text-sm text-slate-400">{card.subtitle}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contrôles principaux */}
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer-checked:bg-purple-500 transition-colors">
                <div className="absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform peer-checked:translate-x-6 transition-all" />
              </div>
              <span className="ml-3 text-slate-700 dark:text-slate-300">
                Sauvegarde automatique
              </span>
            </label>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <motion.select
              whileHover={{ scale: 1.05 }}
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik03LjQxIDguNTlMMTIgMTMuMTdsNC41OS00LjU4TDE4IDlsLTYgNi02LTYgMS40MS0xLjQxeiIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_1rem_center]"
            >
              <option value="all">Toutes les sauvegardes</option>
              <option value="auto">Automatiques</option>
              <option value="manual">Manuelles</option>
            </motion.select>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl disabled:opacity-50 transition-all relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ArrowPathIcon className={`w-5 h-5 ${isCreatingBackup ? 'animate-spin' : ''}`} />
                {isCreatingBackup ? 'Création...' : 'Nouvelle sauvegarde'}
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity" />
            </motion.button>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700" />

        {/* Historique avec animations entrantes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3">
            <ChartBarIcon className="w-6 h-6 text-purple-400" />
            Historique des sauvegardes
          </h3>
          
          <div className="grid gap-3">
            {filteredBackups.map((backup, index) => {
              const { icon: Icon, color, bg, label } = getStatusConfig(backup.status);
              
              return (
                <motion.div 
                  key={backup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${bg} transition-colors`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {new Intl.DateTimeFormat('fr-FR', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      }).format(backup.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
                      {backup.type === 'auto' ? 'Automatique' : 'Manuelle'}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
                  </div>

                  <div className="text-right font-medium text-slate-800 dark:text-slate-300">
                    {backup.size}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Graphique interactif */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <SparklesIcon className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Activité des sauvegardes
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={backupGraphData}>
            <XAxis 
              dataKey="day" 
              stroke="#94a3b8" 
              tick={{ fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                background: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: primaryColor }}
            />
            <Line 
              type="monotone" 
              dataKey="backups" 
              stroke={primaryColor}
              strokeWidth={3}
              dot={{ fill: primaryColor, r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </section>
  );
}