import PostItem from "components/Home/PostItem";
import { FC } from "react";
import "styles/pages/home.scss";

const Home: FC<any> = () => {
  return (
    <div className="home-container">
      <div className="home-left-wrapper">
        <section className="section-contaner">
          <h2 className="section-title">공지게시판</h2>
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
        <section className="section-contaner">
          <h2 className="section-title">팀원</h2>
        </section>
      </div>
      <div className="home-right-wrapper">
        <section className="section-contaner">
          <h2 className="section-title">자유게시판</h2>
        </section>
      </div>
    </div>
  );
};

export default Home;
