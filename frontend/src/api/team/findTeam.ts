import { instance } from "config";
import { findTeamTypes, joinTeamTypes } from "./teamTypes";

interface APIResponseType<T> {
  status: string;
  data: T;
  message: string;
}

export const findTeamAPI = async (teamName: string) => {
  if (!teamName) return null;
  const { data } = await instance.get<APIResponseType<findTeamTypes[]>>(
    `/api/team/find?teamName=${teamName}`,
    {
      headers: { Authorization: JSON.parse(localStorage.getItem("access")).value },
    },
  );
  return data.data;
};

export const joinTeamAPI = async (memberId: number, teamId: number) => {
  const { data } = await instance.post<APIResponseType<joinTeamTypes>>(
    "/api/team/join",
    {
      memberId,
      teamId,
    },
    {
      headers: { Authorization: JSON.parse(localStorage.getItem("access")).value },
    },
  );
  return data.data;
};
