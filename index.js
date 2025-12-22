import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const WHATSAPP_URL = `https://graph.facebook.com/v24.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const TOKEN = process.env.WHATSAPP_API_TOKEN;

app.post("/send-order", async (req, res) => {
  const { username, phone, detalle, total } = req.body;

  try {
    const payload = {
      messaging_product: "whatsapp",
      to: `54${phone}`, 
      type: "template",
      template: {
        name: "confirmacion_pedido",
        language: { code: "es_AR" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: username },
              { type: "text", text: detalle },
              { type: "text", text: total }
            ]
          }
        ]
      }
    };

    const response = await axios.post(WHATSAPP_URL, payload, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    res.json({ success: true, messageId: response.data.messages[0].id });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

app.listen(3001, () => console.log("Servidor WhatsApp corriendo en puerto 3001"));