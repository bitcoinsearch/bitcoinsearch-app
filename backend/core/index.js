async function init (app, mode) {  
    const routes= require('./routes');
    await routes.init(app);  
  
    return { app };
  }
  
  async function shutdown () {
    // TODO: Implement the SHUTDOWN Function
  }
  
  module.exports= {
    init: init,
    shutdown: shutdown
  };
  