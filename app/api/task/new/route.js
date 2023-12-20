import connectToDB from '@/app/utils/database';
import Board from '@/app/models/board';
import Task from '@/app/models/task';

export const PATCH = async (req, res) => {
  const { boardName, newTask } = await req.json();
  const { title, description, status, subtasks } = newTask;

  try {
    await connectToDB();

    const existingBoard = await Board.findOne({ name: boardName });
    const columnToUpdate = existingBoard.columns.find((column) => column.name === status);

    const taskToAdd = new Task({ title, description, status, subtasks });
    columnToUpdate.tasks.push(taskToAdd);

    await existingBoard.save();

    return new Response(JSON.stringify(existingBoard), { status: 200 });
  } catch (error) {
    return new Response('Failed to add task', { status: 500 });
  }
};
