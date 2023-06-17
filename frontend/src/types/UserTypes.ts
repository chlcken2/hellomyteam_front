export interface userTypes {
  createdDate: string;
  modifiedDate: string;
  id: number;
  email: string;
  name: string;
  birthday: string;
  memberStatus: string;
  joinPurpose: string;
  termsAndCond: [
    {
      id: number;
      termsOfServiceYn: string;
      privacyYn: string;
    },
  ];
}

export interface joinTeamTypes {
  teamName: string;
  teamId: number;
  imageUrl: string | null;
  memberCount: number;
  oneIntro: string;
}

export interface boardDetailTypes {
  createdDate: string;
  modifiedDate: string;
  id: number;
  boardCategory: string;
  writer: string;
  title: string;
  contents: string;
  boardStatus: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
}

export type boardListTypes = {
  content: boardArray[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
};

interface boardArray {
  boardCategory: string;
  boardStatus: string;
  commentCount: number;
  contents: string;
  createdDate: string;
  id: number;
  likeCount: number;
  modifiedDate: string;
  title: string;
  viewCount: number;
  writer: string;
}
/**
 * write comment
 */
export interface setCommentListTypes {
  content: string;
  parentId: number;
  teamMemberInfoId: number;
}

/**
 * result of get comment
 */
export interface getCommentListTypes {
  commentId: number;
  content: string;
  writer: string;
  teamMemberInfoId: number;
  likeCount: number;
  commentStatus: string;
  createdDate: string;
  modifiedDate: string;
  children: any[];
}
