import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import express from "express";
import P from "pino";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/pair", async (req, res) => {
  const { number } = req.body;
  if (!number) return res.json({ error: "Number required" });

  const { state, saveCreds } = await useMultiFileAuthState("sessions");

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  const code = await sock.requestPairingCode(number);
  res.json({ code });
});

app.listen(3000, () => {
  console.log("Pair site running on port 3000");
});
