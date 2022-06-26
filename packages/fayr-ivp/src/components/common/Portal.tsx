import ReactDOM from "react-dom";

const portalId = "reactPortalRoot";

export const Portal = {
    Client: ({ children }: { children?: React.ReactNode }) => {
        const portalRoot = document.getElementById(portalId)!;

        return ReactDOM.createPortal(children, portalRoot);
    },
    Root: () => <div id={portalId}></div>,
};

export default Portal;
