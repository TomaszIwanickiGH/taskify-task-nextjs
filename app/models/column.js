import { Schema, model, models } from 'mongoose';
import Task from './task';

const ColumnSchema = new Schema({
  name: String,
  tasks: [Task.schema],
});

const Column = models.Column || model('Column', ColumnSchema);

export default Column;
