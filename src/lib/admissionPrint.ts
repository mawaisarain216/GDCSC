import { SignJWT, jwtVerify } from "jose";

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required.");
  return new TextEncoder().encode(secret);
}

export async function createAdmissionPrintToken(applicationNo: string, cnic: string) {
  return new SignJWT({ purpose: "admission-print", applicationNo, cnic })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(secretKey());
}

export async function verifyAdmissionPrintToken(token: string, applicationNo: string, cnic: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.purpose === "admission-print" && payload.applicationNo === applicationNo && payload.cnic === cnic;
  } catch {
    return false;
  }
}
