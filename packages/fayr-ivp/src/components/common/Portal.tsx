import ReactDOM from "react-dom";

const portalId = "reactPortalRoot";

export const Portal = {
    Client: (({ children }) => {
        const portalRoot = document.getElementById(portalId)!;

        return ReactDOM.createPortal(children, portalRoot);
    }) as React.FC,
    Root: () => <div id={portalId}></div>,
};

export default Portal;
