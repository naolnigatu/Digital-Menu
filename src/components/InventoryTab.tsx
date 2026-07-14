import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Plus, Trash2 } from 'lucide-react';

export const InventoryTab = ({ tenantId, branchId }: { tenantId: string, branchId: string }) => {
  const { ingredients, addIngredient, stockMovements, addStockMovement } = useApp();
  const branchIngredients = ingredients.filter(i => i.branchId === branchId);

  const [showAdd, setShowAdd] = useState(false);
  const [newIngredient, setNewIngredient] = useState({ name: '', unit: 'kg', reorderLevel: 10, supplier: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredient.name) return;
    addIngredient({ ...newIngredient, tenantId, branchId, stockQuantity: 0 });
    setNewIngredient({ name: '', unit: 'kg', reorderLevel: 10, supplier: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Enterprise Inventory</h2>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
          <Plus className="h-4 w-4" /> Add Ingredient
        </button>
      </div>
      
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900">New Ingredient</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Name</label>
              <input required type="text" value={newIngredient.name} onChange={e => setNewIngredient({...newIngredient, name: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Unit</label>
              <input required type="text" value={newIngredient.unit} onChange={e => setNewIngredient({...newIngredient, unit: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Reorder Level</label>
              <input required type="number" value={newIngredient.reorderLevel} onChange={e => setNewIngredient({...newIngredient, reorderLevel: Number(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Supplier</label>
              <input type="text" value={newIngredient.supplier} onChange={e => setNewIngredient({...newIngredient, supplier: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800">Save</button>
          </div>
        </form>
      )}

      {branchIngredients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Upload className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Ingredients</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Track raw materials and automatically deduct stock based on recipes.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Ingredient</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Reorder Level</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branchIngredients.map(ing => (
                <tr key={ing.id}>
                  <td className="px-4 py-3 font-bold text-slate-900">{ing.name}</td>
                  <td className="px-4 py-3 font-mono">{ing.stockQuantity}</td>
                  <td className="px-4 py-3">{ing.unit}</td>
                  <td className="px-4 py-3">{ing.reorderLevel}</td>
                  <td className="px-4 py-3">{ing.supplier || '-'}</td>
                  <td className="px-4 py-3">
                    {ing.stockQuantity <= 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">Out of Stock</span>
                    ) : ing.stockQuantity <= ing.reorderLevel ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">Low Stock</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Good</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => {
                      const qty = prompt(`Add stock to ${ing.name} (in ${ing.unit}):`);
                      if (qty && !isNaN(Number(qty))) {
                        addStockMovement({
                          ingredientId: ing.id,
                          tenantId,
                          branchId,
                          type: 'in',
                          quantity: Number(qty),
                          actor: 'Owner',
                          note: 'Manual restock'
                        });
                      }
                    }} className="text-blue-600 hover:underline font-bold text-xs">Restock</button>
                    <button onClick={() => {
                      const qty = prompt(`Report waste for ${ing.name} (in ${ing.unit}):`);
                      if (qty && !isNaN(Number(qty))) {
                        addStockMovement({
                          ingredientId: ing.id,
                          tenantId,
                          branchId,
                          type: 'waste',
                          quantity: Number(qty),
                          actor: 'Owner',
                          note: 'Reported waste'
                        });
                      }
                    }} className="text-amber-600 hover:underline font-bold text-xs">Waste</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
