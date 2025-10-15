import React from "react";
import "./Agenda.css";

function Agenda() {
  return (
    <div className="fptu-halloween-agenda-container">
      <header className="fptu-halloween-contact-header">
        <div className="fptu-halloween-contact-banner">
          <h1 className="fptu-halloween-contact-banner-title">
            AGENDA - SƠ ĐỒ SỰ KIỆN
          </h1>
        </div>
      </header>
      
      <div className="fptu-halloween-agenda-content">
        <div className="fptu-halloween-agenda-grid">
          {/* Cột trái: Agenda */}
          <div className="fptu-halloween-agenda-column">
            <div className="fptu-halloween-agenda-card">
              <h2 className="fptu-halloween-agenda-card-title">
                📅 Lịch trình sự kiện
              </h2>
              <div className="fptu-halloween-agenda-a4-frame">
                <img 
                  src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/484283385_624560113765882_92212265454988108_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFlOr6JKwL06S9ApGO3gSrmVc02ONLzEKFVzTY40vMQoaUjgsNvEEV3jVfO6-RWJW5ZzMj_AnkCNSyv7wesnrJn&_nc_ohc=ogq1uE7uqsMQ7kNvwHIYvaB&_nc_oc=AdmfJzG6CcmgC6e5p_4kUoXeMW2EENeDEij7r8V49xYpTpvxGXzS74xNYnZrSE5hm-w&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=eSBIwYn_CNv-pFQSH1A2Uw&oh=00_Afe2f-URObizv_FW2189tUrYyoZZ_WNjDmbHeQR7A1HubA&oe=68F40B44" 
                  alt="Agenda Schedule"
                  className="fptu-halloween-agenda-image"
                />
                
              </div>
            </div>
          </div>

          {/* Cột phải: Sơ đồ sự kiện */}
          <div className="fptu-halloween-agenda-column">
            <div className="fptu-halloween-agenda-card">
              <h2 className="fptu-halloween-agenda-card-title">
                🗺️ Sơ đồ sự kiện
              </h2>
              <div className="fptu-halloween-agenda-a4-frame">
                <img 
                  src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/484536117_624561393765754_6621730184879740259_n.jpg?stp=dst-jpg_s720x720_tt6&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHAh9ytn1yCsUpTKY3AMNtPM1iyJZeTfTEzWLIll5N9MRQ2V2lr1GnshQXKw146tezP6ydEyPLsVliaI2c6vxTU&_nc_ohc=J2BJsCflo5QQ7kNvwHQa_vi&_nc_oc=Adla8SuDFg4rxLC0YBhN9yS2GYUlB4dZk5AtzfuBf6ViJp2R0UFgIiOFFXK2t_ZYSzE&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=rpRldtRiWRFg_5J4H_YJ4w&oh=00_AffDycgW6jkhw2xTBFTZJsNhB42-zhAV9DfpsWzfFNCZNQ&oe=68F3DC16" 
                  alt="Event Map"
                  className="fptu-halloween-agenda-image"
                />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Agenda;
