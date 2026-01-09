import { Request, Response } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "sa-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadProductImages(req: Request, res: Response) {
  try {
    const { secret } = req.body;

    if (secret !== "upload-images-2025") {
      res.status(401).json({ error: "Invalid secret" });
      return;
    }

    const images = [
      { filename: "playstation-network.webp", key: "playstation-network.webp" },
      { filename: "amazon-gift-cards.webp", key: "amazon-gift-cards.webp" },
      { filename: "nintendo-eshop.webp", key: "nintendo-eshop.webp" },
      { filename: "xbox-gift-card.webp", key: "xbox-gift-card.webp" },
      { filename: "xbox-game-pass.webp", key: "xbox-game-pass.webp" },
    ];

    const results: Array<{ filename: string; url: string; success: boolean }> = [];
    const bucketName = process.env.AWS_S3_BUCKET || "myfimport";

    for (const image of images) {
      try {
        // Read image from request body (base64)
        const imageData = req.body[image.filename];
        
        if (!imageData) {
          results.push({
            filename: image.filename,
            url: "",
            success: false,
          });
          continue;
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(imageData, "base64");

        // Upload to S3
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: image.key,
          Body: buffer,
          ContentType: "image/webp",
          ACL: "public-read",
        });

        await s3Client.send(command);

        const url = `https://${bucketName}.s3.${process.env.AWS_REGION || "sa-east-1"}.amazonaws.com/${image.key}`;

        results.push({
          filename: image.filename,
          url,
          success: true,
        });
      } catch (error: any) {
        console.error(`Error uploading ${image.filename}:`, error);
        results.push({
          filename: image.filename,
          url: "",
          success: false,
        });
      }
    }

    res.json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: error.message });
  }
}
