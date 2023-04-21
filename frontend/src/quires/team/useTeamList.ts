import { instance } from "config";
import { useQuery } from "react-query";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/team";

interface APIDataType {
  content: {
    teamId: number;
    teamName: string;
    oneIntro: string;
    teamSerialNo: number;
    name: string;
    memberCount: number | null;
    imageUrl: string | null;
  }[];
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
}

const TeamListFetcher = (
  pageNum: number,
  pageSize: number,
  pageSort: "SHUFFLE" | "ASC" | "DESC",
) =>
  instance.get<ApiResponseType<APIDataType>>(
    `/api/teams?pageNum=${pageNum}&pageSize=${pageSize}&pageSort=${pageSort}`,
  );
const useGetTeamListQuery = (
  pageNum: number,
  pageSize: number,
  pageSort: "SHUFFLE" | "ASC" | "DESC",
) =>
  useQuery(QUERY_KEY, () =>
    TeamListFetcher(pageNum, pageSize, pageSort).then((data) => data.data),
  );

export default useGetTeamListQuery;
