import { AuthProvider } from "@/context/Auth";
import { App, ConfigProvider } from "antd";
import theme from "../theme"; 

const AppProvider = ({ children }) => {
    return (
        <ConfigProvider theme={theme}>
            <App>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </App>
        </ConfigProvider>
    );
};

export default AppProvider;