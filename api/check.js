export default function handler(req, res) {
  res.status(200).json({
    OPENAI_KEY: process.env.OPENAI_API_KEY ? "WORKING ✅" : "NOT FOUND ❌"
  });
}
