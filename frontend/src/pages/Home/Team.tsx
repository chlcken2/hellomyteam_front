import PostItem from "components/Home/PostItem";
import TeamItem from "components/Home/TeamItem";
import { FC } from "react";

const Team: FC = () => {
  return (
    <div>
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
        <div className="pagination-wrapper">페이지네이션</div>
      </section>
    </div>
  );
};

export default Team;
