import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async(req : Request, res : Response) => {
    const imageUrl = req.query.image_url;

    if (!imageUrl) {
     return res.status(400)
                .send("image_url is a required query param")
    }
    const filteredImagePath : string = await filterImageFromURL(imageUrl);   
    //check we have a valid response from previous step
    if (!filteredImagePath) {
      return res.status(500)
                .send("The operation could not be completed. check image_url is valid or retry");
    }
    return res.status(200)
          .sendFile(filteredImagePath, function() {deleteLocalFiles([filteredImagePath])});

  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req : Request, res : Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();