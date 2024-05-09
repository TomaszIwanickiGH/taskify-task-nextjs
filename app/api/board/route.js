import connectToDB from '@/app/utils/database';
import Board from '@/app/models/board';

export const revalidate = 1;
export const GET = async (req, res) => {
  try {
    await connectToDB();

    const boards = await Board.find({});

    return new Response(JSON.stringify(boards), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch boards', { status: 500 });
  }
};
