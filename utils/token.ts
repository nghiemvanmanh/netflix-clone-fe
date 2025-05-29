export default function parseJwt(token: string) {
  try {
    const base64Payload = token.split(".")[1];
    const decodedPayload = atob(base64Payload); // decode base64
    return JSON.parse(decodedPayload); // convert to JSON
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}
