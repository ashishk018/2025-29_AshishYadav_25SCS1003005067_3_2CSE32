import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Modal from "../components/Modal";
import api from "../services/api";

const emptyForm = { name: "", email: "", phone: "", company: "", address: "", industry: "" };

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCustomers = async (q = "") => {
    setLoading(true);
    try {
      const { data } = await api.get("/customers", { params: q ? { search: q } : {} });
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(search);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingId(c._id);
    setForm({
      name: c.name,
      email: c.email || "",
      phone: c.phone || "",
      company: c.company || "",
      address: c.address || "",
      industry: c.industry || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, form);
      } else {
        await api.post("/customers", form);
      }
      setModalOpen(false);
      fetchCustomers(search);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save customer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer? This action cannot be undone.")) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers(search);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete customer");
    }
  };

  return (
    <DashboardLayout title="Customers">
      <div className="flex items-center justify-between mb-4 gap-3">
        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <input
            className="input-field"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <button onClick={openAddModal} className="btn-primary">
          + Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p className="text-gray-400 col-span-full text-center py-8">Loading customers...</p>}
        {!loading && customers.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-8">No customers yet. Add one or convert a lead.</p>
        )}
        {customers.map((c) => (
          <div key={c._id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-sm text-gray-500">{c.company || "—"}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                {c.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-500 space-y-1">
              <p>📧 {c.email || "—"}</p>
              <p>📞 {c.phone || "—"}</p>
              <p>🏭 {c.industry || "—"}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => openEditModal(c)} className="btn-secondary flex-1">Edit</button>
              <button onClick={() => handleDelete(c._id)} className="text-red-500 text-sm px-3 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Customer" : "Add New Customer"}>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input name="company" className="input-field" value={form.company} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input name="industry" className="input-field" value={form.industry} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea name="address" rows={2} className="input-field" value={form.address} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : editingId ? "Update Customer" : "Create Customer"}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Customers;
