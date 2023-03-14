import Comment from "components/common/comment";
import { useState } from "react";
import "../styles/components/common.scss";

const text =
  "없으면 사람은 얼음에 석가는 만물은 가치를 소담스러운 뜨고, 지혜는 칼이다.이상이 것은 목숨이 철환하였는가? 기관과 원질이 청춘은 찬미를 부패뿐이다.원대하고, 위하여서 너의 가치를 이 이상은 그러므로 같은 피어나는 뿐이다. 못하다보이는 예수는 것이다. 자신과 생의 지혜는 꽃이 고행을 대한 천하를 날카로우나힘차게 끓는다. 품으며, 위하여서 같은 없는 봄바람이다. 구할 안고, 거선의 이것을석가는 있는가? 역사를 얼음과 끓는 인생의 사막이다.";
const writer = "Beson";
const test = true;

const FindTeam = () => {
  const [value, setValue] = useState<string>(text);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="main-wrap">
      <h1 className="main-title">팀 찾기</h1>
      <Comment
        text={value}
        writer={writer}
        myComment={test}
        date="2023.02.01"
        editHandler={handleChange}
      />
    </div>
  );
};

export default FindTeam;
