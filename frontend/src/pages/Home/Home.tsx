import PostItem from "components/Home/PostItem";
import TeamItem from "components/Home/TeamItem";
import { FC } from "react";

const Home: FC = () => {
  return (
    <div className="home-container">
      <div className="home-wrapper sub-notice">
        <section className="section-container">
          <div className="section-top">
            <h2>공지게시판</h2>
          </div>
          <ul className="post-list">
            <li>
              <PostItem
                title="백엔드 v0.0.3 배포"
                content="안녕하세요 백엔드 v0.0.3 이 배포 되었습니다. 감사합니다."
                commentCount={7}
                likeCount={7}
                createdAt="2022.12.12"
                author="유비"
                imageURL="https://imagedelivery.net/R2WiK4wfRK3oBXTwjgzQfA/a6e027fa-1910-4a45-47f7-61d89bd30a00/blogThumbnail"
              />
            </li>
            <li>
              <PostItem
                title="[점검 완료] 익명게시판 관련 긴급 공지.."
                content="익명게시판에 긴급 버그를 발견해서 익명게시판 글쓰기는 잠시 닫도록 하겠습니다 ?"
                commentCount={7}
                likeCount={7}
                createdAt="2022.12.12"
                author="ycha"
              />
            </li>
          </ul>
        </section>
      </div>
      <div className="home-wrapper sub-team">
        <section className="section-container">
          <div className="section-top">
            <h2>팀원</h2>
          </div>
          <div className="team-list">
            <div className="team-list-item">
              <div className="name">이름</div>
              <div className="role">역할</div>
              <div className="position">포지션</div>
            </div>
            <ul>
              {Array.from({ length: 4 }, () => ({ name: "손흥민" })).map((item, idx) => (
                <TeamItem key={idx} name={item.name} />
              ))}
            </ul>
          </div>
        </section>
      </div>
      <div className="home-wrapper sub-board">
        <section className="section-container">
          <div className="section-top">
            <h2>자유게시판</h2>
          </div>
          <ul className="post-list">
            <li>
              <PostItem
                title="새로 프로젝트 완성했습니다~!"
                content="깃허브 활동에 따른 티어와 랭킹을 제공해주는 서비스입니다."
                commentCount={7}
                likeCount={7}
                createdAt="2022.12.12"
                author="sikang"
                imageURL="https://imagedelivery.net/R2WiK4wfRK3oBXTwjgzQfA/7bd138f3-42d6-468d-3fca-fd218099c900/blogThumbnail"
              />
            </li>
            <li>
              <PostItem
                title="새로 프로젝트 완성했습니다~!"
                content="깃허브 활동에 따른 티어와 랭킹을 제공해주는 서비스입니다."
                commentCount={7}
                likeCount={7}
                createdAt="2022.12.12"
                author="sikang"
                imageURL="https://imagedelivery.net/R2WiK4wfRK3oBXTwjgzQfA/de760e86-c99d-4bc3-6fd0-2f765756b000/blogThumbnail"
              />
            </li>
            <li>
              <PostItem
                title="새로 프로젝트 완성했습니다~!"
                content="깃허브 활동에 따른 티어와 랭킹을 제공해주는 서비스입니다."
                commentCount={7}
                likeCount={7}
                createdAt="2022.12.12"
                author="sikang"
              />
            </li>
            <li>
              <PostItem
                title="새로 프로젝트 완성했습니다~!"
                content="깃허브 활동에 따른 티어와 랭킹을 제공해주는 서비스입니다."
                commentCount={7}
                likeCount={7}
                createdAt="2022.12.12"
                author="sikang"
              />
            </li>
            <li>
              <PostItem
                title="여러분은 맥북 청소할때 스피커 부분은 어떻게 청소하시나요?"
                content="액정클리너 같은걸로 닦고있는데 스피커 사이에 낀 손떼는 안지워지더라고요"
                commentCount={7}
                likeCount={7}
                createdAt="2022.12.12"
                author="juhpark"
                imageURL="https://imagedelivery.net/R2WiK4wfRK3oBXTwjgzQfA/21a6cc15-e13e-4e6e-1a80-38ec12630b00/blogThumbnail"
              />
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Home;
