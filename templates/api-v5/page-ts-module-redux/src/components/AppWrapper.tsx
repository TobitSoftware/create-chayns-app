import { ChaynsProvider, withCompatMode } from "chayns-api";
import App from "./App";

const AppWrapper = ({ ...props }) => {
    return (
        <div className="tapp">
            <ChaynsProvider {...props}>
                <App/>
            </ChaynsProvider>
        </div>
    )
}

export default withCompatMode(AppWrapper);
