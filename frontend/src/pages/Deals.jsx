import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Modal from "../components/Modal";
import api from "../services/api";

const STAGES = ["Prospecting", "Qualification", "Proposal", "Negotiation", "Won", "Lost"];

const emptyForm = { title: "", customer: "", value: "", stage: "Prospecting", probability: 10, expectedCloseDate: "", notes: "" };

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dealsRes, customersRes] = await Promise.all([api.get("/deals"), api.get("/customers")]);
      setDeals(dealsRes.data);
      setCustomers(customersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = (stage = "Prospecting") => {
    setEditingId(null);
    setForm({ ...emptyForm, stage });
    setModalOpen(true);
  };

  const openEditModal = (deal) => {
    setEditingId(deal._id);
    setForm({
      title: deal.title,
      customer: deal.customer?._id || "",
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability,
      expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.substring(0, 10) : "",
      notes: deal.notes || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, value: Number(form.value), probability: Number(form.probability) };
      if (editingId) {
        await api.put(`/deals/${editingId}`, payload);
      } else {
        await api.post("/deals", payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save deal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this deal?")) return;
    try {
      await api.delete(`/deals/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete deal");
    }
  };

  const handleDrop = async (stage) => {
    if (!draggedDeal || draggedDeal.stage === stage) return;
    try {
      await api.put(`/deals/${draggedDeal._id}`, { stage });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to move deal");
    } finally {
      setDraggedDeal(null);
    }
  };

  const dealsForStage = (stage) => deals.filter((d) => d.stage === stage);
  const stageTotal = (stage) => dealsForStage(stage).reduce((sum, d) => sum + d.value, 0);

  return (
    <DashboardLayout title="Deals Pipeline">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">Drag a deal card to move it between stages.</p>
        <button onClick={() => openAddModal()} className="btn-primary">+ Add Deal</button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading pipeline...</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <div
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
              className="bg-gray-100 rounded-xl p-3 w-72 flex-shrink-0"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="font-semibold text-sm text-gray-700">{stage}</p>
                <span className="text-xs text-gray-500">{dealsForStage(stage).length}</span>
              </div>
              <p className="text-xs text-gray-400 px-1 mb-2">₹{stageTotal(stage).toLocaleString("en-IN")}</p>

              <div className="space-y-2 min-h-[80px]">
                {dealsForStage(stage).map((deal) => (
                  <div
                    key={deal._id}
                    draggable
                    onDragStart={() => setDraggedDeal(deal)}
                    onClick={() => openEditModal(deal)}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition"
                  >
                    <p className="font-medium text-sm text-gray-800">{deal.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{deal.customer?.name || "—"}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-semibold text-primary-600">
                        ₹{deal.value.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-gray-400">{deal.probability}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openAddModal(stage)}
                className="w-full text-xs text-gray-400 hover:text-primary-600 mt-2 py-1"
              >
                + Add deal
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Deal" : "Add New Deal"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title *</label>
            <input name="title" required className="input-field" value={form.title} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
            <select name="customer" required className="input-field" value={form.customer} onChange={handleChange}>
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name} {c.company ? `(${c.company})` : ""}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value (₹) *</label>
              <input type="number" name="value" required min="0" className="input-field" value={form.value} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label>
              <input type="number" name="probability" min="0" max="100" className="input-field" value={form.probability} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
              <select name="stage" className="input-field" value={form.stage} onChange={handleChange}>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
              <input type="date" name="expectedCloseDate" className="input-field" value={form.expectedCloseDate} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" rows={3} className="input-field" value={form.notes} onChange={handleChange} />
          </div>
          <div className="flex justify-between items-center pt-2">
            {editingId && (
              <button type="button" onClick={() => handleDelete(editingId)} className="text-red-500 text-sm hover:underline">
                Delete Deal
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : editingId ? "Update Deal" : "Create Deal"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Deals;
