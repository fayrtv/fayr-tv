import "../assets/styles.css";
import Steps from "components/Steps";
import Layout from "components/layout/Layout";
import React from "react";

export default function App() {
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
                <div className="max-w-3xl mx-auto">
                    <Steps />
                </div>
            </div>
        </Layout>
    );
}
