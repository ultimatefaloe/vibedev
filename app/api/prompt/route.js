import Prompt from "@models/Prompt";
import { connectionToDB } from "@utils/database";

export const GET = async (req) => {
  try {
    await connectionToDB();

    const prompts = await Prompt.find().populate('creator')

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch posts', { status: 500 });

  }
};
