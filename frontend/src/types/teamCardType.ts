export interface TeamCardContentsType {
  teamId: number;
  teamName: string;
  oneIntro: string;
  teamSerialNo: number;
  name: string;
  memberCount: number;
  imageUrl: null | string;
  location: null | string;
  member_authority: "WAIT" | null;
  leader_authority: "LEADER" | "SUB_LEADER" | "TEAM_MEMBER";
}
