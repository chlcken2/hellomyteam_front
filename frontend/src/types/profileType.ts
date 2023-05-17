export type SelectedLocalListType = {
  title: string;
  localName: string;
};

export interface ProfileInfoType {
  name: string;
  intro: string;
  state: string[];
  local: SelectedLocalListType[];
  phone: string;
  birth: string;
  backNum: string;
  position: string;
  weakInfo: string;
  condition: string;
  amountOfAlcohol: string;
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
