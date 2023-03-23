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
}
