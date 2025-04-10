"use client";

import {
  ChartBarIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  PlusCircleIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import React from "react";

/* =================== Types & Interfaces =================== */

interface CalendarEvent {
  date: string;
  title: string;
  notes: string;
  time: string;
  invitees: string[];
}

type ModalType =
  | "projets_actifs"
  | "taches_completees"
  | "calendrier"
  | "activite_recente"
  | "taches_en_cours"
  | "reunions_aujourdhui"
  | "messages_non_lus"
  | "projets_termines"
  | "projets_prioritaires"
  | "projets_section"
  | "projet_details"
  | "quick_actions"
  | "team"
  | "member_details"
  | null;

interface Project {
  name: string;
  progress: number;
  deadline: string;
  color: string;
  details: string;
}

interface Task {
  name: string;
  progress: string;
  details: string;
}

interface Meeting {
  title: string;
  time: string;
  details: string;
}

interface Message {
  from: string;
  message: string;
}

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
}

interface QuickAction {
  icon: React.ReactElement;
  label: string;
  color: string;
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

/* Pour les blocs statistiques cliquables */
interface StatBlockProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactElement;
  onClick?: () => void;
}

interface ClickableProps {
  onClick?: () => void;
}

interface ProjectTimelineProps extends ClickableProps {}

interface CalendarWidgetProps extends ClickableProps {}

interface RecentActivityProps extends ClickableProps {}

interface ProjectSectionProps {
  onProjectClick: (project: Project) => void;
  summary?: boolean;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  status: "active" | "inactive";
  email: string;
  phone: string;
  address: string;
  project: string;
  post: string;
}

/* =================== Données de démonstration =================== */

const colors = {
  primary: "#8B5CF6",
  secondary: "#6366F1",
  accent: "#EC4899",
  background: "#F8FAFC",
  text: "#1E293B",
};

const data = [
  { name: "Jan", value: 65, details: "Objectif intermédiaire atteint" },
  { name: "Fév", value: 78, details: "Bonne progression" },
  { name: "Mar", value: 83, details: "Baisse de rythme" },
  { name: "Avr", value: 92, details: "Excellente performance" },
  { name: "Mai", value: 81, details: "Objectif presque atteint" },
];

const projects: Project[] = [
  {
    name: "Migration Cloud",
    progress: 65,
    deadline: "15/09/24",
    color: "#EC4899",
    details: "Mise en place d'une infrastructure cloud.",
  },
  {
    name: "Refonte UI/UX",
    progress: 85,
    deadline: "30/08/24",
    color: "#8B5CF6",
    details: "Modernisation de l'interface utilisateur.",
  },
  {
    name: "Intégration IA",
    progress: 45,
    deadline: "01/10/24",
    color: "#6366F1",
    details: "Implémentation d'algorithmes d'IA.",
  },
];

const completedTasks: Task[] = [
  { name: "Tâche 1", progress: "100%", details: "Détails sur la Tâche 1" },
  { name: "Tâche 2", progress: "100%", details: "Détails sur la Tâche 2" },
];

const ongoingTasks: Task[] = [
  { name: "Tâche A", progress: "50%", details: "Détails sur la Tâche A" },
  { name: "Tâche B", progress: "30%", details: "Détails sur la Tâche B" },
];

const meetingsToday: Meeting[] = [
  {
    title: "Réunion d'équipe",
    time: "10:00",
    details: "Discussion de projet",
  },
  {
    title: "Réunion client",
    time: "14:00",
    details: "Présentation de la maquette",
  },
];

const unreadMessages: Message[] = [
  { from: "Jean", message: "Bonjour, avez-vous vu le rapport ?" },
  { from: "Marie", message: "Mise à jour sur le projet ?" },
];

const finishedProjects: Project[] = [
  {
    name: "Projet Alpha",
    progress: 100,
    deadline: "N/A",
    color: "#8B5CF6",
    details: "Projet terminé avec succès",
  },
  {
    name: "Projet Beta",
    progress: 100,
    deadline: "N/A",
    color: "#6366F1",
    details: "Projet terminé et archivé",
  },
];

const recentActivities: Activity[] = [
  { id: 1, user: "Alice", action: "a créé un nouveau projet", time: "2 min" },
  { id: 2, user: "Bob", action: "a terminé une tâche", time: "10 min" },
  { id: 3, user: "Claire", action: "a commenté", time: "1h" },
];

const quickActions: QuickAction[] = [
  {
    icon: <PlusCircleIcon className="w-6 h-6" />,
    label: "Nouveau Projet",
    color: "bg-purple-100",
  },
  {
    icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
    label: "Idées Créatives",
    color: "bg-green-100",
  },
  {
    icon: <MagnifyingGlassIcon className="w-6 h-6" />,
    label: "Explorer Opportunités",
    color: "bg-yellow-100",
  },
];

const teamMembers: TeamMember[] = [
  {
    name: "Alice Dupont",
    role: "Chef de Projet",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    status: "active",
    email: "alice@example.com",
    phone: "06 01 02 03 04",
    address: "12 rue de Paris, 75001 Paris",
    project: "Migration Cloud",
    post: "Admin",
  },
  {
    name: "Bob Martin",
    role: "Développeur",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "active",
    email: "bob@example.com",
    phone: "06 05 06 07 08",
    address: "34 avenue de Lyon, 69000 Lyon",
    project: "Intégration IA",
    post: "User",
  },
  {
    name: "Claire Legrand",
    role: "Designer",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "inactive",
    email: "claire@example.com",
    phone: "06 09 10 11 12",
    address: "56 boulevard de Nice, 06000 Nice",
    project: "Refonte UI/UX",
    post: "Manager",
  },
];

/* =================== Composants =================== */

// Composant Modal générique (affiche en recouvrant entièrement l’écran, sans navbar)
const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl p-8 z-10 max-w-5xl w-full relative"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
        <button onClick={onClose} className="text-slate-800 dark:text-white">
          Fermer
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

// Composant StatBlock cliquable
const StatBlock: React.FC<StatBlockProps> = ({
  title,
  value,
  change,
  icon,
  onClick,
}) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    className="cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-100 hover:border-purple-100 transition-all dark:bg-gray-800 dark:border-gray-700 dark:hover:border-purple-300"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-purple-500/10">
        {React.cloneElement(icon, { className: "w-8 h-8 text-purple-600" })}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-white mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600">
          <ArrowTrendingUpIcon className="w-4 h-4" />
          <span>{change}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Composant ProjectTimeline (Projets prioritaires)
const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ onClick }) => (
  <motion.div
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-100 dark:bg-gray-800 dark:border-gray-700"
  >
    <h3 className="text-xl font-semibold text-slate-800 dark:text-gray-100 mb-6 flex items-center gap-3">
      <BriefcaseIcon className="w-7 h-7 text-purple-600" />
      Projets prioritaires
    </h3>
    <div className="space-y-8">
      {projects.map((project) => (
        <div key={project.name} className="space-y-3">
          <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-gray-300">
            <span>{project.name}</span>
            <span className="text-slate-500">{project.deadline}</span>
          </div>
          <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full absolute"
              style={{
                background: `linear-gradient(90deg, ${project.color} 0%, ${colors.secondary} 100%)`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// Composant CalendarWidget avec design amélioré
const CalendarWidget: React.FC<CalendarWidgetProps> = ({ onClick }) => {
  const today = new Date();
  const defaultDay = today.getDate();
  const defaultMonth = today.getMonth() + 1;
  const defaultYear = today.getFullYear();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [defaultYear - 1, defaultYear, defaultYear + 1];
  const [selectedDay, setSelectedDay] = useState<number>(defaultDay);
  const [selectedMonth, setSelectedMonth] = useState<number>(defaultMonth);
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-100 dark:bg-gray-800 dark:border-gray-700"
    >
      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
        <CalendarIcon className="w-7 h-7 text-purple-600" />
        Calendrier
      </h3>
      <div className="flex gap-2 mb-4">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(parseInt(e.target.value))}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
          <div key={day} className="text-center text-sm text-slate-500 dark:text-white p-2">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDay(day);
            }}
            className={`cursor-pointer text-center p-2 text-sm rounded ${
              selectedDay === day
                ? "bg-purple-600 text-white"
                : "bg-slate-100 dark:bg-gray-600 text-slate-600 dark:text-white hover:bg-purple-50"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Composant RecentActivity
const RecentActivity: React.FC<RecentActivityProps> = ({ onClick }) => (
  <motion.div
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl  shadow-xl border border-slate-100 dark:bg-gray-800 dark:border-gray-700"
  >
    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
      <ClockIcon className="w-7 h-7 text-purple-600 " />
      Activité Récente
    </h3>
    <div className="space-y-4 ">
      {recentActivities.map((activity) => (
        <motion.div
          key={activity.id}
          className="flex items-start  gap-4 p-4 bg-purple-50/50 rounded-lg dark:bg-slate-700"
          whileHover={{ x: 5 }}
        >
          <div className="w-2 h-2 bg-purple-600  rounded-full mt-2" />
          <div className="flex-1">
            <p className="text-sm text-slate-800  dark:text-white">
              <span className="font-medium">{activity.user}</span> {activity.action}
            </p>
            <p className="text-xs text-slate-500 dark:text-white mt-1">
              {activity.time}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Composant ProjectSection (affiche tous les projets)
const ProjectSection: React.FC<ProjectSectionProps> = ({
  onProjectClick,
  summary = false,
}) => {
  const list = summary ? projects.slice(0, 2) : projects;
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-100 dark:bg-gray-800 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
        <UsersIcon className="w-7 h-7 text-purple-600" />
        Projets
      </h3>
      <div className="space-y-4">
        {list.map((project, index) => (
          <motion.div
            key={project.name}
            onClick={() => onProjectClick(project)}
            className="cursor-pointer flex items-center gap-4 p-3 hover:bg-purple-50/50 rounded-lg transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="p-2 rounded-full" style={{ background: project.color }}>
              <BriefcaseIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-white">{project.name}</p>
              <p className="text-sm text-slate-600 dark:text-white">
                Deadline: {project.deadline}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Composant TeamMembers (affiche la liste des membres)
const TeamMembers: React.FC<{ onMemberClick: (member: TeamMember) => void }> = ({
  onMemberClick,
}) => (
  <motion.div
    className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-100 dark:bg-gray-800 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
      <UsersIcon className="w-7 h-7 text-purple-600" />
      Équipe
    </h3>
    <div className="space-y-4">
      {teamMembers.map((member, index) => (
        <motion.div
          key={member.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 p-3 hover:bg-purple-50/50 rounded-lg transition-colors cursor-pointer"
          onClick={() => onMemberClick(member)}
        >
          <img
            src={member.avatar}
            alt={member.name}
            className="w-12 h-12 rounded-full border-2 border-purple-100"
          />
          <div className="flex-1">
            <p className="font-medium text-slate-800 dark:text-white">{member.name}</p>
            <p className="text-sm text-slate-600 dark:text-white">{member.role}</p>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              member.status === "active" ? "bg-emerald-500" : "bg-slate-300"
            }`}
          />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Composant MemberDetails (affiche les détails d'un membre)
const MemberDetails: React.FC<{ member: TeamMember; onClose: () => void }> = ({
  member,
  onClose,
}) => (
  <Modal title={member.name} onClose={onClose}>
    <div className="space-y-2">
      <p className="text-sm text-slate-800 dark:text-white">
        <strong>Rôle :</strong> {member.role}
      </p>
      <p className="text-sm text-slate-800 dark:text-white">
        <strong>Email :</strong> {member.email}
      </p>
      <p className="text-sm text-slate-800 dark:text-white">
        <strong>Téléphone :</strong> {member.phone}
      </p>
      <p className="text-sm text-slate-800 dark:text-white">
        <strong>Adresse :</strong> {member.address}
      </p>
      <p className="text-sm text-slate-800 dark:text-white">
        <strong>Projet :</strong> {member.project}
      </p>
      <p className="text-sm text-slate-800 dark:text-white">
        <strong>Poste :</strong> {member.post}
      </p>
    </div>
  </Modal>
);

/* =================== Composant Principal =================== */

export default function GlobalDashboard() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedModal, setSelectedModal] = useState<ModalType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState<CalendarEvent>({
    date: new Date().toLocaleDateString(),
    title: "",
    notes: "",
    time: new Date().toLocaleTimeString(),
    invitees: [],
  });
  const [selectedInvitees, setSelectedInvitees] = useState<string[]>([]);
  const [iaDescription, setIaDescription] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Fonction pour ajouter un événement dans le calendrier
  const addCalendarEvent = () => {
    if (newEvent.date && newEvent.title) {
      selectedInvitees.forEach((email) => {
        console.log(`Envoi d'un email à ${email} pour l'événement "${newEvent.title}"`);
      });
      setCalendarEvents([...calendarEvents, { ...newEvent, invitees: selectedInvitees }]);
      setNewEvent({
        date: new Date().toLocaleDateString(),
        title: "",
        notes: "",
        time: new Date().toLocaleTimeString(),
        invitees: [],
      });
      setSelectedInvitees([]);
      setIaDescription("");
    }
  };

  // Fonction simulant l'appel à l'IA pour générer une description détaillée
  const generateIaDescription = () => {
    const description = `Description détaillée générée automatiquement pour l'événement "${newEvent.title}" prévu le ${newEvent.date} à ${newEvent.time}.`;
    setIaDescription(description);
    setNewEvent({ ...newEvent, notes: description });
  };

  const today = new Date();

  return (
    <section className="p-8 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* La navbar s'affiche uniquement si aucune modale n'est ouverte */}
      {!selectedModal && (
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="p-4 rounded-2xl bg-purple-600/10">
              <ChartBarIcon className="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Tableau de Bord Exécutif
              </h1>
              <p className="text-slate-600 dark:text-white mt-2">
                Vue d'ensemble des performances
              </p>
            </div>
          </motion.div>
        </header>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatBlock
              title="Projets Actifs"
              value="24"
              change="+5%"
              icon={<BriefcaseIcon />}
              onClick={() => setSelectedModal("projets_actifs")}
            />
            <StatBlock
              title="Tâches Complétées"
              value="128"
              change="+18%"
              icon={<ClipboardDocumentCheckIcon />}
              onClick={() => setSelectedModal("taches_completees")}
            />
            <StatBlock
              title="Projets"
              value={projects.length.toString()}
              change="+2"
              icon={<UsersIcon />}
              onClick={() => setSelectedModal("projets_section")}
            />
          </div>

          <motion.div
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-100 dark:bg-gray-800 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <ArrowTrendingUpIcon className="w-7 h-7 text-purple-600" />
              Progression globale
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 " />
                  <XAxis dataKey="name" stroke={colors.text} />
                  <YAxis stroke={colors.text} />
                  <Tooltip
                    contentStyle={{
                      background: colors.background,
                      border: `1px solid ${colors.primary}20`,
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={colors.primary}
                    strokeWidth={2}
                    dot={{ fill: colors.primary, strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RecentActivity onClick={() => setSelectedModal("activite_recente")} />
            <CalendarWidget onClick={() => setSelectedModal("calendrier")} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="cursor-pointer" onClick={() => setSelectedModal("projets_prioritaires")}>
            <ProjectTimeline onClick={() => setSelectedModal("projets_prioritaires")} />
          </div>
          <div className="cursor-pointer" onClick={() => setSelectedModal("team")}>
            <TeamMembers
              onMemberClick={(member) => {
                setSelectedMember(member);
                setSelectedModal("member_details");
              }}
            />
          </div>
          <div className="cursor-pointer" onClick={() => setSelectedModal("quick_actions")}>
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-100 dark:bg-gray-800 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
                <ArrowTrendingUpIcon className="w-7 h-7 text-purple-600" />
                Actions Rapides
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-4 p-4 rounded-xl ${action.color} hover:bg-opacity-80 transition-all`}
                  >
                    <span className="text-purple-600">{action.icon}</span>
                    <span className="font-medium text-slate-800 dark:text-black">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBlock
          title="Tâches en cours"
          value="18"
          change="+3"
          icon={<ClipboardDocumentCheckIcon />}
          onClick={() => setSelectedModal("taches_en_cours")}
        />
        <StatBlock
          title="Réunions aujourd'hui"
          value="2"
          change="-1"
          icon={<CalendarIcon />}
          onClick={() => setSelectedModal("reunions_aujourdhui")}
        />
        <StatBlock
          title="Messages non lus"
          value="5"
          change="+2"
          icon={<BellIcon />}
          onClick={() => setSelectedModal("messages_non_lus")}
        />
        <StatBlock
          title="Projets terminés"
          value="9"
          change="+4"
          icon={<BriefcaseIcon />}
          onClick={() => setSelectedModal("projets_termines")}
        />
      </div>

      {selectedModal === "projets_actifs" && (
        <Modal title="Détails des Projets Actifs" onClose={() => setSelectedModal(null)}>
          {projects.map((project) => (
            <div key={project.name} className="mb-4 border-b pb-2">
              <h4 className="font-bold text-slate-800 dark:text-white">
                {project.name} - {project.progress}%
              </h4>
              <p className="text-sm text-slate-600 dark:text-white">
                Deadline: {project.deadline}
              </p>
              <p className="text-xs text-slate-500 dark:text-white">
                {project.details}
              </p>
            </div>
          ))}
        </Modal>
      )}

      {selectedModal === "taches_completees" && (
        <Modal title="Tâches Complétées" onClose={() => setSelectedModal(null)}>
          {completedTasks.map((task) => (
            <div key={task.name} className="mb-4 border-b pb-2">
              <h4 className="font-bold text-slate-800 dark:text-white">
                {task.name} - {task.progress}
              </h4>
              <p className="text-xs text-slate-500 dark:text-white">
                {task.details}
              </p>
            </div>
          ))}
        </Modal>
      )}

      {selectedModal === "taches_en_cours" && (
        <Modal title="Tâches en cours" onClose={() => setSelectedModal(null)}>
          {ongoingTasks.map((task) => (
            <div key={task.name} className="mb-4 border-b pb-2">
              <h4 className="font-bold text-slate-800 dark:text-white">
                {task.name} - {task.progress}
              </h4>
              <p className="text-xs text-slate-500 dark:text-white">
                {task.details}
              </p>
            </div>
          ))}
        </Modal>
      )}

      {selectedModal === "reunions_aujourdhui" && (
        <Modal title="Réunions d'aujourd'hui" onClose={() => setSelectedModal(null)}>
          {meetingsToday.map((meeting, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <h4 className="font-bold text-slate-800 dark:text-white">
                {meeting.title} à {meeting.time}
              </h4>
              <p className="text-xs text-slate-500 dark:text-white">
                {meeting.details}
              </p>
            </div>
          ))}
        </Modal>
      )}

      {selectedModal === "messages_non_lus" && (
        <Modal title="Messages non lus" onClose={() => setSelectedModal(null)}>
          {unreadMessages.map((msg, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <p className="text-sm text-slate-800 dark:text-white">
                <strong>{msg.from} :</strong> {msg.message}
              </p>
            </div>
          ))}
        </Modal>
      )}

      {selectedModal === "projets_termines" && (
        <Modal title="Projets terminés" onClose={() => setSelectedModal(null)}>
          {finishedProjects.map((project) => (
            <div key={project.name} className="mb-4 border-b pb-2">
              <h4 className="font-bold text-slate-800 dark:text-white">
                {project.name} - {project.progress}%
              </h4>
              <p className="text-xs text-slate-500 dark:text-white">
                {project.details}
              </p>
            </div>
          ))}
        </Modal>
      )}

      {selectedModal === "projets_prioritaires" && (
        <Modal title="Projets Prioritaires" onClose={() => setSelectedModal(null)}>
          {projects
            .filter((p) => p.progress >= 80)
            .map((project) => (
              <div key={project.name} className="mb-4 border-b pb-2">
                <h4 className="font-bold text-slate-800 dark:text-gray-900">
                  {project.name} - {project.progress}%
                </h4>
                <p className="text-sm text-slate-600 dark:text-gray-700">
                  Deadline: {project.deadline}
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-600">
                  {project.details}
                </p>
              </div>
            ))}
        </Modal>
      )}

      {selectedModal === "calendrier" && (
        <Modal title="Calendrier détaillé" onClose={() => setSelectedModal(null)}>
          <div className="mb-4">
            <p className="text-sm text-slate-800 dark:text-white mb-2">
              Sélectionnez un jour pour l'événement.
            </p>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className="cursor-pointer text-center p-2 text-sm bg-slate-100 dark:bg-gray-600 text-slate-600 dark:text-white rounded hover:bg-purple-100"
                  onClick={() =>
                    setNewEvent({
                      ...newEvent,
                      date: `${day}/${today.getMonth() + 1}/${today.getFullYear()}`,
                    })
                  }
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Date (jj/mm/aaaa)"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
              />
              <input
                type="text"
                placeholder="Heure (HH:MM)"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
              />
              <input
                type="text"
                placeholder="Titre de l'événement"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
              />
              <textarea
                placeholder="Notes"
                value={newEvent.notes}
                onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={generateIaDescription}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  IA
                </button>
                <select
                  multiple
                  value={selectedInvitees}
                  onChange={(e) => {
                    const options = Array.from(e.target.selectedOptions, (option) => option.value);
                    setSelectedInvitees(options);
                  }}
                  className="p-2 border rounded dark:bg-gray-600 dark:text-white"
                >
                  {teamMembers.map((member) => (
                    <option key={member.email} value={member.email}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={addCalendarEvent} className="px-4 py-2 bg-purple-600 text-white rounded">
                Ajouter l'événement
              </button>
            </div>
          </div>
          {calendarEvents.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-2">Événements ajoutés :</h4>
              {calendarEvents.map((event, idx) => (
                <div key={idx} className="mb-2 border-b pb-1">
                  <p className="text-sm text-slate-800 dark:text-white">
                    {event.date} - {event.title} ({event.time})
                  </p>
                  <p className="text-xs text-slate-500 dark:text-white">{event.notes}</p>
                  {event.invitees.length > 0 && (
                    <p className="text-xs text-slate-500 dark:text-white">
                      Invités: {event.invitees.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {selectedModal === "activite_recente" && (
        <Modal title="Activité Récente" onClose={() => setSelectedModal(null)}>
          {recentActivities.map((activity) => (
            <div key={activity.id} className="mb-4 border-b pb-2">
              <p className="text-sm text-slate-800 dark:text-white">
                <strong>{activity.user}</strong> {activity.action}
              </p>
              <p className="text-xs text-slate-500 dark:text-white">{activity.time}</p>
            </div>
          ))}
        </Modal>
      )}

      {selectedModal === "projets_section" && (
        <Modal title="Tous les Projets" onClose={() => setSelectedModal(null)}>
          <ProjectSection
            onProjectClick={(project) => {
              setSelectedProject(project);
              setSelectedModal("projet_details");
            }}
            summary={false}
          />
        </Modal>
      )}

      {selectedModal === "projet_details" && selectedProject && (
        <Modal
          title={selectedProject.name}
          onClose={() => {
            setSelectedProject(null);
            setSelectedModal("projets_section");
          }}
        >
          <div className="mb-4">
            <p className="text-sm text-slate-800 dark:text-white">
              Pourcentage d'avancement : {selectedProject.progress}%
            </p>
            <p className="text-xs text-slate-500 dark:text-white">
              Deadline : {selectedProject.deadline}
            </p>
            <p className="mt-2 text-sm text-slate-800 dark:text-white">
              {selectedProject.details}
            </p>
          </div>
        </Modal>
      )}

      {selectedModal === "quick_actions" && (
        <Modal title="Actions Rapides" onClose={() => setSelectedModal(null)}>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 p-4 rounded-xl ${action.color} hover:bg-opacity-80 transition-all`}
              >
                <span className="text-purple-600">{action.icon}</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </Modal>
      )}

      {selectedModal === "team" && (
        <Modal title="Équipe" onClose={() => setSelectedModal(null)}>
          <TeamMembers
            onMemberClick={(member) => {
              setSelectedMember(member);
              setSelectedModal("member_details");
            }}
          />
        </Modal>
      )}

      {selectedModal === "member_details" && selectedMember && (
        <MemberDetails
          member={selectedMember}
          onClose={() => {
            setSelectedMember(null);
            setSelectedModal("team");
          }}
        />
      )}
    </section>
  );
}
