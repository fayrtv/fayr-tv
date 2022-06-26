import React from "react";

type Props = {
    children: React.ReactNode;
};

class ErrorBoundary extends React.Component<Props, { error?: string }> {
    constructor(props: Props) {
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
