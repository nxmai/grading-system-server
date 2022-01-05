export default (data, statusCode, response) => {
  console.log(']> sendResponse: ', data);
  response.status(statusCode).json({
    status: 'success',
    data,
  });
};
