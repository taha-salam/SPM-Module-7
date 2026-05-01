'use client';
import { useCallback, useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { notificationsAPI } from '@/services/api';
import { useSession } from '@/lib/useSession';

export default function NotificationsPage() {
  const { userId } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await notificationsAPI.getAll(userId);
      setNotifications(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    load();
  }, [userId, load]);

  async function handleRead(id) {
    try {
      await notificationsAPI.markRead(id);
      load();
    } catch (e) { console.error(e); }
  }

  return (
    <Layout>
      <div style={{ padding: '32px 40px', maxWidth: 800 }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>Alerts</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>Notifications</h2>
        </div>

        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#dee8ff', display: 'block', marginBottom: 8 }}>notifications_none</span>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>No notifications yet.</p>
              </div>
            ) : notifications.map(n => (
              <div key={n.id} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start', opacity: n.status === 'read' ? 0.6 : 1, border: n.status === 'read' ? '1px solid #e7eeff' : '1px solid #dee8ff' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: '#001736', fontSize: 20 }}>notifications</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif', fontSize: 14 }}>{n.title}</p>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 8px' }}>{n.message}</p>
                  <p style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Manrope, sans-serif' }}>{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
                {n.status !== 'read' && (
                  <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 10, flexShrink: 0 }} onClick={() => handleRead(n.id)}>Mark Read</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}