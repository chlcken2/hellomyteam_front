interface ApiResponseType<T> {
  status: string;
  data: T;
  message: string;
}

export default ApiResponseType;
