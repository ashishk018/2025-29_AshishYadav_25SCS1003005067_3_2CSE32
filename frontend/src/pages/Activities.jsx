import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Modal from "../components/Modal";
import api from "../services/api";

const emptyForm = {
  type: "Call",
  subject: "",
  description: "",
  relatedType: "Lead",
  relatedId: "",
  dueDate: "",
  completed: true,
};

const TYPE_ICON = { Call: "📞", Email: "📧", Meeting: "🤝", Note: "📝", Task: "✅" };

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [actRes, leadsRes, custRes] = await Promise.all([
        api.get("/activities"),
        api.get("/leads"),
        api.get("/customers"),
      ]);
      setActivities(actRes.data);
      setLeads(leadsRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === "relatedType" ? { relatedId: "" } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/activities", {
        type: form.type,
        subject: form.subject,
        description: form.description,
        relatedTo: { type: form.relatedType, id: form.relatedId },
        dueDate: form.dueDate || undefined,
        completed: form.completed,
      });
      setModalOpen(false);
      setForm(emptyForm);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to log activity");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity log?")) return;
    try {
      await api.delete(`/activities/${id}`);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const relatedOptions = form.relatedType === "Lead" ? leads : customers;

  return (
    <DashboardLayout title="Activity Logs">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">Track calls, emails, meetings, and notes with leads & customers.</p>
        <button onClick={() => setModalOpen(true)} className="btn-primary">+ Log Activity</button>
      </div>

      <div className="card p-0 divide-y divide-gray-100">
        {loading && <p className="text-gray-400 text-center py-8">Loading activities...</p>}
        {!loading && activities.length === 0 && (
          <p className="text-gray-400 text-center py-8">No activity logged yet.</p>
        )}
        {activities.map((a) => (
          <div key={a._id} className="flex items-start justify-between px-5 py-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">{TYPE_ICON[a.type] || "📌"}</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">{a.subject}</p>
                {a.description && <p className="text-sm text-gray-500 mt-0.5">{a.description}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {a.type} • Related to {a.relatedTo?.type} • by {a.performedBy?.name} •{" "}
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <button onClick={() => handleDelete(a._id)} className="text-red-500 hover:underline text-xs font-medium">
              Delete
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log New Activity">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" className="input-field" value={form.type} onChange={handleChange}>
                {Object.keys(TYPE_ICON).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
              <select name="relatedType" className="input-field" value={form.relatedType} onChange={handleChange}>
                <option value="Lead">Lead</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select {form.relatedType} *</label>
            <select name="relatedId" required className="input-field" value={form.relatedId} onChange={handleChange}>
              <option value="">Select {form.relatedType.toLowerCase()}</option>
              {relatedOptions.map((r) => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input name="subject" required className="input-field" value={form.subject} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows={3} className="input-field" value={form.description} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (optional)</label>
            <input type="date" name="dueDate" className="input-field" value={form.dueDate} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Log Activity"}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Activities;
