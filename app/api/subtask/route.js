import connectToDB from '@/app/utils/database';
import Board from '@/app/models/board';

export const PATCH = async (req, res) => {
  const { boardName, id, status, updatedSubtasks, completed } = await req.json();

  let statusBeforeUpdate = status;
  let updatedTaskList = [];
  let taskListWithUpdatedStatus = [];
  let updatedTaskListWithUpdatedStatus = [];

  try {
    await connectToDB();
    const boardToUpdate = await Board.findOne({ name: boardName });
    const columnToUpdate = boardToUpdate.columns.find((column) => column.name === status);

    columnToUpdate.tasks.forEach((task) => {
      if (task._id.toString() === id) {
        task.subtasks = updatedSubtasks;
        if (completed === 0) {
          task.status = 'Todo';
        } else if (completed === task.subtasks.length) {
          task.status = 'Done';
        } else {
          task.status = 'Doing';
        }
      }
      if (task.status === statusBeforeUpdate) {
        updatedTaskList.push(task);
      } else {
        taskListWithUpdatedStatus = boardToUpdate.columns.find((column) => column.name === task.status);
        updatedTaskListWithUpdatedStatus = [...taskListWithUpdatedStatus.tasks, task];
      }
    });

    columnToUpdate.tasks = updatedTaskList;
    taskListWithUpdatedStatus.tasks = updatedTaskListWithUpdatedStatus;

    await boardToUpdate.save();

    return new Response(JSON.stringify(boardToUpdate), { status: 200 });
  } catch (error) {
    return new Response('Failed to update subtask', { status: 500 });
  }
};
