"use server";
import { auth } from "@/auth";
import { CosmosClient } from "@azure/cosmos";
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
      error: "Come on, you need to enter a prompt!",
    };
  }

  const session = await auth();

  if (session === null || session.user === undefined) {
    return {
      id: "",
      error: "You must be signed in to generate an image",
    };
  }

  const connection = process.env.AZURE_STORAGE_CONNECTION_STRING!;
  const queueServiceClient =
    QueueServiceClient.fromConnectionString(connection);

  const queueClient = queueServiceClient.getQueueClient("img");

  const input: ImageEntry = {
    userPrompt: prompt,
    status: "Pending",
    userId: session.user.name!,
    id: nanoid(),
    imagePrompt: "",
  };

  const message = JSON.stringify(input);

  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);
  const encodedMessageString = Buffer.from(encodedMessage).toString("base64");

  await saveImageEntry(input);
  await queueClient.sendMessage(encodedMessageString);

  if (input.id) {
    redirect(`/image/${input.id}`);
  }

  return {
    id: input.id,
    error: "",
  };
}

interface ImageResponse {
  state: ImageLoadingState;
  imageUrl: string;
  error?: string;
}

export const getAllImages = async () => {
  const container = await cosmosContainer();

  const { resources } = await container.items
    .query<ImageEntry>(
      {
        query: "SELECT * from c WHERE c.status = @status",
        parameters: [{ name: "@status", value: "Success" }],
      },
      {
        maxItemCount: 10000,
      }
    )
    .fetchAll();

  return resources;
};

export const fullImageUrl = async (id: string) => {
  const imageUrl = `https://image-gen.azureedge.net/images/${id}.png?${process.env.AZURE_STORAGE_SAAS}`;
  return imageUrl;
};

export const loadImageFromServer = async (
  id: string
): Promise<ImageResponse> => {
  try {
    const image = await getImageEntry(id);

    if (image.length === 0) {
      return {
        state: "Error",
        imageUrl: "",
        error: "Ah snap! We couldn't find the image you were looking for",
      };
    }

    const entry = image[0];

    let response: ImageResponse = {
      state: entry.status,
      imageUrl: entry.status === "Success" ? await fullImageUrl(id) : "",
    };

    if (entry.status === "Error") {
      response.error =
        entry.errorMessage ?? "There was an error loading the image";
    }

    return response;
  } catch (e) {
    console.error(e);
    return {
      state: "Error",
      imageUrl: "",
      error: "There was an error loading the image",
    };
  }
};

export const getImageEntry = async (id: string) => {
  const container = await cosmosContainer();

  const { resources } = await container.items
    .query<ImageEntry>({
      query: "SELECT * from c WHERE c.id = @id",
      parameters: [{ name: "@id", value: id }],
    })
    .fetchAll();

  return resources;
};

export const saveImageEntry = async (entry: ImageEntry) => {
  const container = await cosmosContainer();
  await container.items.create(entry);
};

export const cosmosContainer = async () => {
  const endpoint = process.env.AZURE_COSMOS_ENDPOINT!;
  const key = process.env.AZURE_COSMOS_KEY!;
  const databaseId = process.env.AZURE_COSMOS_DATABASE!;
  const containerId = process.env.AZURE_COSMOS_CONTAINER!;
  const client = new CosmosClient({ endpoint, key });

  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });

  const { container } = await database.containers.createIfNotExists({
    id: containerId,
    partitionKey: "/userId",
  });

  return container;
};

interface ImageEntry {
  id: string;
  userPrompt: string;
  userId: string;
  status: ImageLoadingState;
  errorMessage?: string;
  imagePrompt: string;
}

export type ImageLoadingState = "Pending" | "Processing" | "Success" | "Error";
