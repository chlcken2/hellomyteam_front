export interface CommentType {
  commentId: number;
  content: string;
  writer: string;
  createdDate: Date;
  modifiedDate: Date;
  likeCount: number;
}

export interface RegistCommentResponseType extends CommentType {
  parentId?: number;
}
