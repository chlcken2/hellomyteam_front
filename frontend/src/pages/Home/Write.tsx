import React, { FC } from "react";
import { Link } from "react-router-dom";
import Button from "components/common/button";
import Select from "components/common/Select";

const Write: FC = () => {
  const img = process.env.PUBLIC_URL;
  const option = [
    { label: "공지게시판", value: "공지게시판" },
    { label: "자유게시판", value: "자유게시판" },
  ];
  return (
    <div className="write">
      <Link to="/board" className="button">
        <img src={`${img}/common/ChevronLeftOutline.png`} alt="" />
      </Link>
      <div className="content">
        <h2>게시글 작성</h2>
        <p>카테고리*</p>
        <div>
          <Select
            placeholder="공지게시판"
            options={option}
            onChange={() => console.log("hi")}
          />
          <textarea />
        </div>
        <Button color="blue" text="제출" handler={() => console.log("test")} />
      </div>
    </div>
  );
};

export default Write;
