import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error:"Method not allowed" });

  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) 
      return res.status(400).json({ error:"يرجى إدخال نص للتحليل" });

    const words = text.split(/\s+/).length;
    if (words > 70000)
      return res.status(400).json({ error:"النص طويل جدًا، الحد الأقصى ~100 صفحة" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "أنت مساعد ذكي قادر على تلخيص المحاضرات وإنتاج أسئلة تعليمية. دعم العربية + الإنجليزية + الفرنسية." },
        { role: "user", content: `لخص النص التالي واكتب أسئلة عليه:\n\n${text}` }
      ]
    });

    const summaryText = completion.choices[0].message.content;

    // فصل الملخص عن الأسئلة
    let summary = summaryText;
    let questions = "لا توجد أسئلة";
    const match = summaryText.match(/(ملخص|Summary|Résumé)\s*[:\-]?\s*(.+?)\s*(أسئلة|Questions|Questions)\s*[:\-]?\s*(.+)/is);
    if (match) {
      summary = match[2].trim();
      questions = match[4].trim();
    }

    res.status(200).json({ summary, questions });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء التلخيص. حاول مرة أخرى." });
  }
}
