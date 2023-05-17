export type SelectedLocalListType = {
  title: string;
  localName: string;
};

export interface ProfileInfoType {
  name: string;
  memberOneIntro?: string;
  state?: string[];
  address?: SelectedLocalListType[];
  phone?: string;
  birthday: string;
  backNumber?: string;
  preferPosition?: string;
  leftRightFoot?: string;
  conditionIndicator?: string;
  drinkingCapacity?: string;
  isPhoneOpen: boolean;
  isBirthOpen: boolean;
}

export interface GetProfileImageResponseType {
  teamMemberInfoId: number;
  imgUrl: string;
  imgName: string;
  createdDate: string;
  backgroundId?: number;
}
