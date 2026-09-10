import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

const emptyForm = { name: "", email: "", phone: "", company: "", source: "Website", status: "New", notes: "" };

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchLeads = async (q = "") => {
    setLoading(true);
    try {
      const { data } = await api.get("/leads", { params: q ? { search: q } : {} });
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads(search);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (lead) => {
    setEditingId(lead._id);
    setForm({
      name: lead.name,
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      source: lead.source,
      status: lead.status,
      notes: lead.notes || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/leads/${editingId}`, form);
      } else {
        await api.post("/leads", form);
      }
      setModalOpen(false);
      fetchLeads(search);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save lead");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead? This action cannot be undone.")) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads(search);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete lead");
    }
  };

  return (
    <DashboardLayout title="Leads">
      <div className="flex items-center justify-between mb-4 gap-3">
        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <input
            className="input-field"
            placeholder="Search leads by name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <button onClick={openAddModal} className="btn-primary">
          + Add Lead
        </button>
      </div>

      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  Loading leads...
                </td>
              </tr>
            )}
            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No leads found. Click "Add Lead" to create one.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{lead.name}</td>
                <td className="px-5 py-3 text-gray-600">{lead.company || "—"}</td>
                <td className="px-5 py-3 text-gray-600">
                  <div>{lead.email || "—"}</div>
                  <div className="text-xs text-gray-400">{lead.phone}</div>
                </td>
                <td className="px-5 py-3 text-gray-600">{lead.source}</td>
                <td className="px-5 py-3">
                  <StatusBadge value={lead.status} />
                </td>
                <td className="px-5 py-3 text-right space-x-2">
                  <button onClick={() => openEditModal(lead)} className="text-primary-600 hover:underline text-xs font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(lead._id)} className="text-red-500 hover:underline text-xs font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Lead" : "Add New Lead"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" required className="input-field" value={form.name} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" className="input-field" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input name="phone" className="input-field" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input name="company" className="input-field" value={form.company} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select name="source" className="input-field" value={form.source} onChange={handleChange}>
                {["Website", "Referral", "Cold Call", "Social Media", "Advertisement", "Other"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" className="input-field" value={form.status} onChange={handleChange}>
                {["New", "Contacted", "Qualified", "Unqualified", "Converted"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" rows={3} className="input-field" value={form.notes} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : editingId ? "Update Lead" : "Create Lead"}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Leads;
