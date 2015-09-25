var sendErrors = function(errors, callback){
  if(errors){
    res.status(400).send(errors);
  } else {
    callback()
  };
};

module.exports = sendErrors;
