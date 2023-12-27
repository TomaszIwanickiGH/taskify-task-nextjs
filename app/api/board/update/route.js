import connectToDB from '@/app/utils/database';
import Board from '@/app/models/board';

export const PATCH = async (req, res) => {
  const { currentBoard, updatedBoard } = await req.json();
  const { name, columns } = updatedBoard;

  try {
    await connectToDB();

    const existingBoard = await Board.findOne({ name: currentBoard });
    existingBoard.name = name;
    existingBoard.columns = columns;
    await existingBoard.save();

    return new Response(JSON.stringify(existingBoard), { status: 200 });
  } catch (error) {
    return new Response('Failed to update a board', { status: 500 });
  }
};
