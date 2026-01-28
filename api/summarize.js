import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "يرجى إدخال نص للتحليل" });
    }

    // الحد الأقصى للكلمات ~70 ألف كلمة (~100 صفحة)
    const words = text.split(/\s+/).length;
    if (words > 70000) {
      return res.status(400).json({ error: "النص طويل جدًا، الحد الأقصى ~100 صفحة" });
    }

    // طلب تلخيص + أسئلة
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "أنت مساعد ذكي قادر على تلخيص المحاضرات وإنتاج أسئلة تعليمية. يمكنك التعامل مع النصوص العربية، الإنجليزية، والفرنسية."
        },
        {
          role: "user",
          content: `لخص النص التالي واكتب أسئلة عليه:\n\n${text}`
        }
      ]
    });

    const summaryText = completion.choices[0].message.content;

    // تقسيم الملخص والأسئلة تلقائيًا حسب الفقرة الأولى بعد كل قسم
    let [summary, questions] = summaryText.split(/أسئلة|Questions|Questions:/i);
    summary = summary ? summary.trim() : "لا يوجد ملخص";
    questions = questions ? questions.trim() : "لا توجد أسئلة";

    res.status(200).json({ summary, questions });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء التلخيص. حاول مرة أخرى." });
  }
}
