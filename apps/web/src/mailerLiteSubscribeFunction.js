// This file is intended to be copied to netlify/functions/mailerLiteSubscribe.js by the prebuild script.
// It implements a simple Netlify Function that forwards subscriptions to MailerLite.

const MAILERLITE_API_URL = "https://api.mailerlite.com/api/v2/subscribers";

exports.handler = async function (event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    const contentType = (event.headers["content-type"] || event.headers["Content-Type"] || "").toLowerCase();
    let data = {};

    if (contentType.includes("application/json")) {
      data = JSON.parse(event.body || "{}");
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const params = new URLSearchParams(event.body || "");
      params.forEach((value, key) => {
        data[key] = value;
      });
    } else {
      try {
        data = JSON.parse(event.body || "{}");
      } catch (err) {
        data = {};
      }
    }

    const { email, name, interests, consent } = data;
    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) };
    }

    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_TOKEN;
    if (!MAILERLITE_API_KEY) {
      console.error("Missing MAILERLITE_API_KEY env var");
      return { statusCode: 500, body: JSON.stringify({ error: "MailerLite not configured" }) };
    }

    const payload = {
      email,
      name: name || undefined,
      fields: {
        interests: Array.isArray(interests) ? interests.join(",") : (typeof interests === "string" ? interests : ""),
        consent: consent ? "yes" : "no",
      },
      resubscribe: true,
    };

    const res = await fetch(MAILERLITE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        "X-MailerLite-ApiKey": MAILERLITE_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("MailerLite error", res.status, text);
      return { statusCode: 502, body: JSON.stringify({ error: "MailerLite API error", details: text }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, result: text }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "server error" }) };
  }
};
