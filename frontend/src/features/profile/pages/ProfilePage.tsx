import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, Bell, LogOut, ChevronRight, Camera } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { Card, Button, Input } from '../../../components/ui';
import { UserSettings } from '@condovida/shared';
import { useAuthStore } from '../../../store/auth.store';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  unit: string;
  block: string;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 overflow-hidden ${value ? 'bg-stone-900' : 'bg-stone-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export function ProfilePage() {
  const qc = useQueryClient();
  const { user, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? '', phone: '' });

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ['profile-settings'],
    queryFn: async () => (await apiClient.get<{ data: UserSettings }>('/profile/settings')).data.data,
  });

  const updateSettings = useMutation({
    mutationFn: (data: Partial<UserSettings>) => apiClient.patch('/profile/settings', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile-settings'] }),
  });

  const updateProfile = useMutation({
    mutationFn: (data: typeof form) => apiClient.patch('/profile', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile-settings'] }); setEditing(false); },
  });

  const toggleSetting = (key: keyof UserSettings) => {
    if (!settings) return;
    updateSettings.mutate({ [key]: !settings[key] });
  };

  const notifyItems: { key: keyof UserSettings; label: string; description: string }[] = [
    { key: 'notifyAnnouncements', label: 'Comunicados', description: 'Avisos e novidades do condomínio' },
    { key: 'notifyPackages', label: 'Encomendas', description: 'Quando uma encomenda chegar' },
    { key: 'notifyTickets', label: 'Chamados', description: 'Atualizações dos seus chamados' },
    { key: 'notifyFinances', label: 'Financeiro', description: 'Vencimentos e pagamentos' },
    { key: 'notifyChat', label: 'Chat', description: 'Mensagens no chat do condomínio' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Perfil</h1>
        <p className="text-sm text-stone-400">Suas informações e configurações</p>
      </div>

      {/* Avatar + info */}
      <Card padding="p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center text-white text-2xl font-black">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-stone-200 rounded-lg flex items-center justify-center shadow-sm">
              <Camera size={11} className="text-stone-500" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-stone-900 truncate">{user?.name}</p>
            <p className="text-xs text-stone-500 truncate">{user?.email}</p>
            <p className="text-xs text-stone-400 mt-0.5">
              Ap. {user?.unit}-{user?.block}
              {user?.role === 'SINDICO' && <span className="ml-2 bg-stone-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">SÍNDICO</span>}
            </p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
          >
            Editar
          </button>
        </div>

        {editing && (
          <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
            <Input
              label="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Seu nome completo"
            />
            <Input
              label="Telefone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(11) 99999-9999"
            />
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" full onClick={() => setEditing(false)}>Cancelar</Button>
              <Button variant="accent" size="sm" full onClick={() => updateProfile.mutate(form)} loading={updateProfile.isPending}>Salvar</Button>
            </div>
          </div>
        )}
      </Card>

      {/* Notifications */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <Bell size={13} className="text-stone-400" />
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Notificações</span>
        </div>
        <Card padding="p-0" className="overflow-hidden divide-y divide-stone-50">
          {notifyItems.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-stone-800">{label}</p>
                <p className="text-xs text-stone-400">{description}</p>
              </div>
              <Toggle
                value={settings?.[key] ?? false}
                onChange={() => toggleSetting(key)}
              />
            </div>
          ))}
        </Card>
      </div>

      {/* Account actions */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <User size={13} className="text-stone-400" />
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Conta</span>
        </div>
        <Card padding="p-0" className="overflow-hidden divide-y divide-stone-50">
          <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 transition-colors">
            <p className="text-sm font-semibold text-stone-800">Alterar senha</p>
            <ChevronRight size={16} className="text-stone-300" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 transition-colors">
            <p className="text-sm font-semibold text-stone-800">Política de privacidade</p>
            <ChevronRight size={16} className="text-stone-300" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 transition-colors">
            <p className="text-sm font-semibold text-stone-800">Termos de uso</p>
            <ChevronRight size={16} className="text-stone-300" />
          </button>
        </Card>
      </div>

      {/* Logout */}
      <Button variant="danger" full icon={LogOut} onClick={logout}>
        Sair da conta
      </Button>

      <div className="text-center pb-2">
        <p className="text-[10px] text-stone-300">CondoVida v1.0.0</p>
      </div>
    </div>
  );
}
