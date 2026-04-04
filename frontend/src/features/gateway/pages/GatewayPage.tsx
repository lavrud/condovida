import React, { useState } from 'react';
import { Plus, Package, Users, Wrench, QrCode, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useGateway } from '../hooks/useGateway';
import { Card, Badge, Modal, Button, TabPills, Input, Select } from '../../../components/ui';
import { fmtDateTime } from '../../../lib/utils';
import { Visitor, VisitorType } from '@condovida/shared';

const tabs = [
  { id: 'visitors', label: 'Visitantes' },
  { id: 'packages', label: 'Encomendas' },
  { id: 'providers', label: 'Prestadores' },
];

export function GatewayPage() {
  const { visitors, packages, providers, createVisitor, removeVisitor, pickupPackage, isLoading, isCreatingVisitor } = useGateway();
  const [tab, setTab] = useState('visitors');
  const [modal, setModal] = useState(false);
  const [createdVisitor, setCreatedVisitor] = useState<Visitor | null>(null);
  const [expandedQr, setExpandedQr] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    type: VisitorType.VISITOR,
    date: '',
    time: '',
    unit: '',
  });

  const handleCreateVisitor = () => {
    if (!form.name || !form.date || !form.time || !form.unit) return;
    createVisitor(form, {
      onSuccess: (visitor) => {
        setCreatedVisitor(visitor);
        setForm({ name: '', type: VisitorType.VISITOR, date: '', time: '', unit: '' });
      },
    });
  };

  const handleCloseModal = () => {
    setModal(false);
    setCreatedVisitor(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Portaria</h1>
          <p className="text-sm text-stone-400">Visitantes e encomendas</p>
        </div>
        {tab === 'visitors' && (
          <Button variant="accent" size="sm" icon={Plus} onClick={() => setModal(true)}>
            Visitante
          </Button>
        )}
      </div>

      <TabPills tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'visitors' && (
        <div className="space-y-2">
          {isLoading && <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />}
          {visitors.length === 0 && !isLoading && (
            <Card className="text-center py-8 text-stone-400">Nenhum visitante autorizado</Card>
          )}
          {visitors.map((v) => (
            <Card key={v.id} padding="p-0" className="overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-stone-50 flex items-center justify-center flex-shrink-0">
                  <Users size={16} className="text-stone-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800">{v.name}</p>
                  <p className="text-xs text-stone-400">{v.unit} · {v.scheduledTime}</p>
                </div>
                <Badge variant="success">{v.type}</Badge>
                <button
                  onClick={() => setExpandedQr(expandedQr === v.id ? null : v.id)}
                  className="p-1.5 rounded-lg hover:bg-stone-50 text-stone-400 hover:text-stone-700 transition-colors"
                  title="Ver QR Code"
                >
                  <QrCode size={16} />
                </button>
                <button
                  onClick={() => removeVisitor(v.id)}
                  className="p-1 rounded hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              {expandedQr === v.id && (
                <div className="border-t border-stone-100 bg-stone-50 flex flex-col items-center gap-2 py-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <QRCodeSVG value={v.qrCode} size={150} />
                  </div>
                  <p className="text-xs font-mono text-stone-500">{v.qrCode}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === 'packages' && (
        <div className="space-y-2">
          {packages.map((pkg) => (
            <Card key={pkg.id} padding="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Package size={16} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800">{pkg.description}</p>
                  <p className="text-xs text-stone-400">
                    {pkg.unit} · Chegou: {fmtDateTime(pkg.arrivedAt)}
                  </p>
                </div>
                {pkg.status === 'WAITING' ? (
                  <Button size="sm" variant="success" onClick={() => pickupPackage(pkg.id)}>
                    Retirado
                  </Button>
                ) : (
                  <Badge variant="default">Retirado</Badge>
                )}
              </div>
            </Card>
          ))}
          {packages.length === 0 && (
            <Card className="text-center py-8 text-stone-400">Nenhuma encomenda</Card>
          )}
        </div>
      )}

      {tab === 'providers' && (
        <div className="space-y-2">
          {providers.map((p) => (
            <Card key={p.id} padding="px-4 py-3" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-50 flex items-center justify-center flex-shrink-0">
                <Wrench size={16} className="text-stone-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-800">{p.name}</p>
                <p className="text-xs text-stone-400">{p.unit} · {p.service}</p>
              </div>
              <Badge variant={p.exitTime ? 'default' : 'warning'}>
                {p.exitTime ? 'Saiu' : 'Dentro'}
              </Badge>
            </Card>
          ))}
          {providers.length === 0 && (
            <Card className="text-center py-8 text-stone-400">Nenhum prestador registrado</Card>
          )}
        </div>
      )}

      <Modal isOpen={modal} onClose={handleCloseModal} title={createdVisitor ? 'QR Code Gerado' : 'Autorizar Visitante'}>
        {createdVisitor ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <p className="text-sm text-stone-500 text-center">
              Compartilhe este QR Code com <strong>{createdVisitor.name}</strong> para entrada na unidade {createdVisitor.unit}.
            </p>
            <div className="bg-stone-50 p-4 rounded-2xl">
              <QRCodeSVG value={createdVisitor.qrCode} size={200} />
            </div>
            <p className="text-xs font-mono text-stone-400">{createdVisitor.qrCode}</p>
            <Button variant="accent" full onClick={handleCloseModal}>
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <Select
              label="Tipo"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as VisitorType })}
              options={[
                { value: VisitorType.VISITOR, label: 'Visitante' },
                { value: VisitorType.PROVIDER, label: 'Prestador' },
                { value: VisitorType.DELIVERY, label: 'Entregador' },
              ]}
            />
            <Input
              label="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome completo"
              required
            />
            <Input
              label="Unidade destino"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              placeholder="Ex: 304-B"
              required
            />
            <div className="mb-4">
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">
                Data <span className="text-orange-500">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm bg-stone-50 border-2 border-transparent text-stone-900 focus:border-stone-300 focus:bg-white transition-all outline-none"
              />
            </div>
            <Input
              label="Horário previsto"
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
            />
            <Button variant="accent" full icon={QrCode} onClick={handleCreateVisitor} loading={isCreatingVisitor}>
              Gerar QR Code
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
}
