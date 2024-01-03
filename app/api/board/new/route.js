import connectToDB from '@/app/utils/database';
import Board from '@/app/models/board';

export const POST = async (req, res) => {
  const { name, columns } = await req.json();

  try {
    await connectToDB();

    const newBoard = new Board({ name, columns });

    await newBoard.save();

    return new Response(JSON.stringify(newBoard), { status: 200 });
  } catch (error) {
    return new Response('Failed to create a board', { status: 500 });
  }
};
