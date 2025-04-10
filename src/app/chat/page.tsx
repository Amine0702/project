"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import {
  PaperPlaneRight,
  MagicWand,
  Paperclip,
  Trash,
  CaretLeft,
  List,
  ArrowFatLinesLeft
} from 'phosphor-react';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

type Category = 'inbox' | 'drafts' | 'sent' | 'trash';
type Priority = 'high' | 'normal' | 'low';

interface Email {
  id: string;
  subject: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  attachments?: File[];
  aiGenerated?: boolean;
  read: boolean;
  thread: Message[];
  folder: Category;
  deletedAt?: number;
  priority: Priority;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

const MailPage = () => {
  // États principaux
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [newEmail, setNewEmail] = useState<Partial<Email>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [view, setView] = useState<'inbox' | 'compose'>('inbox');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'dateAsc' | 'dateDesc' | 'priority'>('dateDesc');

  // Liste des utilisateurs/destinataires
  const [users] = useState<User[]>([
    { id: '1', name: 'Alice Dupont', avatar: 'https://via.placeholder.com/40/FF0000/FFFFFF?text=A', email: 'alice@example.com' },
    { id: '2', name: 'Bob Martin', avatar: 'https://via.placeholder.com/40/00FF00/FFFFFF?text=B', email: 'bob@example.com' },
    { id: '3', name: 'Charlie Tech', avatar: 'https://via.placeholder.com/40/0000FF/FFFFFF?text=C', email: 'charlie@example.com' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Gestion des pièces jointes
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  // Effacement automatique des emails dans "trash" depuis plus de 15 jours
  useEffect(() => {
    const interval = setInterval(() => {
      setEmails(prev =>
        prev.filter(email => {
          if (email.folder === 'trash' && email.deletedAt) {
            return Date.now() - email.deletedAt < 15 * 24 * 3600 * 1000;
          }
          return true;
        })
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Chargement initial simulé
  useEffect(() => {
    const mockEmails: Email[] = [
      {
        id: '1',
        subject: 'Réunion de projet',
        sender: 'alice@example.com',
        recipient: 'moi@example.com',
        content: 'Bonjour, merci de confirmer votre présence...',
        timestamp: new Date().toLocaleString(),
        read: false,
        aiGenerated: false,
        folder: 'inbox',
        priority: 'high',
        thread: [
          {
            id: '1-1',
            content: 'Je suis disponible jeudi',
            sender: 'moi@example.com',
            timestamp: new Date().toLocaleString()
          },
          {
            id: '1-2',
            content: 'Parfait, à jeudi 10h',
            sender: 'alice@example.com',
            timestamp: new Date().toLocaleString()
          }
        ]
      },
    ];
    setEmails(mockEmails);
  }, []);

  // Simulation de génération de contenu par IA
  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    const aiResponse = await new Promise<string>(resolve =>
      setTimeout(() =>
        resolve(`Bonjour,\n\nSuite à votre demande "${aiPrompt}", voici un message professionnel généré automatiquement.\n\nCordialement,\n[Votre nom]`),
      1000)
    );
    
    setNewEmail(prev => ({
      ...prev,
      content: aiResponse,
      aiGenerated: true
    }));
    setShowAIPrompt(false);
    setAiPrompt('');
    textareaRef.current?.focus();
  };

  // Envoi d'un email
  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const email: Email = {
      id: Date.now().toString(),
      subject: newEmail.subject || '(Sans objet)',
      sender: 'moi@example.com',
      recipient: newEmail.recipient || '',
      content: newEmail.content || '',
      timestamp: new Date().toLocaleString(),
      attachments,
      read: false,
      aiGenerated: newEmail.aiGenerated || false,
      folder: 'sent',
      priority: newEmail.priority as Priority || 'normal',
      thread: []
    };

    setEmails(prev => [email, ...prev]);
    setNewEmail({});
    setAttachments([]);
    setView('inbox');
    setSelectedCategory('sent');
  };

  // Sauvegarde d'un brouillon
  const handleSaveDraft = () => {
    const draft: Email = {
      id: Date.now().toString(),
      subject: newEmail.subject || '(Sans objet)',
      sender: 'moi@example.com',
      recipient: newEmail.recipient || '',
      content: newEmail.content || '',
      timestamp: new Date().toLocaleString(),
      attachments,
      read: false,
      aiGenerated: newEmail.aiGenerated || false,
      folder: 'drafts',
      priority: newEmail.priority as Priority || 'normal',
      thread: []
    };

    setEmails(prev => [draft, ...prev]);
    setNewEmail({});
    setAttachments([]);
    setView('inbox');
    setSelectedCategory('drafts');
  };

  // Suppression d'un email (déplacement dans la corbeille)
  const handleDeleteEmail = (emailId: string) => {
    setEmails(prev =>
      prev.map(email => {
        if (email.id === emailId) {
          return { ...email, folder: 'trash', deletedAt: Date.now() };
        }
        return email;
      })
    );
    setSelectedEmail(null);
  };

  // Filtrage des emails par dossier, recherche et tri
  const filteredEmails = emails.filter(email => {
    if (email.folder !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        email.subject.toLowerCase().includes(query) ||
        email.content.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Application du tri
  const displayedEmails = filteredEmails.sort((a, b) => {
    if (sortOption === 'dateAsc') {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else if (sortOption === 'dateDesc') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sortOption === 'priority') {
      const prioOrder: Record<Priority, number> = { high: 3, normal: 2, low: 1 };
      return prioOrder[b.priority] - prioOrder[a.priority];
    }
    return 0;
  });

  // Actions pour Répondre et Transférer
  const handleReply = () => {
    if (!selectedEmail) return;
    setView('compose');
    setNewEmail({
      recipient: selectedEmail.sender,
      subject: `Re: ${selectedEmail.subject}`,
      content: `\n\n----- Réponse à -----\n${selectedEmail.content}`
    });
  };

  const handleForward = () => {
    if (!selectedEmail) return;
    setView('compose');
    setNewEmail({
      recipient: '',
      subject: `Fwd: ${selectedEmail.subject}`,
      content: `\n\n----- Message original -----\n${selectedEmail.content}`
    });
  };

  // Fonction utilitaire pour afficher la couleur correspondant à la priorité
  const getPriorityColor = (priority: Priority) => {
    if (priority === 'high') return 'bg-red-500';
    if (priority === 'normal') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar pliable */}
      <div
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="p-4 space-y-4">
          <button
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <List size={24} className="text-gray-600 dark:text-gray-300" />
            {sidebarOpen && <span className="text-gray-600 dark:text-white"></span>}
          </button>

          <button
            className="w-full bg-blue-600 text-white rounded-lg p-3 font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
            onClick={() => {
              setView('compose');
              setNewEmail({});
              setSelectedEmail(null);
            }}
          >
            <PaperPlaneRight size={20} />
            {sidebarOpen && <span className="dark:text-white">Nouveau message</span>}
          </button>

          <div className="space-y-2">
            {(['inbox', 'drafts', 'sent', 'trash'] as Category[]).map((cat) => {
              const icons: Record<Category, string> = {
                inbox: '📥',
                drafts: '📝',
                sent: '📤',
                trash: '🗑'
              };
              const labels: Record<Category, string> = {
                inbox: 'Boîte de réception',
                drafts: 'Brouillons',
                sent: 'Envoyés',
                trash: 'Corbeille'
              };
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedEmail(null);
                    setView('inbox');
                  }}
                  className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{icons[cat]}</span>
                  {sidebarOpen && <span className="dark:text-white">{labels[cat]}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Barre de recherche et de tri */}
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="flex-1 border rounded-lg p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none"
            />
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value as 'dateAsc' | 'dateDesc' | 'priority')}
              className="border rounded-lg p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none"
            >
              <option value="dateDesc">Date (desc)</option>
              <option value="dateAsc">Date (asc)</option>
              <option value="priority">Priorité</option>
            </select>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Liste des emails filtrés */}
          <div
            className={`flex-1 max-w-2xl border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${
              selectedEmail ? 'hidden lg:block' : ''
            }`}
          >
            {displayedEmails.map(email => {
              const user = users.find(u => u.email === email.sender);
              return (
                <div
                  key={email.id}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    !email.read ? 'bg-blue-50 dark:bg-blue-900' : ''
                  }`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.avatar || 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=?'}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(email.priority)}`} />
                        <div className="font-medium text-gray-800 dark:text-gray-200">{email.subject}</div>
                      </div>
                      <div className="text-sm text-gray-400 line-clamp-1">{email.content}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(email.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vue de conversation */}
          {selectedEmail && (
            <div className="flex-1 p-6 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <button
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                  onClick={() => setSelectedEmail(null)}
                >
                  <CaretLeft size={20} />
                  Retour
                </button>
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={handleReply}
                  >
                    <ArrowFatLinesLeft size={20} />
                    Répondre
                  </button>
                  <button
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={handleForward}
                  >
                    <PaperPlaneRight size={20} />
                    Transférer
                  </button>
                  <button
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => selectedEmail && handleDeleteEmail(selectedEmail.id)}
                  >
                    <Trash size={20} />
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{selectedEmail.subject}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={users.find(u => u.email === selectedEmail.sender)?.avatar || 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=?'}
                    alt={users.find(u => u.email === selectedEmail.sender)?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{selectedEmail.sender}</div>
                    <div className="text-sm text-gray-500">À : {selectedEmail.recipient}</div>
                  </div>
                </div>
                <div className="prose max-w-none whitespace-pre-line text-gray-700 dark:text-gray-300">
                  {selectedEmail.content}
                </div>
              </div>

              {selectedEmail.thread.length > 0 && (
                <div className="space-y-8">
                  {selectedEmail.thread.map(message => {
                    const user = users.find(u => u.email === message.sender);
                    return (
                      <div key={message.id} className="flex items-start gap-4">
                        <img
                          src={user?.avatar || 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=?'}
                          alt={user?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 dark:text-gray-200">{user?.name}</div>
                          <div className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{message.content}</div>
                          <div className="text-sm text-gray-400 mt-2">
                            {new Date(message.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Formulaire de composition d'email */}
          {view === 'compose' && (
            <div className="flex-1 p-6 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSend} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Nouveau message</h2>
                  <button
                    type="button"
                    onClick={() => setView('inbox')}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-2xl transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <select
                    value={newEmail.recipient || ''}
                    onChange={e =>
                      setNewEmail(prev => ({
                        ...prev,
                        recipient: e.target.value
                      }))
                    }
                    className="w-full border rounded-lg p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Sélectionner un destinataire</option>
                    {users.map(user => (
                      <option key={user.id} value={user.email}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Objet"
                    value={newEmail.subject || ''}
                    onChange={e => setNewEmail(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full border rounded-lg p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />

                  <div className="flex items-center gap-2">
                    <label className="font-medium text-gray-800 dark:text-gray-200">Priorité :</label>
                    <select
                      value={newEmail.priority || 'normal'}
                      onChange={e => setNewEmail(prev => ({ ...prev, priority: e.target.value as Priority }))}
                      className="border rounded-lg p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="high">Important</option>
                      <option value="normal">Normal</option>
                      <option value="low">Peu important</option>
                    </select>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(newEmail.priority as Priority || 'normal')}`} />
                  </div>

                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={newEmail.content || ''}
                      onChange={e => setNewEmail(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Commencez à écrire..."
                      className="w-full h-64 border rounded-lg p-4 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAIPrompt(true)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 transition-colors"
                      >
                        <MagicWand size={20} />
                      </button>
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
                      >
                        <Paperclip size={20} />
                      </button>
                    </div>
                  </div>

                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                          <Paperclip size={16} />
                          <span className="text-sm">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border rounded-lg transition-colors"
                  >
                    Enregistrer le brouillon
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('inbox')}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <PaperPlaneRight size={20} />
                    Envoyer
                  </button>
                </div>
              </form>

              {/* Fenêtre d'invite IA */}
              {showAIPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-lg">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Description pour l'IA</h3>
                    <textarea
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder="Décrivez le contenu de votre email..."
                      className="w-full h-32 border rounded-lg p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowAIPrompt(false)}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleAIGeneration}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Générer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MailPage;