module.exports = {
    // presets: ["module:metro-react-native-babel-preset", "@babel/preset-flow"],
    presets: ["next/babel"],
    plugins: [
        "babel-plugin-transform-typescript-metadata",
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        "babel-plugin-parameter-decorator",
    ],
};
