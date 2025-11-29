import Prompt from "@models/Prompt";
import { connectionToDB } from "@utils/database";

export const GET = async (req, { params }) => {
  const { id } = await params;
  const promptId = id;
  console.log(promptId)
  try {
    await connectionToDB();
    const prompts = await Prompt.findById(promptId);

    if (!prompts) {
      return Response("Prompt not found", { status: 404 });
    }
    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch posts", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  const { id } = await params;
  const promptId = id;
  const { prompt, tag } = await req.json();

  try {
    await connectionToDB();
    const existingPrompts = await Prompt.findById(promptId).populate(
      "creator"
    );

    if (!existingPrompts) {
      return Response("Prompt not found", { status: 404 });
    }

    existingPrompts.prompt = prompt;
    existingPrompts.tag = tag;

    await existingPrompts.save();

    return new Response(JSON.stringify(existingPrompts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to update prompt", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const { id } = await params;
  const promptId = id;

  try {
    await connectionToDB();
    await Prompt.findByIdAndDelete(promptId);

    return new Response("Post deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to delete post", { status: 500 });
  }
};
