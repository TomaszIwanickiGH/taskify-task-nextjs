import { Schema, model, models } from 'mongoose';
import Column from './column';

const BoardSchema = new Schema({
  name: String,
  columns: [Column.schema],
});

const Board = models.Board || model('Board', BoardSchema);

export default Board;
