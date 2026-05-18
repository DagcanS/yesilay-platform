import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// ─── Yardımcı: Supabase Storage'a dosya yükle ───────────────────────────────
async function uploadFile(
  bucket: string,
  file: File,
  onProgress: (p: number) => void
): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Supabase SDK progress desteklemiyor; simüle ediyoruz
  onProgress(10);
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  onProgress(100);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ─── Yeniden kullanılabilir Dosya Yükleme Bileşeni ──────────────────────────
interface FileUploadProps {
  label: string;
  accept: string;
  bucket: string;
  onUploaded: (url: string) => void;
  hint?: string;
}
const FileUpload: React.FC<FileUploadProps> = ({ label, accept, bucket, onUploaded, hint }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setDone(false);
    setProgress(0);
    setUploading(true);
    try {
      const url = await uploadFile(bucket, file, setProgress);
      onUploaded(url);
      setDone(true);
    } catch (err: any) {
      alert('Yükleme başarısız: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: '#374151' }}>
        {label}
      </label>
      {hint && <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '6px' }}>{hint}</p>}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: `2px dashed ${done ? '#22c55e' : '#cbd5e1'}`,
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
          cursor: uploading ? 'wait' : 'pointer',
          background: done ? '#f0fdf4' : '#f8fafc',
          transition: 'all 0.2s',
        }}
      >
        <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={handleChange} />
        {uploading ? (
          <div>
            <p style={{ color: '#3b82f6', marginBottom: '8px', fontSize: '0.9rem' }}>⏳ Yükleniyor...</p>
            <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
              <div style={{ background: 'var(--isbank-blue)', height: '8px', width: `${progress}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
        ) : done ? (
          <p style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9rem' }}>✅ {fileName}</p>
        ) : (
          <div>
            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '1.8rem', color: '#94a3b8', marginBottom: '8px', display: 'block' }}></i>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {fileName ? fileName : 'Tıklayarak dosya seçin'}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' }}>{accept}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Ana Admin Dashboard ─────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState<any>(null);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [videocasts, setVideocasts] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const navigate = useNavigate();

  // Form state
  const [podForm, setPodForm] = useState({ title: '', duration: '', description: '', audio_url: '', image_url: '' });
  const [vidForm, setVidForm] = useState({ title: '', category: '', description: '', video_url: '' });
  const [artForm, setArtForm] = useState({ title: '', author: '', content: '', image_url: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/admin/login');
      else fetchData();
    };
    checkSession();
  }, [navigate]);

  const fetchData = async () => {
    const [pod, vid, art, test] = await Promise.all([
      supabase.from('podcasts').select('*').order('created_at', { ascending: false }),
      supabase.from('videocasts').select('*').order('created_at', { ascending: false }),
      supabase.from('articles').select('*').order('created_at', { ascending: false }),
      supabase.from('test_results').select('risk_level'),
    ]);
    if (pod.data) setPodcasts(pod.data);
    if (vid.data) setVideocasts(vid.data);
    if (art.data) setArticles(art.data);
    if (test.data) {
      const d = test.data;
      setStats({
        Total: d.length,
        Low: d.filter(t => t.risk_level === 'Düşük Risk Grubu').length,
        Medium: d.filter(t => t.risk_level === 'Orta Risk Grubu').length,
        High: d.filter(t => t.risk_level === 'Yüksek Risk Grubu').length,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const deleteItem = async (table: string, id: number) => {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  const handleAddPodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podForm.audio_url) return alert('Lütfen bir ses dosyası yükleyin.');
    setSubmitting(true);
    await supabase.from('podcasts').insert([podForm]);
    setPodForm({ title: '', duration: '', description: '', audio_url: '', image_url: '' });
    setSubmitting(false);
    fetchData();
  };

  const handleAddVideocast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidForm.video_url) return alert('Lütfen bir video dosyası yükleyin.');
    setSubmitting(true);
    await supabase.from('videocasts').insert([{ ...vidForm, categoryColor: '#003DA5' }]);
    setVidForm({ title: '', category: '', description: '', video_url: '' });
    setSubmitting(false);
    fetchData();
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await supabase.from('articles').insert([artForm]);
    setArtForm({ title: '', author: '', content: '', image_url: '' });
    setSubmitting(false);
    fetchData();
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 12px', marginBottom: '10px',
    borderRadius: '8px', border: '1px solid #cbd5e1',
    fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
  };
  const card: React.CSSProperties = {
    background: 'white', padding: '24px', borderRadius: '14px',
    marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  };
  const navBtn = (tab: string): React.CSSProperties => ({
    width: '100%', textAlign: 'left', padding: '11px 14px',
    background: activeTab === tab ? 'rgba(255,255,255,0.12)' : 'transparent',
    border: 'none', color: 'white', cursor: 'pointer', borderRadius: '8px',
    fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px',
    transition: 'background 0.2s',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* ── Sidebar ── */}
      <div style={{ width: '240px', background: 'var(--isbank-blue)', color: 'white', padding: '28px 16px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <h2 style={{ color: 'var(--yesilay-green)', marginBottom: '32px', fontSize: '1.2rem' }}>⚙️ Admin Panel</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <button style={navBtn('stats')} onClick={() => setActiveTab('stats')}><i className="fa-solid fa-chart-pie" /> İstatistikler</button>
          <button style={navBtn('podcasts')} onClick={() => setActiveTab('podcasts')}><i className="fa-solid fa-headphones" /> Podcastler</button>
          <button style={navBtn('videocasts')} onClick={() => setActiveTab('videocasts')}><i className="fa-solid fa-video" /> Videocastler</button>
          <button style={navBtn('articles')} onClick={() => setActiveTab('articles')}><i className="fa-solid fa-file-lines" /> Makaleler</button>
        </nav>
        <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', marginTop: '16px' }}>
          <i className="fa-solid fa-right-from-bracket" /> Çıkış Yap
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, padding: '36px', overflowY: 'auto' }}>

        {/* İSTATİSTİKLER */}
        {activeTab === 'stats' && (
          <div>
            <h2 style={{ marginBottom: '24px', color: 'var(--isbank-blue)' }}>Test İstatistikleri</h2>
            {stats ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {[
                  { label: 'Toplam', value: stats.Total, color: 'var(--isbank-blue)' },
                  { label: 'Düşük Risk', value: stats.Low, color: '#16a34a' },
                  { label: 'Orta Risk', value: stats.Medium, color: '#d97706' },
                  { label: 'Yüksek Risk', value: stats.High, color: '#dc2626' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'white', padding: '24px', borderRadius: '14px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <p style={{ color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>{s.label}</p>
                    <p style={{ fontSize: '2.8rem', fontWeight: 800, color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            ) : <p style={{ color: '#64748b' }}>Yükleniyor...</p>}
          </div>
        )}

        {/* PODCAST YÖNETİMİ */}
        {activeTab === 'podcasts' && (
          <div>
            <h2 style={{ marginBottom: '24px', color: 'var(--isbank-blue)' }}>Podcast Yönetimi</h2>
            <div style={card}>
              <h3 style={{ marginBottom: '16px' }}>🎙️ Yeni Podcast Ekle</h3>
              <form onSubmit={handleAddPodcast}>
                <input style={inp} placeholder="Başlık *" value={podForm.title} onChange={e => setPodForm(p => ({ ...p, title: e.target.value }))} required />
                <input style={inp} placeholder="Süre (örn: 42 DAKİKA) *" value={podForm.duration} onChange={e => setPodForm(p => ({ ...p, duration: e.target.value }))} required />
                <textarea style={{ ...inp, minHeight: '80px', resize: 'vertical' }} placeholder="Açıklama" value={podForm.description} onChange={e => setPodForm(p => ({ ...p, description: e.target.value }))} />

                <FileUpload
                  label="Ses Dosyası *"
                  accept=".mp3,.wav,.ogg,.m4a"
                  bucket="podcasts"
                  hint="Desteklenen formatlar: MP3, WAV, OGG, M4A (maks. 100 MB)"
                  onUploaded={url => setPodForm(p => ({ ...p, audio_url: url }))}
                />
                <FileUpload
                  label="Kapak Görseli (opsiyonel)"
                  accept=".jpg,.jpeg,.png,.webp"
                  bucket="article-covers"
                  hint="Desteklenen formatlar: JPG, PNG, WebP (maks. 5 MB)"
                  onUploaded={url => setPodForm(p => ({ ...p, image_url: url }))}
                />

                <button type="submit" disabled={submitting || !podForm.audio_url} className="btn btn-primary" style={{ marginTop: '8px', opacity: submitting || !podForm.audio_url ? 0.6 : 1 }}>
                  {submitting ? '⏳ Kaydediliyor...' : '✅ Podcast Ekle'}
                </button>
              </form>
            </div>

            <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: '14px', textAlign: 'left' }}>Başlık</th>
                    <th style={{ padding: '14px', textAlign: 'left' }}>Süre</th>
                    <th style={{ padding: '14px', textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {podcasts.length === 0 ? (
                    <tr><td colSpan={3} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Henüz podcast yok</td></tr>
                  ) : podcasts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '14px', fontWeight: 600 }}>{p.title}</td>
                      <td style={{ padding: '14px', color: '#64748b' }}>{p.duration}</td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button onClick={() => deleteItem('podcasts', p.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIDEOCAST YÖNETİMİ */}
        {activeTab === 'videocasts' && (
          <div>
            <h2 style={{ marginBottom: '24px', color: 'var(--isbank-blue)' }}>Videocast Yönetimi</h2>
            <div style={card}>
              <h3 style={{ marginBottom: '16px' }}>🎬 Yeni Videocast Ekle</h3>
              <form onSubmit={handleAddVideocast}>
                <input style={inp} placeholder="Başlık *" value={vidForm.title} onChange={e => setVidForm(p => ({ ...p, title: e.target.value }))} required />
                <input style={inp} placeholder="Kategori (örn: UZMAN GÖRÜŞÜ) *" value={vidForm.category} onChange={e => setVidForm(p => ({ ...p, category: e.target.value }))} required />
                <textarea style={{ ...inp, minHeight: '80px', resize: 'vertical' }} placeholder="Açıklama" value={vidForm.description} onChange={e => setVidForm(p => ({ ...p, description: e.target.value }))} />

                <FileUpload
                  label="Video Dosyası *"
                  accept=".mp4,.mov,.webm"
                  bucket="videocasts"
                  hint="Desteklenen formatlar: MP4, MOV, WebM (maks. 500 MB)"
                  onUploaded={url => setVidForm(p => ({ ...p, video_url: url }))}
                />

                <button type="submit" disabled={submitting || !vidForm.video_url} className="btn btn-primary" style={{ marginTop: '8px', opacity: submitting || !vidForm.video_url ? 0.6 : 1 }}>
                  {submitting ? '⏳ Kaydediliyor...' : '✅ Videocast Ekle'}
                </button>
              </form>
            </div>

            <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: '14px', textAlign: 'left' }}>Başlık</th>
                    <th style={{ padding: '14px', textAlign: 'left' }}>Kategori</th>
                    <th style={{ padding: '14px', textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {videocasts.length === 0 ? (
                    <tr><td colSpan={3} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Henüz videocast yok</td></tr>
                  ) : videocasts.map(v => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '14px', fontWeight: 600 }}>{v.title}</td>
                      <td style={{ padding: '14px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '3px 10px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>{v.category}</span></td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button onClick={() => deleteItem('videocasts', v.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MAKALE YÖNETİMİ */}
        {activeTab === 'articles' && (
          <div>
            <h2 style={{ marginBottom: '24px', color: 'var(--isbank-blue)' }}>Makale Yönetimi</h2>
            <div style={card}>
              <h3 style={{ marginBottom: '16px' }}>📝 Yeni Makale Ekle</h3>
              <form onSubmit={handleAddArticle}>
                <input style={inp} placeholder="Makale Başlığı *" value={artForm.title} onChange={e => setArtForm(p => ({ ...p, title: e.target.value }))} required />
                <input style={inp} placeholder="Yazar Adı" value={artForm.author} onChange={e => setArtForm(p => ({ ...p, author: e.target.value }))} />
                <FileUpload
                  label="Kapak Görseli (opsiyonel)"
                  accept=".jpg,.jpeg,.png,.webp"
                  bucket="article-covers"
                  hint="JPG, PNG veya WebP formatı, maks. 5 MB"
                  onUploaded={url => setArtForm(p => ({ ...p, image_url: url }))}
                />
                <textarea style={{ ...inp, minHeight: '200px', resize: 'vertical' }} placeholder="Makale İçeriği *" value={artForm.content} onChange={e => setArtForm(p => ({ ...p, content: e.target.value }))} required />
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ marginTop: '8px', opacity: submitting ? 0.6 : 1 }}>
                  {submitting ? '⏳ Yayınlanıyor...' : '✅ Makaleyi Yayınla'}
                </button>
              </form>
            </div>

            <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: '14px', textAlign: 'left' }}>Başlık</th>
                    <th style={{ padding: '14px', textAlign: 'left' }}>Yazar</th>
                    <th style={{ padding: '14px', textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.length === 0 ? (
                    <tr><td colSpan={3} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Henüz makale yok</td></tr>
                  ) : articles.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '14px', fontWeight: 600 }}>{a.title}</td>
                      <td style={{ padding: '14px', color: '#64748b' }}>{a.author || '—'}</td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button onClick={() => deleteItem('articles', a.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
