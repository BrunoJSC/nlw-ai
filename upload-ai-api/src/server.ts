import { fastify } from "fastify";
import { prisma } from "./lib/prisma";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { UploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { fastifyCors } from "@fastify/cors";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

app.register(getAllPromptsRoute);
app.register(UploadVideoRoute);
app.register(createTranscriptionRoute);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP running");
  });
