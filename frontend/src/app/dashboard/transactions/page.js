'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { transactionsAPI, walletAPI } from '@/services/api';
import { useSession } from '@/lib/useSession';

export default function TransactionsPage() {
  const { userId } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!userId) return;
    async function load() {
      try {
        const wallet = await walletAPI.tryGetByUser(userId);
        if (!wallet?.id) {
          setTransactions([]);
          return;
        }
        const t = await transactionsAPI.getAll(wallet.id);
        setTransactions(t);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [userId]);

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.status === filter);

  return (
    <Layout>
      <div style={{ padding: '32px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>Finance</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>Transaction History</h2>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#e7eeff', padding: 4, borderRadius: 8, width: 'fit-content', marginBottom: 24 }}>
          {['all', 'completed', 'pending', 'failed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Manrope, sans-serif', background: filter === f ? 'white' : 'transparent', color: filter === f ? '#001736' : '#64748b' }}>{f}</button>
          ))}
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="card">
            {/* Table Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #e7eeff' }}>
              {['Type', 'Amount', 'Currency', 'Status', 'Date'].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontFamily: 'Manrope, sans-serif' }}>{h}</span>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#dee8ff', display: 'block', marginBottom: 8 }}>receipt_long</span>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>No transactions found.</p>
              </div>
            ) : filtered.map(t => (
              <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '16px 20px', borderBottom: '1px solid #f0f3ff', cursor: 'pointer', transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#f9f9ff'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#001736' }}>receipt</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#001736', fontSize: 14 }}>{t.transaction_type}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif', alignSelf: 'center' }}>${parseFloat(t.amount).toFixed(2)}</span>
                <span style={{ color: '#64748b', alignSelf: 'center', fontSize: 14 }}>{t.currency_code}</span>
                <span style={{ alignSelf: 'center' }}>
                  <span className={`badge badge-${t.status === 'completed' ? 'success' : t.status === 'pending' ? 'warning' : 'error'}`}>{t.status}</span>
                </span>
                <span style={{ color: '#94a3b8', fontSize: 12, alignSelf: 'center' }}>{new Date(t.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}