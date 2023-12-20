import connectToDB from '@/app/utils/database';
import Board from '@/app/models/board';

export const DELETE = async (req, res) => {
  const { boardName } = await req.json();
  try {
    await connectToDB();

    const boardToRemove = await Board.findOne({ name: boardName });
    const idToRemove = boardToRemove._id;
    await Board.findByIdAndDelete(idToRemove);

    return new Response(JSON.stringify('Board deleted'), { status: 200 });
  } catch (error) {
    return new Response('Failed to delete board', { status: 500 });
  }
};
