import { Schema, model, models } from 'mongoose';

const SubtaskSchema = new Schema({
  title: String,
  isCompleted: Boolean,
});

const Subtask = models.Subtask || model('Subtask', SubtaskSchema);

export default Subtask;
