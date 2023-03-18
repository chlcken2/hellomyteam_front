export interface findTeamTypes {
  teamId: number;
  teamName: string;
  oneIntro: string;
  teamSerialNo: number;
  name: string;
  memberCount: number;
  imageUrl: string;
}

export interface joinTeamTypes {
  createdDate: string;
  modifiedDate: string;
  id: number;
  authority: string;
  preferPosition: null;
  preferStyle: null;
  specialTitleStatus: null;
  withdrawalDate: null;
  conditionStatus: string;
  backNumber: number;
  memberOneIntro: null;
  address: null;
  leftRightFoot: string;
  conditionIndicator: number;
  drinkingCapacity: number;
  joinDate: null;
  member: {
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
  };
  team: {
    createdDate: string;
    modifiedDate: string;
    id: number;
    teamName: string;
    oneIntro: string;
    detailIntro: string;
    tacticalStyleStatus: string;
    memberCount: number;
    mercenaryCount: number;
    teamSerialNo: number;
    boards: [
      {
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
      },
    ];
  };
  image: null;
  boards: null;
  comments: null;
  likes: null;
}
