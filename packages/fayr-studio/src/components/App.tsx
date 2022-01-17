import "../assets/tailwind.css";
import Layout from "components/layout/Layout";
import Community from "pages/Community";
import Home from "pages/Home";
import Insights from "pages/Insights";
import Marketing from "pages/Marketing";
import StreamManager from "pages/StreamManager";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="home" element={<Home />} />
                    <Route path="community" element={<Community />} />
                    <Route path="insights" element={<Insights />} />
                    <Route path="marketing" element={<Marketing />} />
                    <Route path="stream-manager" element={<StreamManager />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
