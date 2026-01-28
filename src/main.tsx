
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";

import App from "./app/App.tsx";
import "antd/dist/reset.css";
import "./styles/index.css";
  import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider locale={viVN}>
    <App />
  </ConfigProvider>,
);
  
