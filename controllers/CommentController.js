import CommentModel from '../models/Comment.js';

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      commentText: req.body.commentText,
      user: req.body.userId,
      post: req.body.postId,
    });
    const com = await doc.save();
    const fullDocument = await CommentModel.findById(com._id).populate('post').populate('user');
    res.json(fullDocument);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create new Comment' });
  }
};

export const remove = async (req, res) => {
  try {
    const commentId = req.params.id;
    const result = await CommentModel.findOneAndDelete({ _id: commentId });
    if (result) {
      res.json({ message: 'Comment DELETED' });
    } else {
      res.status(404).json({ message: 'COMMENT NOT FOUND' });
    }
  } catch (error) {
    console.log('ERROR:  ', error);
    res.status(500).json({ message: 'Failed to remove a comment' });
  }
};

export const getLast = async (req, res) => {
  try {
    const posts = await CommentModel.find()
      .populate('post')
      .populate('user')
      .limit(5)
      .sort({ createdAt: 'desc' })
      .exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to load last 5 Comments' });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const _id = req.params.postId;
    const coms = await CommentModel.find({ post: _id })
      .populate('user')
      .populate('post')
      .limit(20)
      .sort({ createdAt: 'desc' })
      .exec();
    res.json(coms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Comments for post #${_id} not found !` });
  }
};
