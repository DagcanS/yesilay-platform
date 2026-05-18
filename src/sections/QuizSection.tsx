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

const QuizSection: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleStart = () => setStarted(true);

  const handleOptionClick = async (index: number) => {
    const finalScore = score + index;
    setScore(finalScore);
    
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
      // Determine risk level based on finalScore
      let risk_level = "Düşük Risk Grubu";
      if (finalScore > 4 && finalScore <= 9) risk_level = "Orta Risk Grubu";
      else if (finalScore > 9) risk_level = "Yüksek Risk Grubu";

      try {
        const { error } = await supabase.from('test_results').insert([{ score: finalScore, risk_level }]);
        if (error) console.error("Test sonucu kaydedilemedi:", error);
      } catch (e) {
        console.error("Test sonucu kaydedilemedi:", e);
      }
    }
  };

  const getResults = () => {
    if (score <= 4) {
      return {
        title: "Düşük Risk Grubu",
        text: "Harika! Dijital alışkanlıkların ve sınırların dengede görünüyor. Farkındalığını korumaya ve bilinçli bir tüketici olmaya devam et.",
        icon: "fa-face-smile",
        color: "var(--yesilay-green)"
      };
    } else if (score <= 9) {
      return {
        title: "Orta Risk Grubu",
        text: "Zaman zaman dijital dünyanın cazibesine kapılıyor gibisin. Bağımlılık riski taşımamak adına dijital detokslar yaparak süreci daha iyi kontrol altına alabilirsin.",
        icon: "fa-circle-exclamation",
        color: "#d97706"
      };
    } else {
      return {
        title: "Yüksek Risk Grubu",
        text: "Zamanın ve kontrolün büyük bir kısmı dijital oyun ve bahislere kaymış gibi görünüyor. Lütfen profesyonel destek almaktan çekinme.",
        icon: "fa-triangle-exclamation",
        color: "var(--isbank-blue)"
      };
    }
  };

  if (finished) {
    const result = getResults();
    return (
      <section id="test" className="test-section">
        <div className="quiz-result">
          <div className="quiz-result-icon" style={{ color: result.color }}>
            <i className={`fa-solid ${result.icon}`}></i>
          </div>
          <div className="quiz-result-title" style={{ color: result.color }}>{result.title}</div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 30px', lineHeight: '1.6' }}>
            {result.text}
          </p>
          {score > 4 && (
            <a href="tel:115" className="btn btn-primary" style={{ marginRight: '15px', padding: '15px 30px' }}>
              <i className="fa-solid fa-phone"></i> YEDAM 115'i Ara
            </a>
          )}
          <button className="btn btn-outline" style={{ padding: '15px 30px' }} onClick={() => window.location.reload()}>
            Başa Dön
          </button>
        </div>
      </section>
    );
  }

  if (!started) {
    return (
      <section id="test" className="test-section">
        <div className="quiz-intro">
          <i className="fa-solid fa-clipboard-question fa-3x icon-green"></i>
          <h2>Bağımlılık Riski Testi</h2>
          <p>
            Sadece 2 dakikanı ayırarak dijital oyun ve bahis bağımlılığı riskini anonim olarak ölçebilirsin. 
            Erken farkındalık, özgürlüğün ilk adımıdır.
          </p>
          <button className="btn btn-primary" onClick={handleStart}>
            TESTE BAŞLA <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </section>
    );
  }

  const q = quizData[currentIndex];
  const progressPercent = (currentIndex / quizData.length) * 100;

  return (
    <section id="test" className="test-section">
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p style={{ marginTop: '10px' }}>Soru {currentIndex + 1}/{quizData.length}</p>
        </div>
        <div className="quiz-body">
          <div className="quiz-question-text quiz-slide-in">{q.question}</div>
          <div className="quiz-options">
            {q.options.map((opt, idx) => (
              <button key={idx} className="option-btn" onClick={() => handleOptionClick(idx)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
