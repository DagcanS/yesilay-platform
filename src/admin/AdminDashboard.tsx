import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState<any>(null);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [videocasts, setVideocasts] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      } else {
        fetchData();
      }
    };
    checkSession();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch Podcasts
      const { data: podData } = await supabase.from('podcasts').select('*').order('created_at', { ascending: false });
      if (podData) setPodcasts(podData);

      // Fetch Videocasts
      const { data: vidData } = await supabase.from('videocasts').select('*').order('created_at', { ascending: false });
      if (vidData) setVideocasts(vidData);

      // Fetch Articles
      const { data: artData } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (artData) setArticles(artData);

      // Fetch Stats
      const { data: testData } = await supabase.from('test_results').select('risk_level');
      if (testData) {
        let total = testData.length;
        let low = testData.filter(t => t.risk_level === 'Düşük Risk Grubu').length;
        let medium = testData.filter(t => t.risk_level === 'Orta Risk Grubu').length;
        let high = testData.filter(t => t.risk_level === 'Yüksek Risk Grubu').length;
        setStats({ Total: total, Low: low, Medium: medium, High: high });
      }

    } catch (error) {
      console.error("Data fetch error", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const deleteItem = async (type: string, id: number) => {
    if (!window.confirm("Bu öğeyi silmek istediğinize emin misiniz?")) return;
    try {
      await supabase.from(type).delete().eq('id', id);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Forms logic
  const handleAddPodcast = async (e: any) => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      duration: e.target.duration.value,
      description: e.target.description.value,
      audio_url: e.target.audio_url.value
    };
    await supabase.from('podcasts').insert([data]);
    e.target.reset();
    fetchData();
  };

  const handleAddVideocast = async (e: any) => {
    e.preventDefault();
    const data = {
      category: e.target.category.value,
      categoryColor: 'var(--isbank-blue)',
      title: e.target.title.value,
      description: e.target.description.value,
      video_url: e.target.video_url.value
    };
    await supabase.from('videocasts').insert([data]);
    e.target.reset();
    fetchData();
  };

  const handleAddArticle = async (e: any) => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      author: e.target.author.value,
      content: e.target.content.value,
      image_url: e.target.image_url.value
    };
    await supabase.from('articles').insert([data]);
    e.target.reset();
    fetchData();
  };

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: 'var(--isbank-blue)', color: 'white', padding: '30px 20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '40px', color: 'var(--yesilay-green)' }}>Admin Panel</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <li>
            <button onClick={() => setActiveTab('stats')} style={{ width: '100%', textAlign: 'left', padding: '10px', background: activeTab === 'stats' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '6px' }}>
              <i className="fa-solid fa-chart-pie"></i> İstatistikler
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('podcasts')} style={{ width: '100%', textAlign: 'left', padding: '10px', background: activeTab === 'podcasts' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '6px' }}>
              <i className="fa-solid fa-headphones"></i> Podcastler
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('videocasts')} style={{ width: '100%', textAlign: 'left', padding: '10px', background: activeTab === 'videocasts' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '6px' }}>
              <i className="fa-solid fa-video"></i> Videocastler
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('articles')} style={{ width: '100%', textAlign: 'left', padding: '10px', background: activeTab === 'articles' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '6px' }}>
              <i className="fa-solid fa-file-lines"></i> Makaleler
            </button>
          </li>
        </ul>
        <button onClick={handleLogout} style={{ marginTop: 'auto', background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
          <i className="fa-solid fa-right-from-bracket"></i> Çıkış Yap
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {activeTab === 'stats' && (
          <div>
            <h2 style={{ marginBottom: '30px', color: 'var(--isbank-blue)' }}>Test İstatistikleri</h2>
            {stats && (
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', flex: 1, textAlign: 'center' }}>
                  <h3 style={{ color: 'var(--text-secondary)' }}>Toplam Çözülen</h3>
                  <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--isbank-blue)' }}>{stats.Total}</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', flex: 1, textAlign: 'center' }}>
                  <h3 style={{ color: 'var(--yesilay-green)' }}>Düşük Risk</h3>
                  <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.Low}</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', flex: 1, textAlign: 'center' }}>
                  <h3 style={{ color: '#d97706' }}>Orta Risk</h3>
                  <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.Medium}</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', flex: 1, textAlign: 'center' }}>
                  <h3 style={{ color: '#ef4444' }}>Yüksek Risk</h3>
                  <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.High}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'podcasts' && (
          <div>
            <h2 style={{ marginBottom: '30px', color: 'var(--isbank-blue)' }}>Podcast Yönetimi</h2>
            <form onSubmit={handleAddPodcast} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: 'var(--shadow-sm)' }}>
              <h3>Yeni Podcast Ekle</h3>
              <input name="title" placeholder="Başlık" required style={inputStyle} />
              <input name="duration" placeholder="Süre (Örn: 45 DAKİKA)" required style={inputStyle} />
              <textarea name="description" placeholder="Açıklama" style={{...inputStyle, minHeight: '80px'}}></textarea>
              <input name="audio_url" placeholder="Ses Dosyası Linki (örn: /dummy.mp3)" required style={inputStyle} />
              <button type="submit" className="btn btn-primary">Ekle</button>
            </form>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Başlık</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {podcasts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '15px' }}>{p.id}</td>
                      <td style={{ padding: '15px', fontWeight: 600 }}>{p.title}</td>
                      <td style={{ padding: '15px', textAlign: 'right' }}>
                        <button onClick={() => deleteItem('podcasts', p.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'videocasts' && (
          <div>
            <h2 style={{ marginBottom: '30px', color: 'var(--isbank-blue)' }}>Videocast Yönetimi</h2>
            <form onSubmit={handleAddVideocast} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: 'var(--shadow-sm)' }}>
              <h3>Yeni Videocast Ekle</h3>
              <input name="title" placeholder="Başlık" required style={inputStyle} />
              <input name="category" placeholder="Kategori (Örn: UZMAN GÖRÜŞÜ)" required style={inputStyle} />
              <textarea name="description" placeholder="Açıklama" style={{...inputStyle, minHeight: '80px'}}></textarea>
              <input name="video_url" placeholder="Video Dosyası Linki (örn: /dummy.mp4)" required style={inputStyle} />
              <button type="submit" className="btn btn-primary">Ekle</button>
            </form>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Başlık</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {videocasts.map(v => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '15px' }}>{v.id}</td>
                      <td style={{ padding: '15px', fontWeight: 600 }}>{v.title}</td>
                      <td style={{ padding: '15px', textAlign: 'right' }}>
                        <button onClick={() => deleteItem('videocasts', v.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div>
            <h2 style={{ marginBottom: '30px', color: 'var(--isbank-blue)' }}>Makale Yönetimi</h2>
            <form onSubmit={handleAddArticle} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: 'var(--shadow-sm)' }}>
              <h3>Yeni Makale Ekle</h3>
              <input name="title" placeholder="Makale Başlığı" required style={inputStyle} />
              <input name="author" placeholder="Yazar Adı" required style={inputStyle} />
              <input name="image_url" placeholder="Kapak Görseli Linki" style={inputStyle} />
              <textarea name="content" placeholder="Makale İçeriği (Paragraflar halinde yazabilirsiniz)" required style={{...inputStyle, minHeight: '150px'}}></textarea>
              <button type="submit" className="btn btn-primary">Yayınla</button>
            </form>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Başlık</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '15px' }}>{a.id}</td>
                      <td style={{ padding: '15px', fontWeight: 600 }}>{a.title}</td>
                      <td style={{ padding: '15px', textAlign: 'right' }}>
                        <button onClick={() => deleteItem('articles', a.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>Sil</button>
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
