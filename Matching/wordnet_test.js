var natural = require('natural');
var wordnet = new natural.WordNet();

// wordnet.lookup('butchery', function(results) {
//   results.forEach(function(result) {
//     console.log('------------------------------------');
//     console.log(JSON.stringify(result));
//   });
// });

wordnet.get(4081281, 'n', function(result) {
    // console.log('------------------------------------');
    console.log(result)
    // result.ptrs.forEach(function(pointer) {
    //   if (pointer.pointerSymbol === '@') {
    //     console.log(pointer.synsetOffset);
    //   }
    // });
});

natural.WuPalmer('office', 'nightlife', function(infocnt) {
  console.log('Max: ' + infocnt);
});

// wordnet.lookup('cafe', function(results) {
//   var startingNodes = [];
//   results.forEach(function(result) {
//     if (result.pos === 'n') startingNodes.push([result.synsetOffset]);
//   });
//   wordnet.getPathsToEntity(startingNodes, function(paths) { 
//     console.log(paths);
//   });
// });

// [ 2776631,
//   4202417,
//   3748162,
//   3953020,
//   3297735,
//   4341686,
//   21939,
//   3553,
//   21939,
//   4341686,
//   2913152,
//   4081281,
//   2935658 ].forEach(function(id) {
//   wordnet.get(id, 'n', function(result) {
//     console.log(result.lemma)
//   });
// })