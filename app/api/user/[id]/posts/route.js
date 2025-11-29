import Prompt from "@models/Prompt";
import { connectionToDB } from "@utils/database";

export const GET = async (req, { params }) => {
  try {
    await connectionToDB();

    const userId = params.id;

    const prompts = await Prompt.find({ createor: userId }).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch posts", { status: 500 });
  }
};
