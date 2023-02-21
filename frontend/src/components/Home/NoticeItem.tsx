import { FC } from "react";

interface NoticeItemType {
  title: string;
  content: string;
  author: string;
  imageURL?: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
}

const NoticeItem: FC<NoticeItemType> = ({
  title,
  commentCount,
  content,
  createdAt,
  likeCount,
  author,
  imageURL,
}) => {
  return (
    <div className="notice-item">
      <div>
        <p className="title">{title}</p>
        <p className="content">{content}</p>
        <span className="name">{author}</span>
        <div className="sub-info-box">
          <span>{createdAt}</span>
          <span>댓글 {commentCount}</span>
          <span>좋아요 {likeCount}</span>
        </div>
      </div>
      {imageURL && <img src={imageURL} alt="notice" />}
    </div>
  );
};

export default NoticeItem;
