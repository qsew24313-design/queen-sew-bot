import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import P from "pino";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("sessions");

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    if (text === ".ping") {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "QUEEN SEW is alive ✅"
      });
    }
  });
}

startBot();
