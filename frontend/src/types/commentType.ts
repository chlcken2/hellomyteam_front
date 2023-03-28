export interface CommentType {
  commentId: number;
  content: string;
  writer: string;
  createdDate: string;
  modifiedDate: string;
  likeCount: number;
  commentStatus: "DELETE_USER" | "NORMAL";
  teamMemberInfoId: number;
}

export interface RegistCommentResponseType extends CommentType {
  parentId?: number;
}
