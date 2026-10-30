import "./App.scss";
import "bootstrap/dist/js/bootstrap.bundle";
import "./config/global";
import { ConfigProvider, App as AntApp } from "antd";
import { useAuth } from "./context/Auth";
import Routes from "./pages/Routes";
import ScreenLoader from "./components/ScreenLoader";

const App = () => {
  const { loading } = useAuth();
  console.log (loading)
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1d3557",
        },
        components: {
          Button: {
            controlOutline: 0,
            primaryShadow: "none",
          },
        },
      }}
    >
      <AntApp>
        {loading ? <ScreenLoader /> : <Routes />}
      </AntApp>
    </ConfigProvider>
  );
};

export default App;