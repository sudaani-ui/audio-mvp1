import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    // اختبار المفتاح: جلب قائمة النماذج
    const models = await openai.models.list();
    res.status(200).json({
      ok: true,
      message: "المفتاح صالح ✅",
      totalModels: models.data.length
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "المفتاح غير صالح ❌ أو انتهت صلاحيته",
      error: error.message
    });
  }
}
