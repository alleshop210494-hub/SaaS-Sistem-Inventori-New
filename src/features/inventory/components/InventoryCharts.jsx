import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useInventory } from '../context/InventoryContext';

export const InventoryCharts = () => {
  const { items } = useInventory();

  const dataByCategory = items.reduce((acc, item) => {
    const existing = acc.find(i => i.name === item.category);
    if (existing) {
      existing.stock += Number(item.stock);
      existing.value += (Number(item.stock) * Number(item.price));
    } else {
      acc.push({
        name: item.category,
        stock: Number(item.stock),
        value: (Number(item.stock) * Number(item.price))
      });
    }
    return acc;
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Grafik Stok */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Tren Stok per Kategori</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataByCategory}>
              <defs>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="stock" 
                stroke="#0ea5e9" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorStock)" 
                name="Total Stok" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grafik Nilai Aset */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Tren Nilai Aset per Kategori</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataByCategory}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip formatter={(value) => formatRupiah(value)} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                name="Nilai Aset (IDR)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};