import * as functions from 'firebase-functions';
import { environment } from '../../src/environments/environment';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import * as fs from 'fs';

export const analyzeImage = functions
  .region('europe-west6')
  .https.onCall(async (data, context) => {
    const CONFIG = {
      credentials: {
        private_key: environment.vision.private_key,
        client_email: environment.vision.client_email,
      },
    };
    const client = new ImageAnnotatorClient(CONFIG);
    const fileName =
      'https://firebasestorage.googleapis.com/v0/b/image-categorizer.appspot.com/o/HUMAN_LyRqTLQGVNURWTmAkafCK9.jpg?alt=media&token=ff636821-8901-4588-be68-b8d508f6e69a';

    const request = {
      image: { content: fs.readFileSync(fileName) },
      minConfidence: 0.88,
    };

    if (client.objectLocalization) {
      let result = await client.objectLocalization(request);
      functions.logger.info('result has been catched: ', result);
      return result;
    }
    return undefined;
    // const getTag = async () => {
    //
    // };
  });
