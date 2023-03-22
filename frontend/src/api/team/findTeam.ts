import { instance } from "config";
import { findTeamTypes, joinTeamTypes } from "./teamTypes";

interface APIResponseType<T> {
  status: string;
  data: T;
  message: string;
}

export const findTeamAPI = async (teamName: string) => {
  if (!teamName) return null;
  const data = await instance.get<APIResponseType<findTeamTypes[]>>(
    `/api/teams/{team-identifier}?team-identifier=${Number(teamName)}`,
  );
  if (data) {
    return data.data.data;
  }
  return null;
};

export const joinTeamAPI = async (memberId: number, teamId: number) => {
  const { data } = await instance.post<APIResponseType<joinTeamTypes>>("/api/team/join", {
    memberId,
    teamId,
  });
  return data.data;
};
