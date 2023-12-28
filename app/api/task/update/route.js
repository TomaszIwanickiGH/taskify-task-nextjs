import connectToDB from '@/app/utils/database';
import Board from '@/app/models/board';

export const PATCH = async (req, res) => {
  const { boardName, id, status, updatedTask } = await req.json();
  const { title, description, subtasks } = updatedTask;
  console.log(`Status: ${status}, updatedStatus: ${updatedTask.status}`);

  try {
    await connectToDB();
    const boardToUpdate = await Board.findOne({ name: boardName });
    const columnToUpdate = boardToUpdate.columns.find((column) => column.name === status);

    let statusBeforeUpdate = status;
    let updatedTaskList = [];
    let taskListWithUpdatedStatus = [];
    let updatedTaskListWithUpdatedStatus = [];

    columnToUpdate.tasks.forEach((task) => {
      if (task._id.toString() === id) {
        task.title = title;
        task.description = description;
        task.status = updatedTask.status;
        task.subtasks = subtasks;
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
    return new Response('Failed to update task', { status: 500 });
  }
};
