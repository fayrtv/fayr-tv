const {Matcher} = require('./matching/matcher.js');
const {Estimator} = require('./estimation/estimator.js');

let projectionTransform = null;
let matchingDataList = null;
let debugMode = false;
let matcher = null;
let estimator = null;

onmessage = (msg) => {
  const {data} = msg;

  if (data.type === 'setup') {
    projectionTransform = data.projectionTransform;
    matchingDataList = data.matchingDataList;
    debugMode = data.debugMode;
    matcher = new Matcher(data.inputWidth, data.inputHeight, debugMode);
    estimator = new Estimator(data.projectionTransform);
  }
  else if (data.type === 'match') {
    const interestedTargetIndexes = data.targetIndexes;

    let matchedTargetIndex = -1;
    let matchedModelViewTransform = null;
    let matchedDebugExtra = null;

    for (let i = 0; i < interestedTargetIndexes.length; i++) {
      const matchingIndex = interestedTargetIndexes[i];

      const {keyframeIndex, screenCoords, worldCoords, debugExtra} = matcher.matchDetection(matchingDataList[matchingIndex], data.featurePoints);
      matchedDebugExtra = debugExtra;

      if (keyframeIndex !== -1) {
	const modelViewTransform = estimator.estimate({screenCoords, worldCoords});

	if (modelViewTransform) {
	  matchedTargetIndex = matchingIndex;
	  matchedModelViewTransform = modelViewTransform;
	}
	break;
      }
    }

    postMessage({
      type: 'matchDone',
      targetIndex: matchedTargetIndex,
      modelViewTransform: matchedModelViewTransform,
      debugExtra: matchedDebugExtra
    });
  }
  else if (data.type === 'trackUpdate') {
    const {modelViewTransform, worldCoords, screenCoords} = data;
    const finalModelViewTransform = estimator.refineEstimate({initialModelViewTransform: modelViewTransform, worldCoords, screenCoords});
    postMessage({
      type: 'trackUpdateDone',
      modelViewTransform: finalModelViewTransform,
    });
  }
};

