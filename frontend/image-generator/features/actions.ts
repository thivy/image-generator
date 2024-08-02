"use server";
import { QueueServiceClient } from "@azure/storage-queue";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

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
  const queueServiceClient =
    QueueServiceClient.fromConnectionString(connection);

  const queueClient = queueServiceClient.getQueueClient("img");

  const input = {
    prompt,
    id: nanoid(),
  };

  const message = JSON.stringify(input);

  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);
  const encodedMessageString = Buffer.from(encodedMessage).toString("base64");

  await queueClient.sendMessage(encodedMessageString);

  if (input.id) {
    redirect(`/image/${input.id}`);
  }

  return {
    id: input.id,
    error: "",
  };
}

export const loadImageFromServer = async (id: string) => {
  const imageUrl = `https://image-gen.azureedge.net/images/${id}.png`;

  try {
    const response = await fetch(imageUrl, {
      mode: "no-cors",
      cache: "no-cache",
    });

    if (response.ok) {
      return {
        state: "success",
        imageUrl,
      };
    } else {
      return {
        state: "loading",
        imageUrl: "",
      };
    }
  } catch (e) {
    console.error(e);
    return {
      state: "error",
      imageUrl: "",
    };
  }
};
