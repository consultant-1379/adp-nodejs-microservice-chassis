import TicketModel from '../models/TicketModel.js';
import HTTP_STATUS from '../utils/httpStatus.js';

export default (req, res, next) => {
  const { id } = req.params;
  const params = { ...req.body };
  if (typeof params.title !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Title is incorrect or missing.');
  }
  if (typeof params.description !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Description is incorrect or missing.');
  }

  if (!params.dateCreated) {
    params.dateCreated = Date.now();
  }

  if (id) {
    params.id = id;
  }

  req.ticket = new TicketModel(params);
  return next();
};
