import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ success: false, error: "أدخل نصًا للتحليل" });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // إنشاء الملخص والأسئلة
    const prompt = `
      قم بتلخيص النص التالي مع استخراج 5 أسئلة مهمة:
      ${text}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });

    const result = response.choices[0].message.content;

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
