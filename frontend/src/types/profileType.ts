export type SelectedLocalListType = {
  title: string;
  localName: string;
};

export interface ProfileInfoType {
  name: string;
  memberOneIntro?: string;
  conditionStatus?: string[];
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

export interface ChangeInfoType {
  changeAddress: string;
  changeBackNumber: number;
  changeBirthday: string;
  changeConditionIndicator: number;
  changeConditionStatus: string;
  changeDrinkingCapacity: number;
  changeLeftRightFoot: string;
  changeMemberOneIntro: string;
  changeName: string;
  changePreferPosition: string;
}

export interface GetProfileImageResponseType {
  teamMemberInfoId: number;
  imgUrl: string;
  imgName: string;
  createdDate: string;
  backgroundId?: number;
}
