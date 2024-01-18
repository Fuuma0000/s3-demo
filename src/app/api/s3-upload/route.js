const { NextResponse } = require("next/server");
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(file, fileName) {
  const fileBuffer = file;
  console.log(fileName);
  // 重複しないように現在時刻を付与
  // これがDBに保存する文字列
  const key = `${fileName}-${Date.now()}`;

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: "image/jpeg" || "image/png",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return key;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file"); // fileはフィールド名
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer(); // 画像のバイナリデータを取得
    const fileName = await uploadFileToS3(buffer, file.name);

    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
