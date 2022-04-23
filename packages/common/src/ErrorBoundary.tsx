import React from "react";

class ErrorBoundary extends React.Component<{}, { error?: string }> {
    constructor(props: any) {
        super(props);
        this.state = { error: undefined };
    }

    componentDidCatch(error: Error) {
        this.setState({ error: `${error.name}: ${error.message}` });
    }

    render() {
        const { error } = this.state;
        if (error) {
            return <div>{error}</div>;
        } else {
            return <>{this.props.children}</>;
        }
    }
}

export default ErrorBoundary;
