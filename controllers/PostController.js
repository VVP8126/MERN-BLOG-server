import PostModel from '../models/Post.js';
import { limits } from '../settings/limitSettings.js';

export const getAll = async (req, res) => {
  try {
    const limit = limits.filter((l) => l.defaultValue)[0].value;
    const posts = await PostModel.find().limit(limit).populate('user').exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Failed to load ALL POSTs`,
    });
  }
};

export const getPostsCount = async (req, res) => {
  try {
    const posts = await PostModel.find().exec();
    res.json({ count: posts.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Failed to find POSTs count`,
    });
  }
};

export const getPostsWithLimitAndSkip = async (req, res) => {
  try {
    const limit = req.body.limit;
    const pg = req.body.pg;
    const skipped = limit * (pg - 1);
    const posts = await PostModel.find().limit(limit).skip(skipped).populate('user').exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to load POSTs using Limit and Skip' });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(10).exec();
    // console.log(posts);
    const tags = posts.map((p) => p.tags).flat();
    const uniqueTags = [...new Set(tags)].slice(0, 5);
    res.json(uniqueTags);
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
    const dc = await PostModel.findOne({ _id: postId }).populate('user');
    res.json(dc);
  } catch (error) {
    console.log('ERROR:  ', error);
    res.status(500).json({ message: 'Failed to load a POST' });
  }
};

export const getAuthorPosts = async (req, res) => {
  const userId = req.body._id;
  console.log(req.body);
  console.log(`userId=${userId}`);
  try {
    const posts = await PostModel.find({ user: userId }).populate('user').exec();
    console.log('Posts: ', posts);
    res.json(posts);
  } catch (error) {
    console.log('ERROR:  ', error);
    res.status(500).json({ message: `Failed to load POSTS for user #${userId}` });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await PostModel.findOneAndDelete({ _id: postId });
    // console.log('Deleted from a base: ', result); // Fuck it afterwards !
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
  console.log('Tags: ', req.body.tags);
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
