import OpenAI from "openai";

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ error: "Method not allowed. Use GET or POST." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: "مفتاح OPENAI_API_KEY غير موجود في البيئة." });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.models.list();
    if (response && response.data) {
      return res.status(200).json({
        ok: true,
        message: "مفتاح OpenAI صالح ✅. الاتصال ناجح.",
        model_count: response.data.length
      });
    }
    res.status(500).json({ ok: false, error: "تم الاتصال بـ OpenAI لكن لم يتم الحصول على بيانات صحيحة." });
  } catch (error) {
    let msg = error.message || "حدث خطأ غير معروف.";
    if (msg.includes("Invalid API key") || msg.includes("401")) {
      msg = "المفتاح غير صالح أو منتهي الصلاحية ❌.";
    }
    res.status(500).json({ ok: false, error: msg });
  }
}
