import React from 'react';

const SupportSection: React.FC = () => {
  return (
    <section id="support" className="support-section">
      <div className="support-container">
        <h2>Yalnız Değilsin.</h2>
        <p>
          Yeşilay Danışmanlık Merkezi (YEDAM) her an yanında. 
          Ücretsiz, isimsiz ve tamamen gizli destek için uzmanlarımıza ulaşın.
        </p>
        <div className="support-btns">
          <a href="tel:115" className="btn btn-phone">
            <i className="fa-solid fa-phone-volume"></i> 115
          </a>
          <a href="https://www.yedam.org.tr" target="_blank" rel="noopener noreferrer" className="btn btn-outline-white">
            YEDAM SİTESİNE GİT
          </a>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
