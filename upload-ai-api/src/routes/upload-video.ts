import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import { prisma } from "../lib/prisma";
import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline);

export async function UploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_848_576 * 25, // 25MB
    },
  });
  app.post("/videos", async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: "Missing file input." });
    }

    const extensions = path.extname(data.filename);

    if (extensions !== ".mp3") {
      return reply
        .status(400)
        .send({ error: "Invalid input type, please upload a MP3" });
    }

    const fileBaseName = path.basename(data.filename, extensions);

    const fileUploadName = `${fileBaseName}-${randomUUID()}${extensions}`;

    const uploadDestination = path.resolve(
      __dirname,
      "../../tmp",
      fileUploadName
    );

    await pump(data.file, fs.createWriteStream(uploadDestination));

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination,
      },
    });

    return {
      video,
    };
  });
}