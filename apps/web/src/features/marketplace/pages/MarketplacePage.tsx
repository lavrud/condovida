import React, { useState } from 'react';
import { Plus, Tag, ShoppingBag, Gift } from 'lucide-react';
import { useMarketplace } from '../hooks/useMarketplace';
import { Card, Badge, Modal, Button, Input, Textarea, Select, TabPills } from '../../../components/ui';
import { fmt, fmtDate } from '../../../lib/utils';
import { MarketplaceType } from '@condovida/shared';

const tabs = [
  { id: 'all', label: 'Todos' },
  { id: MarketplaceType.SALE, label: 'Venda' },
  { id: MarketplaceType.DONATION, label: 'Doação' },
];

export function MarketplacePage() {
  const { listings, isLoading, create, isCreating } = useMarketplace();
  const [tab, setTab] = useState('all');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0,
    type: MarketplaceType.SALE,
  });

  const filtered = tab === 'all' ? listings : listings.filter((l) => l.type === tab);

  const handleCreate = () => {
    if (!form.title || !form.description) return;
    create(form, {
      onSuccess: () => {
        setModal(false);
        setForm({ title: '', description: '', price: 0, type: MarketplaceType.SALE });
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Classificados</h1>
          <p className="text-sm text-stone-400">Compra, venda e doação</p>
        </div>
        <Button variant="accent" size="sm" icon={Plus} onClick={() => setModal(true)}>
          Anunciar
        </Button>
      </div>

      <TabPills tabs={tabs} active={tab} onChange={setTab} />

      <div className="grid grid-cols-1 gap-3">
        {isLoading && <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />}
        {filtered.map((listing) => (
          <Card key={listing.id} padding="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center flex-shrink-0">
                {listing.type === MarketplaceType.SALE ? (
                  <Tag size={18} className="text-stone-400" />
                ) : (
                  <Gift size={18} className="text-emerald-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-stone-900">{listing.title}</p>
                  <Badge variant={listing.type === MarketplaceType.SALE ? 'accent' : 'success'}>
                    {listing.type === MarketplaceType.SALE ? 'Venda' : 'Doação'}
                  </Badge>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{listing.description}</p>
                <div className="flex items-center justify-between mt-2">
                  {listing.type === MarketplaceType.SALE && listing.price > 0 ? (
                    <p className="text-base font-bold text-stone-900">{fmt(listing.price)}</p>
                  ) : (
                    <p className="text-sm font-semibold text-emerald-600">Grátis</p>
                  )}
                  <p className="text-xs text-stone-400">
                    {listing.sellerName} · {fmtDate(listing.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {!isLoading && filtered.length === 0 && (
          <Card className="text-center py-8 text-stone-400">Nenhum anúncio encontrado</Card>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Novo Anúncio">
        <Select
          label="Tipo"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as MarketplaceType })}
          options={[
            { value: MarketplaceType.SALE, label: 'Venda' },
            { value: MarketplaceType.DONATION, label: 'Doação' },
          ]}
        />
        <Input
          label="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Ex: Sofá 3 lugares"
          required
        />
        <Textarea
          label="Descrição"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Estado do item, detalhes..."
          rows={3}
          required
        />
        {form.type === MarketplaceType.SALE && (
          <Input
            label="Preço (R$)"
            type="number"
            value={form.price.toString()}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            placeholder="0"
          />
        )}
        <Button variant="accent" full icon={ShoppingBag} onClick={handleCreate} loading={isCreating}>
          Publicar Anúncio
        </Button>
      </Modal>
    </div>
  );
}
