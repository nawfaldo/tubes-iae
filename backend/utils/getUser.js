import jwt from "jsonwebtoken";

export function getUserIdFromHeader(req) {
    const auth = req.headers.authorization;
    if (!auth) return null;
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, "idk");
    return payload.uid;
}