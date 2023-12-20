import { Schema, model, models } from 'mongoose';

const PostSchema = new Schema({
  userId: Number,
  id: Number,
  title: String,
  body: String,
});

const Post = models.Post || model('Post', PostSchema);

export default Post;
