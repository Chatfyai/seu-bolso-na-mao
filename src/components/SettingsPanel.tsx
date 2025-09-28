import React, { useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type Category = Tables<'categories'>;

interface SettingsPanelProps {
  user: User | null;
  profile: any;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ user, profile }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#3ecf8e');
  const [addingEntrada, setAddingEntrada] = useState(false);
  const [addingSaida, setAddingSaida] = useState(false);
  const [newEntradaName, setNewEntradaName] = useState('');
  const [newEntradaColor, setNewEntradaColor] = useState('#3ecf8e');
  const [newSaidaName, setNewSaidaName] = useState('');
  const [newSaidaColor, setNewSaidaColor] = useState('#FF7F6A');

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) return;
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        if (error) throw error;
        setCategories(data || []);
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Erro ao carregar categorias', description: err.message || 'Tente novamente.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, toast]);

  const entradas = useMemo(() => categories.filter(c => c.type === 'entrada'), [categories]);
  const saidas = useMemo(() => categories.filter(c => c.type === 'saida'), [categories]);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color || '#3ecf8e');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('#3ecf8e');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name: editName.trim(), color: editColor })
        .eq('id', editingId);
      if (error) throw error;
      setCategories(prev => prev.map(c => (c.id === editingId ? { ...c, name: editName.trim(), color: editColor } : c)));
      toast({ title: 'Categoria atualizada' });
      cancelEdit();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro ao salvar', description: err.message || 'Tente novamente.' });
    }
  };

  const removeCategory = async (id: string) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
      toast({ title: 'Categoria removida' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro ao remover', description: err.message || 'Tente novamente.' });
    }
  };

  const addCategory = async (type: 'entrada' | 'saida') => {
    if (!user) return;
    const name = (type === 'entrada' ? newEntradaName : newSaidaName).trim();
    const color = type === 'entrada' ? newEntradaColor : newSaidaColor;
    if (!name) {
      toast({ variant: 'destructive', title: 'Informe um nome', description: 'O nome da categoria é obrigatório.' });
      return;
    }
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ user_id: user.id, name, type, color, is_default: false })
        .select('*')
        .single();
      if (error) throw error;
      if (data) {
        setCategories(prev => [...prev, data as Category]);
      }
      toast({ title: 'Categoria adicionada' });
      if (type === 'entrada') {
        setNewEntradaName('');
        setNewEntradaColor('#3ecf8e');
        setAddingEntrada(false);
      } else {
        setNewSaidaName('');
        setNewSaidaColor('#FF7F6A');
        setAddingSaida(false);
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro ao adicionar', description: err.message || 'Tente novamente.' });
    }
  };

  const accountTypeHuman = useMemo(() => {
    if (!profile?.account_type) return 'Pessoa Física';
    return profile.account_type === 'business' ? 'Empresa' : 'Pessoa Física';
  }, [profile]);

  if (loading) {
    return (
      <div className="p-5 text-sm text-muted-foreground">Carregando configurações…</div>
    );
  }

  if (!user) {
    return (
      <div className="p-5 text-sm text-muted-foreground">Faça login para ver as configurações.</div>
    );
  }

  const renderList = (items: Category[]) => (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhuma categoria ainda.</p>
      )}
      {items.map((cat) => (
        <div key={cat.id} className="flex items-center gap-3 rounded-md border p-3">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
          {editingId === cat.id ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                className="flex-1 h-9 rounded border px-3 text-sm"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                type="color"
                aria-label="Escolher cor"
                className="h-9 w-9 rounded border"
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
              />
              <button onClick={saveEdit} className="h-9 rounded bg-[#3ecf8e] px-3 text-sm font-medium text-white">Salvar</button>
              <button onClick={cancelEdit} className="h-9 rounded border px-3 text-sm">Cancelar</button>
            </div>
          ) : (
            <>
              <span className="flex-1 text-sm text-foreground">{cat.name}</span>
              <button
                onClick={() => startEdit(cat)}
                className="rounded p-2 hover:bg-gray-100"
                aria-label="Editar"
                title="Editar"
              >
                <span className="material-symbols-outlined text-gray-600">edit</span>
              </button>
              <button
                onClick={() => removeCategory(cat.id)}
                className="rounded p-2 hover:bg-red-50"
                aria-label="Apagar"
                title="Apagar"
              >
                <span className="material-symbols-outlined text-red-600">delete</span>
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-5 space-y-6">
      <section>
        <h3 className="text-base font-semibold text-foreground">Tipos de entradas</h3>
        <p className="mt-1 text-sm text-muted-foreground">Edite ou apague categorias de entrada.</p>
        <div className="mt-3">
          {renderList(entradas)}
        </div>
        <div className="mt-3">
          {addingEntrada ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 h-9 rounded border px-3 text-sm"
                  placeholder="Nome da categoria"
                  value={newEntradaName}
                  onChange={(e) => setNewEntradaName(e.target.value)}
                />
                <input
                  type="color"
                  aria-label="Cor da categoria"
                  className="h-9 w-9 rounded border"
                  value={newEntradaColor}
                  onChange={(e) => setNewEntradaColor(e.target.value)}
                />
                <button
                  onClick={() => addCategory('entrada')}
                  className="flex h-9 w-9 items-center justify-center rounded bg-[#3ecf8e] text-white"
                  aria-label="Confirmar"
                  title="Confirmar"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </button>
                <button
                  onClick={() => { setAddingEntrada(false); setNewEntradaName(''); }}
                  className="flex h-9 w-9 items-center justify-center rounded border"
                  aria-label="Cancelar"
                  title="Cancelar"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: newEntradaColor }}></span>
                <span>{newEntradaColor}</span>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingEntrada(true)} className="h-10 rounded-lg border px-3 text-sm font-medium">
              + Adicionar categoria
            </button>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-foreground">Tipos de saídas</h3>
        <p className="mt-1 text-sm text-muted-foreground">Edite ou apague categorias de saída.</p>
        <div className="mt-3">
          {renderList(saidas)}
        </div>
        <div className="mt-3">
          {addingSaida ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 h-9 rounded border px-3 text-sm"
                  placeholder="Nome da categoria"
                  value={newSaidaName}
                  onChange={(e) => setNewSaidaName(e.target.value)}
                />
                <input
                  type="color"
                  aria-label="Cor da categoria"
                  className="h-9 w-9 rounded border"
                  value={newSaidaColor}
                  onChange={(e) => setNewSaidaColor(e.target.value)}
                />
                <button
                  onClick={() => addCategory('saida')}
                  className="flex h-9 w-9 items-center justify-center rounded bg-[#FF7F6A] text-white"
                  aria-label="Confirmar"
                  title="Confirmar"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </button>
                <button
                  onClick={() => { setAddingSaida(false); setNewSaidaName(''); }}
                  className="flex h-9 w-9 items-center justify-center rounded border"
                  aria-label="Cancelar"
                  title="Cancelar"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: newSaidaColor }}></span>
                <span>{newSaidaColor}</span>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingSaida(true)} className="h-10 rounded-lg border px-3 text-sm font-medium">
              + Adicionar categoria
            </button>
          )}
        </div>
      </section>

      <section>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Tipo de conta atual</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{accountTypeHuman}</p>
        </div>
      </section>
    </div>
  );
};

export default SettingsPanel;


