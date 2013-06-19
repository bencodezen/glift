glift.displays.rowCenter = function(
    outerBox, inBboxes, vertMargin, horzMargin, minSpacing, maxSpacing) {
  var outerWidth = outerBox.width(),
      innerWidth = outerWidth - 2 * horzMargin,
      outerHeight = outerBox.height(),
      innerHeight = outerHeight - 2 * vertMargin,
      transforms = [],
      newBboxes = [],
      elemWidth = 0;
  if (maxSpacing <= 0) {
    maxSpacing = 10000000; // some arbitrarily large number
  }

  // Adjust all the bboxes so that they are the right height.
  for (var i = 0; i < inBboxes.length; i++) {
    var bbox = inBboxes[i],
        vscale = innerHeight / bbox.height(),
        partialTransform = { xScale: vscale, yScale: vscale },
        newBbox = bbox.fixedScale(vscale);
    // glift.util.logz(bbox.width());
    // glift.util.logz(bbox.height());
    // glift.util.logz(partialTransform);
    transforms.push(partialTransform);
    newBboxes.push(newBbox);
    elemWidth += newBbox.width() + minSpacing;
  }

  // We don't need the final minSpacing, so subtract off.
  elemWidth -= minSpacing

  // Remove elements that don't fit.
  var unfitTransforms = [];
  while (innerWidth < elemWidth) {
    var rightMostBox = newBboxes.pop();
    var transform = transforms.pop();
    elemWidth -= rightMostBox.width() + minSpacing;
    unfitTransforms.push(transform);
  }

  // Find how much space to use for which parts
  var extraSpace = innerWidth - elemWidth;
  var extraSpacing = extraSpace / (transforms.length + 1);
  var elementSpacing = extraSpacing;
  var extraMargin = extraSpacing;
  if (extraSpacing > maxSpacing) {
    elementSpacing = maxSpacing;
    var totalExtraMargin = extraSpace -
        elementSpacing * (transforms.length - 1);
    extraMargin = totalExtraMargin / 2;
  }
  var left = outerBox.left() + horzMargin + extraMargin;
  var top = outerBox.top() + vertMargin;

  // Find the x and y translates.
  for (var i = 0; i < newBboxes.length; i++) {
    var newBox = newBboxes[i];
    var partialTransform = transforms[i];
    var yTranslate = top - newBbox.top();

    var xTranslate = left - newBbox.left();
    partialTransform.xMove = xTranslate;
    partialTransform.yMove = yTranslate;
    left += newBbox.width() + elementSpacing;
  }
  return transforms;
};
