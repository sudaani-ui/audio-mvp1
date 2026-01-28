import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "أنت مساعد ذكي" },
        { role: "user", content: "لخص هذه الجملة: الذكاء الاصطناعي مفيد في التعليم" }
      ]
    });

    res.status(200).json({
      summary: completion.choices[0].message.content,
      questions: "سؤال تجريبي: ما فائدة الذكاء الاصطناعي؟"
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
