import React from "react";
import "./TicketGame.css";

function TicketGame() {
  return (
    <div className="fptu-halloween-ticket-game-container">
      <header className="fptu-halloween-contact-header">
        <div className="fptu-halloween-contact-banner">
          <h1 className="fptu-halloween-contact-banner-title">
            BIG GAME HALLOWEEN
          </h1>
        </div>
      </header>

      <div className="fptu-halloween-ticket-game-content">
        {/* Hàng 1: Ảnh A4 + Quy chế thi */}
        <div className="fptu-halloween-ticket-game-row">
          <div className="fptu-halloween-ticket-game-grid">
            {/* Cột 1: Ảnh A4 */}
            <div className="fptu-halloween-ticket-game-column">
              <div className="fptu-halloween-ticket-game-card">
                <h2 className="fptu-halloween-ticket-game-card-title">
                  🎮 Hướng dẫn đăng kí
                </h2>
                <div className="fptu-halloween-ticket-game-a4-landscape">
                  <img
                    // src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/484283385_624560113765882_92212265454988108_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFlOr6JKwL06S9ApGO3gSrmVc02ONLzEKFVzTY40vMQoaUjgsNvEEV3jVfO6-RWJW5ZzMj_AnkCNSyv7wesnrJn&_nc_ohc=ogq1uE7uqsMQ7kNvwHIYvaB&_nc_oc=AdmfJzG6CcmgC6e5p_4kUoXeMW2EENeDEij7r8V49xYpTpvxGXzS74xNYnZrSE5hm-w&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=eSBIwYn_CNv-pFQSH1A2Uw&oh=00_Afe2f-URObizv_FW2189tUrYyoZZ_WNjDmbHeQR7A1HubA&oe=68F40B44"
                    alt="Ticket Game Information"
                    className="fptu-halloween-ticket-game-image"
                  />
                </div>
              </div>
            </div>

            {/* Cột 2: Quy chế thi */}
            <div className="fptu-halloween-ticket-game-column">
              <div className="fptu-halloween-ticket-game-card">
                <h2 className="fptu-halloween-ticket-game-card-title">
                  📋 Thể lệ cuộc thi
                </h2>
                <div className="fptu-halloween-ticket-game-rules">
                  <div className="fptu-halloween-ticket-game-rule-item">
                    <h3>⏰ Thời gian dự thi </h3>
                    <p>
                      <strong>Vòng đơn (14/10/2025 - 22/10/2025) </strong>
                      <br />
                      Đăng ký các đội chơi tham gia và sau khi đóng đơn sẽ gặp
                      mặt và phổ biến luật chơi <br />
                      <strong>LƯU Ý </strong>
                      <br></br>TRONG TRƯỜNG HỢP ĐỦ 4 ĐỘI CHƠI, BTC SẼ ĐÓNG ĐƠN
                      SỚM HƠN DỰ KIẾN! <br />
                      <strong>Vòng công bố (31/10/2025) </strong>
                      <br />
                      Công bố top 3 đội thi chiến thắng và cao điểm nhất
                    </p>
                  </div>
                  <div className="fptu-halloween-ticket-game-rule-item">
                    <h3>🎯 Thông tin quan trọng</h3>
                    <p>
                      <strong>Thời gian tham gia dự kiến</strong>
                      <br />
                      16h00 - 17h00 ngày 31/10/2025
                      <br />
                      <strong>Đối tượng tham gia</strong>
                      <br></br> Sinh viên Đại học FPT Hà Nội
                      <br />
                      <strong>Hình thức</strong>
                      <br /> 4 đội chơi tham gia chuỗi game chặng.<br></br> Đăng
                      ký tham gia theo đội 4 người
                    </p>
                  </div>
                  <div className="fptu-halloween-ticket-game-rule-item">
                    <h3>💵 Phí cam kết</h3>
                    <p>
                      <strong>
                        Mỗi đội chơi tham gia cần đóng 200.000 VNĐ (50.000
                        VNĐ/người).
                      </strong>
                      <br /> Các đại diện nhóm chuyển khoản và gắn ảnh cap màn
                      hình bill vào form, phí cam kết sẽ được HOÀN TRẢ 100% sau
                      khi chương trình kết thúc với điều kiện tất cả các thành
                      viên trong đội phải có mặt và tham gia chơi cùng nhau vào
                      ngày D-Day theo đúng lịch trình và sự sắp xếp từ Ban Tổ
                      Chức.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hàng 2: Button Form + Ảnh cuộc thi */}
        <div className="fptu-halloween-ticket-game-row">
          <div className="fptu-halloween-ticket-game-grid">
            {/* Cột 1: Button Google Form */}
            <div className="fptu-halloween-ticket-game-column">
              <div className="fptu-halloween-ticket-game-form-section">
                <h2 className="fptu-halloween-ticket-game-form-title">
                  🎫 Đăng ký tham gia
                </h2>
                <p className="fptu-halloween-ticket-game-form-description">
                  Bước vào thế giới của Joker - nơi những lá bài cầm quyền, và
                  số phận nằm trong tay kẻ chủ tể điên loạn. Đây không phải giấc
                  mơ, cũng chẳng phải trò đùa. Đây là quán rượu ma quái chỉ xuất
                  hiện vào đêm Halloween và giờ các bạn đã mắc bẫy.
                </p>
                <p className="fptu-halloween-ticket-game-form-description">
                  Lối thoát? Nó ẩn đằng sau bốn chặng thử thách sinh tử mà Joker
                  đã ủ mưu từ lâu. Mỗi chặng là một mảnh linh hồn vỡ vụn của hắn
                  - nơi nỗi đau biến thành cạm bẫy, nơi điên loạn trở thành luật
                  chơi. Chỉ có những kẻ đủ mạnh để đương đầu, đủ thông minh để
                  giải mã, và đủ đoàn kết để không bỏ rơi nhau, mới có thể tìm
                  thấy ánh sáng cuối con đường. Liệu các bạn đã sẵn sàng bước
                  qua từng chặng game tàn khốc để tìm đường sống chưa?
                </p>
                <a
                  href="https://forms.gle/BViHc5dYp9HxgKCo6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fptu-halloween-ticket-game-form-button"
                >
                  <span className="fptu-halloween-ticket-game-form-button-text">
                    Đăng ký ngay
                  </span>
                </a>
              </div>
            </div>

            {/* Cột 2: Ảnh cuộc thi */}
            <div className="fptu-halloween-ticket-game-column">
              <div className="fptu-halloween-ticket-game-card">
                <h2 className="fptu-halloween-ticket-game-card-title">
                  🏆 Giải thưởng
                </h2>
                <div className="fptu-halloween-ticket-game-contest-image">
                  <img
                    src="https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/559931166_796701486551743_3924727687750535218_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFCmi3Lc2cQ700TyEh7_Evwroi812cILyCuiLzXZwgvIHqLAP6iEVxpqghPZuVxBWscjR9v5rb14-G6vb3beFR6&_nc_ohc=oXd-5DFqNrMQ7kNvwGDzlfd&_nc_oc=Adk74Mvl9drPX2FLjy8Mln-o7RH49Yj3Yt_fJN2sGw-VFxAEHfPfB1YdtpLOgzumGW4&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=RWYKl3TDK4fWqfy75rt7nA&oh=00_Afe2FxJdKJaqmC64wfaCDZc13iOJRskn2vq8bsnuMz3p5w&oe=68F45288"
                    alt="Contest Image"
                    className="fptu-halloween-ticket-game-contest-img"
                  />
                </div>
                <p
                  style={{ color: '#E63946', fontWeight: '700', padding: "0px" , margin: '0px', marginTop: '25px'}}
                  className="fptu-halloween-ticket-game-form-description"
                >
                  Tổng giá trị giải thưởng: 8.000.000 VNĐ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketGame;
