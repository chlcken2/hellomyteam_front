import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "react-query";
import { queryClient } from "config";

import App from "App";

import "./styles/style.scss";
import "./styles/base.scss";
import "./styles/layouts/main.scss";

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </QueryClientProvider>,
);
