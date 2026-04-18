import QRCode from "qrcode";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code } = await ctx.params;

  if (!/^\d{6}$/.test(code)) {
    return new Response("Invalid code", { status: 400 });
  }

  const buffer = await QRCode.toBuffer(code, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 400,
    color: { dark: "#0b3d91", light: "#ffffff" },
  });

  const body = new Uint8Array(buffer);

  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
