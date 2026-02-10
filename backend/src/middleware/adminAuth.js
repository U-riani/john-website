import jwt from "jsonwebtoken";

export default function adminAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const token = header.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.adminId = payload.adminId;
    next();
  } catch {
    res.sendStatus(401);
  }
}
