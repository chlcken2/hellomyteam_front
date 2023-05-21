import { atom } from "recoil";
import { joinTeamTypes } from "types/UserTypes";

const joinedTeamsAtom = atom<joinTeamTypes[]>({
  key: "JoinedTeams",
  default: null,
});

export default joinedTeamsAtom;
