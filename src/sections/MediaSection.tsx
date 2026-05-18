import React from 'react';
import { Link } from 'react-router-dom';

const MediaSection: React.FC = () => {
  return (
    <section id="podcasts" className="media-section">
      <div className="media-container">
        <div className="media-block">
          <h3><i className="fa-solid fa-podcast"></i> Podcast Serileri</h3>
          <div className="podcast-list">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="media-item">
                <div className="play-btn"><i className="fa-solid fa-play"></i></div>
                <div className="media-info">
                  <strong>Bölüm {num}: Kumar ve Bahis Bağımlılığı</strong>
                  <p>Farkındalık ve korunma yolları üzerine.</p>
                </div>
                <audio controls className="custom-audio">
                  <source src="/dummy.mp3" type="audio/mpeg" />
                </audio>
              </div>
            ))}
            <Link to="/podcast" className="media-link link-blue">Tüm podcastleri dinle <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
        </div>

        <div id="videocasts" className="media-block">
          <h3><i className="fa-solid fa-video"></i> Videocast Serileri</h3>
          <div className="videocast-list">
            <div className="media-item videocast-item">
              <video controls>
                <source src="/dummy.mp4" type="video/mp4" />
              </video>
              <div className="videocast-info">
                <strong>Hikayeler: Dönüşüm Yolu</strong>
                <p>Bağımlılıktan kurtulan bir gencin hikayesi.</p>
              </div>
            </div>
            <Link to="/videocast" className="media-link link-green">Tüm videocastleri izle <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
