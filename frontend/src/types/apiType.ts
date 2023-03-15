interface ApiType<T> {
  status: string;
  data: T;
  message: string;
}

export default ApiType;
