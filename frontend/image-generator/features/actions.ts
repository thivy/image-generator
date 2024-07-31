"use server";
import { QueueServiceClient } from "@azure/storage-queue";
import { nanoid } from "nanoid";

export interface InputState {
  id: string;
  error: string;
}

export async function generateImage(
  prevState: InputState,
  formData: FormData
): Promise<InputState> {
  const prompt = formData.get("prompt") as string;

  if (prompt === "" || !prompt) {
    return {
      id: "",
      error: "Prompt cannot be empty",
    };
  }

  const connection = process.env.AZURE_STORAGE_CONNECTION_STRING!;
  console.log(connection);
  const queueServiceClient =
    QueueServiceClient.fromConnectionString(connection);

  const queueClient = queueServiceClient.getQueueClient("img");

  const input = {
    prompt,
    id: nanoid(),
  };

  const message = JSON.stringify(input);

  await queueClient.sendMessage(message);

  return {
    id: input.id,
    error: "",
  };
}
