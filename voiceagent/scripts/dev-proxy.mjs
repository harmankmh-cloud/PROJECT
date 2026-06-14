import http from "http";
import httpProxy from "http-proxy";

const PORT = Number(process.env.DEV_PROXY_PORT || 3099);
const NEXT_URL = process.env.NEXT_DEV_URL || "http://127.0.0.1:3002";
const ORCH_URL = process.env.ORCH_DEV_URL || "http://127.0.0.1:8080";

const proxy = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: true,
});

proxy.on("error", (err, req, res) => {
  console.error("Proxy error:", err.message);
  if (res && "writeHead" in res && !res.headersSent) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Bad gateway");
  }
});

const server = http.createServer((req, res) => {
  const target = req.url?.startsWith("/ws") ? ORCH_URL : NEXT_URL;
  proxy.web(req, res, { target });
});

server.on("upgrade", (req, socket, head) => {
  const target = req.url?.startsWith("/ws") ? ORCH_URL : NEXT_URL;
  proxy.ws(req, socket, head, { target });
});

server.listen(PORT, () => {
  console.log(`Dev proxy on :${PORT} -> Next ${NEXT_URL}, /ws -> ${ORCH_URL}`);
});
