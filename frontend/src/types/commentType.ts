export interface CommentType {
  author: boolean;
  commentId: number;
  content: string;
  writer: string;
  createdDate: string;
  modifiedDate: string;
  likeCount: number;
  commentStatus: "DELETE_USER" | "NORMAL";
  teamMemberInfoId: number;
  children: CommentType[];
  imgUrl: string | null;
}

export interface CommentListType {
  content: CommentType[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: any;
  size: number;
  sort: any;
  totalElements: number;
  totalPages: number;
}

export interface RegistCommentResponseType extends CommentType {
  parentId?: number;
}
