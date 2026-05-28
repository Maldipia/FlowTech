'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw, LogOut, Search } from 'lucide-react';

const STATUS_COLORS = {
  'New':       { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  'Contacted': { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  'Proposal':  { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Closed':    { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  'Lost':      { bg: 'bg-gray-100',  text: 'text-gray-500',   dot: 'bg-gray-400' },
};

const STATUSES = ['New', 'Contacted', 'Proposal', 'Closed', 'Lost'];

export default function AdminDiscoveryPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const router = useRouter();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?status=${filter}`);
      if (res.status === 401) { router.push('/admin/login'); return; }
      const { data } = await res.json();
      setLeads(data || []);
    } finally {
      setLoading(false);
    }
  }, [filter, router]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setLeads(l => l.map(lead => lead.id === id ? { ...lead, status } : lead));
    setUpdating(null);
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const filtered = leads.filter(l => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.business_name?.toLowerCase().includes(q) ||
      l.contact_person?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.main_objective?.toLowerCase().includes(q)
    );
  });

  const counts = STATUSES.reduce((acc, s) => ({
    ...acc, [s]: leads.filter(l => l.status === s).length
  }), {});

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-2xl font-semibold text-gray-900">Discovery Leads</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchLeads} className="p-2 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors">
            <RefreshCw size={15} />
          </button>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-lg transition-colors">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {STATUSES.map(s => {
          const c = STATUS_COLORS[s];
          return (
            <div key={s} className={`${c.bg} rounded-xl px-4 py-3 cursor-pointer border-2 ${filter === s ? 'border-gray-900' : 'border-transparent'}`}
              onClick={() => setFilter(filter === s ? 'all' : s)}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <span className={`text-xs font-medium ${c.text}`}>{s}</span>
              </div>
              <div className={`text-2xl font-semibold ${c.text}`}>{counts[s] || 0}</div>
            </div>
          );
        })}
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or objective…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors" />
        </div>
        <button onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${filter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
          All ({leads.length})
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 size={18} className="animate-spin" /> Loading leads…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">No leads found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(lead => {
            const c = STATUS_COLORS[lead.status] || STATUS_COLORS['New'];
            const isOpen = expanded === lead.id;
            return (
              <div key={lead.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors">
                {/* Row */}
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : lead.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-0.5">
                      <span className="font-semibold text-gray-900 text-sm">{lead.business_name || '—'}</span>
                      <span className="text-xs text-gray-400">{lead.contact_person}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{lead.main_objective} · {lead.budget_range}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-400 hidden md:block">
                      {new Date(lead.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </span>
                    {/* Status dropdown */}
                    <div onClick={e => e.stopPropagation()}>
                      {updating === lead.id ? (
                        <div className="px-3 py-1"><Loader2 size={13} className="animate-spin text-gray-400" /></div>
                      ) : (
                        <select value={lead.status || 'New'}
                          onChange={e => updateStatus(lead.id, e.target.value)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-900 ${c.bg} ${c.text}`}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                    </div>
                    <span className={`text-gray-400 text-xs transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 grid md:grid-cols-3 gap-5 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Contact</p>
                      <p className="text-gray-700 font-medium">{lead.contact_person}</p>
                      <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline text-xs block mt-1">{lead.email}</a>
                      <a href={`tel:${lead.mobile}`} className="text-gray-500 text-xs block mt-0.5">{lead.mobile}</a>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Project</p>
                      <p className="text-gray-700">{lead.main_objective}</p>
                      <p className="text-gray-500 text-xs mt-1">{lead.budget_range} · {lead.timeline}</p>
                      {lead.project_details && <p className="text-gray-500 text-xs mt-2 leading-relaxed">{lead.project_details}</p>}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Business</p>
                      <p className="text-gray-700">{lead.business_name}</p>
                      <p className="text-gray-500 text-xs mt-1">{lead.industry}</p>
                      {lead.current_tools && <p className="text-gray-500 text-xs mt-1">Tools: {lead.current_tools}</p>}
                      {lead.how_found && <p className="text-gray-500 text-xs mt-1">Found via: {lead.how_found}</p>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
