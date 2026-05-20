import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const quizData = [
  {
    question: "Dijital oyunlara/bahislere harcadığınız zamanı kontrol etmekte zorlanıyor musunuz?",
    options: ["Hiçbir Zaman", "Bazen", "Sıklıkla", "Neredeyse Her Zaman"]
  },
  {
    question: "Oyun/bahis oynamadığınızda huzursuzluk veya sinirlilik hissediyor musunuz?",
    options: ["Hiçbir Zaman", "Bazen", "Sıklıkla", "Neredeyse Her Zaman"]
  },
  {
    question: "Gece geç saatlere kadar ekran başında kalıp ertesi günkü sorumluluklarınızı aksatıyor musunuz?",
    options: ["Hiçbir Zaman", "Bazen", "Sıklıkla", "Neredeyse Her Zaman"]
  },
  {
    question: "Kayıplarınızı telafi etmek için daha fazla para veya zaman harcama eğiliminde misiniz?",
    options: ["Hiçbir Zaman", "Bazen", "Sıklıkla", "Neredeyse Her Zaman"]
  },
  {
    question: "Ailenize veya arkadaşlarınıza dijital alışkanlıklarınız hakkında yalan söylediğiniz oldu mu?",
    options: ["Hiçbir Zaman", "Bazen", "Sıklıkla", "Neredeyse Her Zaman"]
  }
];

const getResult = (score: number) => {
  if (score <= 4) return {
    title: "Düşük Risk Grubu",
    text: "Harika! Dijital alışkanlıkların ve sınırların dengede görünüyor. Farkındalığını korumaya ve bilinçli bir tüketici olmaya devam et.",
    icon: "fa-face-smile",
    color: "#16a34a",
    bg: "rgba(22, 163, 74, 0.06)",
    showCall: false,
  };
  if (score <= 9) return {
    title: "Orta Risk Grubu",
    text: "Zaman zaman dijital dünyanın cazibesine kapılıyor gibisin. Dijital detoks yaparak süreci daha iyi kontrol altına alabilirsin.",
    icon: "fa-circle-exclamation",
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.06)",
    showCall: true,
  };
  return {
    title: "Yüksek Risk Grubu",
    text: "Zamanın ve kontrolün büyük bir kısmı dijital oyun ve bahislere kaymış gibi görünüyor. Lütfen profesyonel destek almaktan çekinme.",
    icon: "fa-triangle-exclamation",
    color: "#dc2626",
    bg: "rgba(220, 38, 38, 0.06)",
    showCall: true,
  };
};

const QuizSection: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleReset = () => {
    setStarted(false);
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setSelectedIdx(null);
    setAnimating(false);
  };

  const handleOptionClick = async (index: number) => {
    if (animating || selectedIdx !== null) return;
    setSelectedIdx(index);
    setAnimating(true);

    const finalScore = score + index;
    setScore(finalScore);

    // Kısa gecikme ile geç
    setTimeout(async () => {
      if (currentIndex < quizData.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelectedIdx(null);
        setAnimating(false);
      } else {
        setFinished(true);
        setAnimating(false);
        // Supabase'e kaydet
        let risk_level = "Düşük Risk Grubu";
        if (finalScore > 4 && finalScore <= 9) risk_level = "Orta Risk Grubu";
        else if (finalScore > 9) risk_level = "Yüksek Risk Grubu";
        try {
          await supabase.from('test_results').insert([{ score: finalScore, risk_level }]);
        } catch (e) {
          console.warn("Test sonucu kaydedilemedi:", e);
        }
      }
    }, 500);
  };

  const progressPercent = (currentIndex / quizData.length) * 100;
  const q = quizData[currentIndex];

  // ── Sonuç Ekranı ─────────────────────────────────────────────────────────────
  if (finished) {
    const result = getResult(score);
    return (
      <section id="test" className="test-section">
        <div className="quiz-result" style={{ background: result.bg, border: `2px solid ${result.color}22` }}>
          <div className="quiz-result-icon" style={{ color: result.color }}>
            <i className={`fa-solid ${result.icon}`} />
          </div>
          <div className="quiz-result-title" style={{ color: result.color }}>{result.title}</div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px 24px', marginBottom: '32px', display: 'inline-block' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: result.color }}>{score}</span>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}> / {(quizData.length - 1) * 3} puan</span>
          </div>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 36px', lineHeight: '1.7' }}>
            {result.text}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {result.showCall && (
              <a href="tel:115" className="btn btn-primary" style={{ padding: '14px 28px' }}>
                <i className="fa-solid fa-phone" /> Destek Hattı 115'i Ara
              </a>
            )}
            <button className="btn btn-outline" style={{ padding: '14px 28px' }} onClick={handleReset}>
              <i className="fa-solid fa-rotate-left" /> Testi Tekrarla
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── Başlangıç Ekranı ─────────────────────────────────────────────────────────
  if (!started) {
    return (
      <section id="test" className="test-section">
        <div className="quiz-intro">
          <i className="fa-solid fa-clipboard-question fa-3x icon-green" />
          <h2>Bağımlılık Riski Testi</h2>
          <p>
            Sadece 2 dakikanı ayırarak dijital oyun ve bahis bağımlılığı riskini anonim olarak ölçebilirsin.
            Erken farkındalık, özgürlüğün ilk adımıdır.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            <span><i className="fa-solid fa-check-circle" style={{ color: 'var(--yesilay-green)' }} /> 5 soru</span>
            <span><i className="fa-solid fa-check-circle" style={{ color: 'var(--yesilay-green)' }} /> 2 dakika</span>
            <span><i className="fa-solid fa-check-circle" style={{ color: 'var(--yesilay-green)' }} /> Tamamen anonim</span>
          </div>
          <button className="btn btn-primary" onClick={() => setStarted(true)}>
            TESTE BAŞLA <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </section>
    );
  }

  // ── Soru Ekranı ───────────────────────────────────────────────────────────────
  return (
    <section id="test" className="test-section">
      <div className="quiz-container">
        <div className="quiz-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Soru {currentIndex + 1} / {quizData.length}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--yesilay-green)' }}>
              {Math.round(progressPercent)}% tamamlandı
            </span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="quiz-body" style={{ marginTop: '28px' }}>
          <div className="quiz-question-text quiz-slide-in">{q.question}</div>
          <div className="quiz-options">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className={`option-btn ${selectedIdx === idx ? 'selected' : ''}`}
                onClick={() => handleOptionClick(idx)}
                disabled={selectedIdx !== null}
                style={{
                  opacity: selectedIdx !== null && selectedIdx !== idx ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    border: `2px solid ${selectedIdx === idx ? 'white' : 'var(--yesilay-green)'}`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                    color: selectedIdx === idx ? 'white' : 'var(--yesilay-green)',
                  }}>
                    {['A', 'B', 'C', 'D'][idx]}
                  </span>
                  {opt}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
