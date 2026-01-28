import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // اختبار بسيط لجلب قائمة الموديلات
    const models = await client.models.list();
    res.status(200).json({ success: true, models: models.data.map(m => m.id) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
