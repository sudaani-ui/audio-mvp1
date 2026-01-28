import OpenAI from "openai";

export default async function handler(req, res) {
  // فقط POST أو GET مقبولين
  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ error: "Method not allowed. Use GET or POST." });
  }

  // التحقق من وجود المفتاح
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: "مفتاح OPENAI_API_KEY غير موجود في البيئة." });
  }

  const openai = new OpenAI({ apiKey });

  try {
    // اختبار بسيط للاتصال بـ OpenAI
    const response = await openai.models.list(); // هذا سريع ولا يستهلك رصيد

    if (response && response.data) {
      return res.status(200).json({
        ok: true,
        message: "مفتاح OpenAI صالح ✅. الاتصال ناجح.",
        model_count: response.data.length
      });
    } else {
      return res.status(500).json({
        ok: false,
        error: "تم الاتصال بـ OpenAI لكن لم يتم الحصول على بيانات صحيحة."
      });
    }

  } catch (error) {
    console.error("OpenAI Test Error:", error);

    let msg = error.message || "حدث خطأ غير معروف.";

    // التعامل مع أخطاء المفتاح الشائعة
    if (msg.includes("Invalid API key") || msg.includes("401")) {
      msg = "المفتاح غير صالح أو منتهي الصلاحية ❌.";
    }

    res.status(500).json({ ok: false, error: msg });
  }
}
