import { instance } from "config";
import { useQuery } from "react-query";

export const QUERY_KEY = "/certification";

const CertificationEamilFetcher = (email: string) => {
  if (!email) return null;
  return instance.get<string>(`/api/auth/email?mail=${email}`);
};
const useEmailCertificationQuery = (email: string) => {
  return useQuery(QUERY_KEY, () => CertificationEamilFetcher(email));
};

export default useEmailCertificationQuery;
