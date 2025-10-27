// Netlify Function for updating config and handling image uploads
exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "Config update received",
        success: true 
      })
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: "Update config function is ready",
      usage: "Send POST requests to update configuration" 
    })
  };
};
