import { Schema, model, models } from 'mongoose';
import Subtask from './subtask';

const TaskSchema = new Schema({
  title: String,
  description: String,
  status: String,
  subtasks: [Subtask.schema],
});

const Task = models.Task || model('Task', TaskSchema);

export default Task;
