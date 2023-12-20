import connectToDB from '@/app/utils/database';
import Board from '@/app/models/board';
import Task from '@/app/models/task';

export const DELETE = async (req, res) => {
  const { boardName, id, status } = await req.json();
  try {
    await connectToDB();

    const boardToDeleteFrom = await Board.findOne({ name: boardName });
    const columnToDeleteFrom = boardToDeleteFrom.columns.find((column) => column.name === status);
    const updatedTaskList = columnToDeleteFrom.tasks.filter((task) => task._id.toString() !== id);
    columnToDeleteFrom.tasks = updatedTaskList;

    await boardToDeleteFrom.save();

    return new Response('', { status: 200 });
  } catch (error) {
    return new Response('Failed to delete a task', { status: 500 });
  }
};
