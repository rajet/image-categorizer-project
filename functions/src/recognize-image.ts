import * as functions from 'firebase-functions';
import { environment } from '../../src/environments/environment';
import { ImageAnnotatorClient } from '@google-cloud/vision';

export const analyzeImage = functions
  .region('europe-west6')
  .https.onCall(async (data, context) => {
    require('cors')({ origin: true });
    const CONFIG = {
      credentials: {
        private_key: environment.vision.private_key,
        client_email: environment.vision.client_email,
      },
    };

    const labelClient = new ImageAnnotatorClient(CONFIG);

    const imageData = data.replace(/^data:image\/\w+;base64,/, ''); // Remove the data:image/jpeg;base64, prefix
    const decodedImageData = Buffer.from(imageData, 'base64');

    const request = {
      image: { content: decodedImageData.toString('base64') },
      features: [
        {
          type: 'LABEL_DETECTION',
          maxResults: 10,
        },
        {
          type: 'OBJECT_LOCALIZATION',
          maxResults: 10,
        },
      ],
    };
    functions.logger.info('data: ', data);
    functions.logger.info('request generated: ', request);
    let labelDetectionResult;
    if (labelClient.annotateImage) {
      [labelDetectionResult] = await labelClient.annotateImage(request);
      functions.logger.info('client for labelDetection found!');
    }

    functions.logger.info('result has been catched: ', labelDetectionResult);

    const labelAnnotations =
      labelDetectionResult && labelDetectionResult.labelAnnotations
        ? labelDetectionResult.labelAnnotations.map((annotation) => ({
            score: annotation.score,
            description: annotation.description,
          }))
        : [];
    const objectAnnotations =
      labelDetectionResult && labelDetectionResult.localizedObjectAnnotations
        ? labelDetectionResult.localizedObjectAnnotations.map((annotation) => ({
            score: annotation.score,
            description: annotation.name,
          }))
        : [];
    const combinedAnnotations = [...labelAnnotations, ...objectAnnotations];
    if (combinedAnnotations.length > 0) {
      return combinedAnnotations;
    }
    return [];
    // functions.logger.info(
    //   'result has been catched: ',
    //   objectLocalizationResult?.localizedObjectAnnotations,
    // );

    /*    const extractAnnotations = (result: IAnnotateImageResponse | undefined) =>
      result?.labelAnnotations || [];

    const labelAnnotations = extractAnnotations(labelDetectionResult);
    const objectAnnotations = extractAnnotations(objectLocalizationResult);
    functions.logger.info('labelAnnotations: ', labelAnnotations);
    functions.logger.info('objectAnnotations: ', objectAnnotations);
    // Combine the two arrays or use one if the other is empty.
    const annotations =
      labelAnnotations.length > 0
        ? labelAnnotations.concat(objectAnnotations)
        : objectAnnotations;

    // Return an empty object if no annotations are found.
    if (annotations.length === 0) {
      return [];
    }

    // Map through the annotations to return the desired format.
    return annotations.map((annotation) => ({
      score: annotation.score,
      description: annotation.description,
    }));*/
    // let annotations;
    // if (labelDetectionResult && labelDetectionResult.labelAnnotations) {
    //   if (
    //     objectLocalizationResult &&
    //     objectLocalizationResult.labelAnnotations
    //   ) {
    //     annotations = labelDetectionResult.labelAnnotations.concat(
    //       objectLocalizationResult.labelAnnotations,
    //     );
    //   }
    //   annotations = labelDetectionResult.labelAnnotations;
    // }
    // if (
    //   !annotations &&
    //   objectLocalizationResult &&
    //   objectLocalizationResult.labelAnnotations
    // ) {
    //   annotations = objectLocalizationResult.labelAnnotations;
    // }
    // if (!annotations) {
    //   return {};
    // }
    // return annotations.map((annotation) => ({
    //   score: annotation.score,
    //   description: annotation.description,
    // }));
  });
