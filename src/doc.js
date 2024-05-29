// var words = [
//   'a',
//   'about',
//   'all',
//   'also',
//   'and',
//   'as',
//   'at',
//   'be',
//   'because',
//   'but',
//   'by',
//   'can',
//   'come',
//   'could',
//   'day',
//   'do',
//   'even',
//   'find',
//   'first',
//   'for',
//   'from',
//   'get',
//   'give',
//   'go',
//   'have',
//   'he',
//   'her',
//   'here',
//   'him',
//   'his',
//   'how',
//   'if',
//   'in',
//   'into',
//   'it',
//   'its',
//   'just',
//   'know',
//   'like',
//   'look',
//   'make',
//   'man',
//   'many',
//   'me',
//   'more',
//   'my',
//   'new',
//   'no',
//   'not',
//   'now',
//   'of',
//   'on',
//   'one',
//   'only',
//   'or',
//   'other',
//   'our',
//   'out',
//   'people',
//   'say',
//   'see',
//   'she',
//   'so',
//   'some',
//   'take',
//   'tell',
//   'than',
//   'that',
//   'the',
//   'their',
//   'them',
//   'then',
//   'there',
//   'these',
//   'they',
//   'thing',
//   'think',
//   'this',
//   'those',
//   'time',
//   'to',
//   'two',
//   'up',
//   'use',
//   'very',
//   'want',
//   'way',
//   'we',
//   'well',
//   'what',
//   'when',
//   'which',
//   'who',
//   'will',
//   'with',
//   'would',
//   'year',
//   'you',
//   'your',
// ]

// var currentWord = ''
// var currentInput = ''
// var future = []
// var timerconfig = 30
// var futureconfig = 20
// var timer
// var timerId = null
// var timerRunning = false
// var correctCount = 0
// var correctKeyCount = 0
// var incorrectCount = 0
// var incorrectKeyCount = 0
// var focused = false

// var maincolorconfig = getComputedStyle(
//   document.documentElement
// ).getPropertyValue('--main-color')
// var subcolorconfig = getComputedStyle(
//   document.documentElement
// ).getPropertyValue('--sub-color')
// var bgcolorconfig = getComputedStyle(document.documentElement).getPropertyValue(
//   '--bg-color'
// )

// //timer ----------------------------------------------------------------------------------------------------------------------

// function countdown() {
//   if (timer == 0) {
//     clearTimeout(timerId)
//     timerRunning = false
//     showResult()
//   } else {
//     $('.timer').text(timer)
//     timer--
//   }
// }

// function showResult() {
//   focus(false)
//   // $('.result .key .res').html(correctKeyCount+'/<span style="color:#F44336">'+incorrectKeyCount+'</span>'+' ('+(correctKeyCount+incorrectKeyCount)+')');
//   // $('.result .wrd .res').html(correctCount+'/<span style="color:#F44336">'+incorrectCount+'</span>');
//   $('.title').text('mmtt/result')
//   $('.result .key .res').html(correctKeyCount + '/' + incorrectKeyCount)
//   $('.result .wrd .res').html(correctCount + '/' + incorrectCount)
//   $('.result .acc .res').html(
//     Math.round(
//       (correctKeyCount / (correctKeyCount + incorrectKeyCount)) * 100
//     ) + '%'
//   )
//   $('.result .wpm .res').html(
//     (correctCount + incorrectCount) * (60 / timerconfig)
//   )

//   $('.test')
//     .css('opacity', '1')
//     .stop(true, true)
//     .animate({ opacity: 0 }, 250, function () {
//       $('.test').addClass('hidden')
//       $('.result')
//         .css('opacity', '0')
//         .removeClass('hidden')
//         .stop(true, true)
//         .animate({ opacity: 1 }, 250)
//     })
// }

// // other funcitons ------------------------------------------------------------------------------------------------------------

// function flashIndicator(correct) {
//   let color = maincolorconfig
//   let subcolor = subcolorconfig
//   if (!correct) {
//     color = '#F44336'
//   }

//   $('.indicator')
//     .stop(true, true)
//     .animate({ backgroundColor: color }, 0)
//     .animate({ backgroundColor: subcolor }, 500)
// }

// function focus(inOrOut) {
//   if ((inOrOut && focused) || (!inOrOut && !focused)) return
//   focused = inOrOut
//   let opacity = 1
//   let titlecol = maincolorconfig
//   if (inOrOut) {
//     opacity = 0
//     titlecol = subcolorconfig
//   }
//   $('.menu').animate({ opacity: opacity }, 500)
//   $('.footer').animate({ opacity: opacity }, 500)
//   $('.title').animate({ color: titlecol }, 500)
// }

// // input ---------------------------------------------------------------------------------------------------------------------

// function wordToInput(word) {
//   $('.inputBox').empty()
//   for (let i = 0; i < word.length; i++) {
//     $('.inputBox').append('<letter>' + word[i] + '</letter>')
//   }
// }

// function scoreKey(keystroke) {
//   if (keystroke == currentWord[currentInput.length - 1]) {
//     correctKeyCount++
//   } else {
//     incorrectKeyCount++
//   }
//   console.log('cor ' + correctKeyCount)
//   console.log('err ' + incorrectKeyCount)
//   // console.log(currentWord);
//   // console.log(keystroke);
//   // console.log(currentInput);
// }

// function compareInput() {
//   $('.inputBox').empty()
//   let ret = ''
//   for (let i = 0; i < currentInput.length; i++) {
//     if (currentWord[i] == currentInput[i]) {
//       ret += '<letter class="correct">' + currentInput[i] + '</letter>'
//     } else {
//       ret += '<letter class="incorrect">' + currentInput[i] + '</letter>'
//     }
//   }
//   if (currentInput.length < currentWord.length) {
//     for (let i = currentInput.length; i < currentWord.length; i++) {
//       ret += '<letter>' + currentWord[i] + '</letter>'
//     }
//   }
//   $('.inputBox').html(ret)
// }

// // future ---------------------------------------------------------------------------------------------------------------------

// function showFuture() {
//   $('.future').empty()
//   let text = ''
//   for (let i = 0; i < futureconfig; i++) {
//     text += '<div class="futureBox">' + future[i] + '</div>'
//   }
//   $('.future').html(text)
// }

// function moveFuture() {
//   currentWord = future[0]
//   wordToInput(future[0])
//   for (let i = 0; i < futureconfig - 1; i++) {
//     future[i] = future[i + 1]
//   }
//   initLastFuture()
// }

// //init functions ----------------------------------------------------------------------------------------------------------------

// function initInput() {
//   currentInput = ''
//   $('.inputBox').empty()
//   let randomWord = words[Math.floor(Math.random() * words.length)]
//   for (let i = 0; i < randomWord.length; i++) {
//     $('.inputBox').append('<letter>' + randomWord[i] + '</letter>')
//   }
//   currentWord = randomWord
// }

// function initFuture() {
//   for (let i = 0; i < futureconfig; i++) {
//     let randomWord = words[Math.floor(Math.random() * words.length)]
//     future.push(randomWord)
//   }
//   showFuture()
// }

// function initLastFuture() {
//   let randomWord = words[Math.floor(Math.random() * words.length)]
//   future[futureconfig - 1] = randomWord
// }

// function init() {
//   $('.test')
//     .css('opacity', '0')
//     .removeClass('hidden')
//     .stop(true, true)
//     .animate({ opacity: 1 }, 250)

//   $('.title').text('nbtt/type')
//   future = []
//   correctCount = 0
//   incorrectCount = 0
//   correctKeyCount = 0
//   incorrectKeyCount = 0
//   timer = timerconfig - 1
//   $('.timer').text(timerconfig)
//   timerRunning = false
//   clearTimeout(timerId)
//   timerId = null
//   initInput()
//   initFuture()
//   focus(false)
// }

// // event handlers ------------------------------------------------------------------------

// //letters
// $(document).keypress(function (event) {
//   if (event['keyCode'] == 13) return
//   if (event['keyCode'] == 32) return
//   currentInput += event['key']
//   if (timerId == null) {
//     timerId = setInterval(countdown, 1000)
//     timerRunning = true
//   }
//   scoreKey(event['key'])
//   compareInput()
//   if (timerRunning && !focused) focus(true)
// })

// //mouse
// $(document).mousemove(function (event) {
//   focus(false)
// })

// //other
// $(document).keydown(function (event) {
//   //tab
//   if (event['keyCode'] == 9) {
//     event.preventDefault()
//     if ($('.result').hasClass('hidden')) {
//       $('.test')
//         .css('opacity', '1')
//         .stop(true, true)
//         .animate({ opacity: 0 }, 250, function () {
//           init()
//         })
//     } else {
//       $('.result')
//         .stop(true, true)
//         .animate({ opacity: 0 }, 250, function () {
//           $('.result').addClass('hidden')
//           init()
//         })
//     }
//   }

//   //backspace
//   if (event['keyCode'] == 8) {
//     currentInput = currentInput.substring(0, currentInput.length - 1)
//     compareInput()
//   }

//   //space
//   if (event['keyCode'] == 32) {
//     if (currentInput == '') return
//     if (!timerRunning) return
//     if (timerId == null) {
//       timerId = setInterval(countdown, 1000)
//       timerRunning = true
//     }
//     if (currentWord == currentInput) {
//       currentInput = ''
//       correctCount++
//       flashIndicator(true)
//     } else {
//       currentInput = ''
//       incorrectCount++
//       flashIndicator(false)
//     }
//     $('.input')
//       .stop(true, true)
//       .animate({ marginLeft: 0 }, 0, function () {
//         $('.input')
//           .stop(true, true)
//           .animate(
//             { marginLeft: $('.input').outerWidth(true) },
//             0,
//             function () {
//               $('.input').stop(true, true).animate({ marginLeft: 0 }, 200)
//             }
//           )
//         compareInput()
//         moveFuture()
//         showFuture()
//       })

//     // compareInput();
//     // moveFuture();
//     // showFuture();
//   }
// })

// init()
// $('.test')
//   .css('opacity', '0')
//   .removeClass('hidden')
//   .stop(true, true)
//   .animate({ opacity: 1 }, 250)
