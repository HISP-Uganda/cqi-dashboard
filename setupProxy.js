const express = require("express");
var cors = require("cors");
var whitelist = ["http://localhost:3000", "http://172.16.200.111:3000"];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

const { createProxyMiddleware } = require("http-proxy-middleware");

let sessionCookie = "";
const onProxyReq = (proxyReq) => {
    if (sessionCookie) {
        proxyReq.setHeader("cookie", sessionCookie);
    }
};
const onProxyRes = (proxyRes) => {
    const proxyCookie = proxyRes.headers["set-cookie"];
    if (proxyCookie) {
        sessionCookie = proxyCookie;
    }
};
// proxy middleware options
const options = {
    target: "https://cqi.health.go.ug", // target host
    onProxyReq,
    onProxyRes,
    changeOrigin: true, // needed for virtual hosted sites
    auth: undefined,
    logLevel: "debug",
};

// create the proxy (without context)
const exampleProxy = createProxyMiddleware(options);

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// app.use(cors({ credentials: true, origin: "http://172.16.200.131:3000" }));
// app.use(cors({ credentials: true, origin: "http://172.16.200.111:3000" }));
app.use("/", exampleProxy);
app.listen(3002);
