import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CHATWOOT_API_KEY = process.env.CHATWOOT_API_KEY;
const CHATWOOT_URL = process.env.CHATWOOT_URL;

async function replyToGuest(message) {
  const prompt = `You are a hotel booking assistant. Reply politely and professionally to: ${message}`;
  
  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await aiResponse.json();
  const reply = data.choices[0].message.content;

  console.log("AI Reply:", reply);

  await fetch(`${CHATWOOT_URL}/api/v1/accounts/1/conversations/1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api_access_token": CHATWOOT_API_KEY
    },
    body: JSON.stringify({
      content: reply,
      message_type: "outgoing"
    })
  });
}

replyToGuest("Do you have rooms available tomorrow?");
