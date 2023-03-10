import { FC } from "react";

const Profile: FC = () => {
  return (
    <div className="profile-container">
      <img
        className="profile-banner-img"
        src="https://imagedelivery.net/R2WiK4wfRK3oBXTwjgzQfA/3f4d0f13-a115-4e0c-b757-3b80977c4d00/galleryThumbnail"
        alt="profile-banner"
      />
      <div className="profile-intro-container">
        <img
          className="profile-intro-img"
          alt="profile"
          src="https://imagedelivery.net/R2WiK4wfRK3oBXTwjgzQfA/7d3a2ac1-d4ad-44e7-956e-0977ecb3f700/blogThumbnail"
        />
        <h2 className="profile-intro-name">손흥민</h2>
        <p className="profile-intro-message">안녕하세요. 손흥민입니다. 잘부탁드려요.</p>
        <div className="profile-intro-state">
          휴식중💤, 열정🔥, 부상🩼, 파견✈️, 여행중🏝
        </div>
      </div>
      <div className="profile-info-card-container">
        <div className="profile-info-card">
          <h3 className="info-title">기본</h3>
          <div className="info-container">
            <div className="info-wrapper">
              <div className="info-label">이름</div>
              <div className="info-content">손흥민</div>
            </div>
            <div className="info-wrapper">
              <div className="info-label">한줄소개</div>
              <div className="info-content">안녕하세요. 손흥민입니다.</div>
            </div>
            <div className="info-wrapper">
              <div className="info-label">생년월일</div>
              <div className="info-content">2021/12/20</div>
            </div>
          </div>
        </div>
        <div className="profile-info-card">
          <h3 className="info-title">팀</h3>
          <div className="info-container">
            <div className="info-wrapper">
              <div className="info-label">역할</div>
              <div className="info-content">공격수</div>
            </div>
            <div className="info-wrapper">
              <div className="info-label">등번호</div>
              <div className="info-content">1</div>
            </div>
            <div className="info-wrapper">
              <div className="info-label">선호 포지션</div>
              <div className="info-content">공격수</div>
            </div>
            <div className="info-wrapper">
              <div className="info-label">약발정보</div>
              <div className="info-content">오른발</div>
            </div>
          </div>
        </div>
        <div className="profile-info-card">
          <h3 className="info-title">기타</h3>
          <div className="info-container">
            <div className="info-wrapper">
              <div className="info-label">컨디션</div>
              <div className="info-content">0</div>
            </div>
            <div className="info-wrapper">
              <div className="info-label">주량</div>
              <div className="info-content">0잔</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
