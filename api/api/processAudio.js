import formidable from "formidable";
import fs from "fs";
import OpenAI from "openai";

export const config = {
  api: { bodyParser: false }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: err.message });

      try {
        const filePath = files.audio.filepath;

        // 1️⃣ تحويل الصوت إلى نص باستخدام Whisper
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(filePath),
          model: "whisper-1"
        });
        const text = transcription.text;

        // 2️⃣ تلخيص النص
        const summaryResp = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "أنت مساعد لتلخيص المحاضرات" },
            { role: "user", content: `لخص النص التالي: ${text}` }
          ]
        });
        const summary = summaryResp.choices[0].message.content;

        // 3️⃣ استخراج الأسئلة
        const questionsResp = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "أنت مدرس تضع أسئلة من المحاضرات" },
            { role: "user", content: `اصنع أسئلة من هذا الملخص: ${summary}` }
          ]
        });
        const questions = questionsResp.choices[0].message.content;

        // 4️⃣ إرسال النتيجة
        res.status(200).json({ summary, questions });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء المعالجة" });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
