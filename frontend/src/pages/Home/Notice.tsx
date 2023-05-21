import PostItem from "components/Home/PostItem";
import { FC } from "react";

const Notice: FC = () => {
  return (
    <div>
      <section className="section-container">
        <div className="section-top">
          <h2>공지게시판</h2>
          <div className="option-box">
            <div className="sort-box">
              <span className="sort-type">최신순</span>
              <div className="icon-box">
                <span>
                  <img className="active" src="/icons/arrow_down.svg" alt="arrow-down" />
                </span>
                <span>
                  <img src="/icons/arrow_up.svg" alt="arrow-up" />
                </span>
              </div>
            </div>
            <div className="sort-box">
              <span className="sort-type">좋아요</span>
              <div className="icon-box">
                <span>
                  <img src="/icons/arrow_down.svg" alt="arrow-down" />
                </span>
                <span>
                  <img src="/icons/arrow_up.svg" alt="arrow-up" />
                </span>
              </div>
            </div>
          </div>
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
        <div className="pagination-wrapper">페이지네이션</div>
      </section>
    </div>
  );
};

export default Notice;
