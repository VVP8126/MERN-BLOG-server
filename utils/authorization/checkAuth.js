import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
    try {
      const decoded = jwt.verify(token, 'Very_Secret!_Key-1');
      req.userId = decoded._id;
    } catch (error) {
      // console.log('Error while token decoding', error);
      return res.status(403).json({ result: 'Access denied !' });
    }
  } else {
    return res.status(403).json({ result: 'Access denied !' });
  }
  next();
};
