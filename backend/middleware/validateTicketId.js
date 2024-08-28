import ticketingService from '../services/ticketingService.js';
import HTTP_STATUS from '../utils/httpStatus.js';

export default (req, res, next) => {
  const { id } = req.params;
  if (!ticketingService.idExists(id)) {
    return res.status(HTTP_STATUS.NOT_FOUND).send('There is no ticket with this id.');
  }
  return next();
};
