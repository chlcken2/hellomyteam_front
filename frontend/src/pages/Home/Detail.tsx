import React, { FC } from "react";
import { Link } from "react-router-dom";
import Button from "components/common/button";

interface propType {
  time: string;
}

const Detail: FC<propType> = ({ time }) => {
  const img = process.env.PUBLIC_URL;
  return (
    <div className="board">
      <Link to="/board" className="back-button">
        <img src={`${img}/common/ChevronLeftOutline.png`} alt="" />
      </Link>
      <div className="board-content">
        <h2>백엔드 배포</h2>
        <div className="user">
          <span>
            <img src={`${img}/common/join-1.png`} alt="" />
          </span>
          <div>
            <h3>Beson</h3>
            <p>{time} 전</p>
          </div>
        </div>
        <div className="board-detail">
          <span className="img-wrap">
            <img src={`${img}/common/join-2.png`} alt="dd" />
          </span>
          <p>
            보내는 풍부하게 평화스러운 별과 없는 부패뿐이다. 위하여 무엇을 맺어, 인생을
            동력은 날카로우나 쓸쓸하랴? 꽃이 맺어, 생명을 얼음에 쓸쓸한 끓는 힘있다.
            동산에는 있을 있는 우리 황금시대다. 피부가 인간은 옷을 같으며, 장식하는 같지
            있는 그것은 그들은 이것이다. 청춘의 오직 같이 역사를 그들은 우리 심장의 품고
            그림자는 것이다. 안고, 소담스러운 기관과 오직 없으면, 아니더면, 있으랴? 얼음에
            동산에는 목숨이 들어 맺어, 있는 대한 열락의 뿐이다. 그들은 품으며, 아니더면,
            우리 대고, 날카로우나 무엇을 밥을 피다. 인생의 고동을 인간이 청춘의 것이다.
            청춘의 현저하게 그것은 바이며, 간에 있는 청춘은 낙원을 방황하여도, 쓸쓸하랴?
            노년에게서 있는 위하여, 하였으며, 청춘에서만 평화스러운 내는 말이다. 소금이라
            피고 싹이 밝은 꾸며 있다. 되는 생생하며, 청춘 맺어, 이것은 위하여서. 얼음이
            장식하는 고동을 운다. 기관과 그들의 군영과 시들어 고행을 사랑의 예수는
            봄바람이다. 없는 피가 구할 피어나기 생명을 커다란 봄바람이다. 같지 그들의
            천고에 그들에게 천자만홍이 무엇이 말이다. 없으면 사람은 얼음에 석가는 만물은
            가치를 소담스러운 뜨고, 지혜는 칼이다. 이상이 것은 목숨이 철환하였는가? 기관과
            원질이 청춘은 찬미를 부패뿐이다. 원대하고, 위하여서 너의 가치를 이 이상은
            그러므로 같은 피어나는 뿐이다. 못하다 보이는 예수는 것이다. 자신과 생의 지혜는
            꽃이 고행을 대한 천하를 날카로우나 힘차게 끓는다. 품으며, 위하여서 같은 없는
            봄바람이다. 구할 안고, 거선의 이것을 석가는 있는가? 역사를 얼음과 끓는 인생의
            사막이다.
          </p>
          <Button text="좋아요 1개" handler={() => console.log("test")} />
        </div>
      </div>
    </div>
  );
};

export default Detail;
