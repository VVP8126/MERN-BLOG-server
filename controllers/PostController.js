import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to load ALL POSTs' });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' },
    );
    const dc = await PostModel.findOne({ _id: postId });
    res.json(dc);
  } catch (error) {
    console.log('ERROR:  ', error);
    res.status(500).json({ message: 'Failed to load a POST' });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await PostModel.findOneAndDelete({ _id: postId });
    console.log(result); // Fuck it afterwards !
    if (result) {
      res.json({ message: 'DELETED' });
    } else {
      res.status(404).json({ message: 'POST NOT FOUND' });
    }
  } catch (error) {
    console.log('ERROR:  ', error);
    res.status(500).json({ message: 'Failed to remove a POST' });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create new Post' });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      },
    );
    console.log(result);
    if (result?.modifiedCount > 0) {
      res.json({ message: 'Post updated !' });
    } else {
      res.status(404).json({ message: 'Post to update not found ):' });
    }
  } catch (error) {
    console.log(`ERROR while POST update: ${error}`);
    res.status(500).json({ message: 'Failed to update existing Post' });
  }
};
