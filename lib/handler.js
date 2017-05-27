import Constants from './constants';

const handler = fn => {
  return (req, res) => {
    const input = Object.assign({}, { params: req.params }, { query: req.query });
    const attachSignature = body => ({ author: Constants.AUTHOR, ...body });
    fn(input)
      .then(({ status, body }) => res.status(status).json(attachSignature(body)))
      .catch(({status, body}) => res.status(status).json(attachSignature(body)));
  };
};

export default handler;