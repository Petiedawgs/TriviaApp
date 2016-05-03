var myapp = angular.module('app-trivia', ['ngRoute']);

myapp.controller('ctrl-trivia', function($scope, $http, $timeout, $route, $location, $routeParams, $window) { //, $window, 

    $scope.$route = $route;
    $scope.my_trivia = [];
    $scope.my_questions = [];
    $scope.my_questiongraphics = [];
    

    //http GET request of questions.json file data
    $http({
            method: 'GET',
            url: 'json/questions.json'
        })
        .success(function(data, status, headers, config) {

            //set questions.json data to angular scope variable my_trivia
            $scope.my_trivia = data;
            // console.log('Trivia objects: ' + $scope.my_trivia);
            // console.log($scope.my_trivia[0]);
            // console.log('Trivia length: ' + $scope.my_trivia.length);

            var x = 0;
            var i = 0;
            var uids = [];

            var uidfound = null;

            //Get 5 random unique numbers to select questions from questions.JSON file later
            while (uids.length < 5) {

                x = f_randomint(0, 19);
                uidfound = false;

                //Make sure random number was not selcted already
                uidloop:
                    for (var u = 0; u < uids.length; u++) {
                        //if x is in teh uid array which holds random numebrs selected then break loop try new random number again        
                        if (uids[u] == x) {
                            uidfound = true;
                            break uidloop;
                        }

                    }

                //if uidfound is false that means random number selected was not in array and should be added
                if (!uidfound) {
                    uids.push(x);
                }

                // console.log('U Iterator: ' + u);
                // console.log('Random INT: ' + x);
                // console.log('UID Array: ' + uids);
                // console.log('UID Length: ' + uids.length);    
                // console.log('UIDFound: ' + uidfound + '\n\n');

            }
            x = 0;


            i = uids.length;
            while (i--) {

                //Create a nested array first array will be the question, nested array within question will be result and options
                //uids[i] is the array holding which question to select from the $scope.my_trivia array.
                $scope.my_questions[i] = $scope.my_trivia[uids[i]].question;
                // console.log('\n\nQuestion title and graphic: ' + $scope.my_questions[i].title + ',\n' + $scope.my_questions[i].graphicUrl);

                //Get options length.  The options length will be used for the result position.
                var opts = $scope.my_trivia[uids[i]].options.length;
                // console.log('Question options length: ' + opts);

                //Get result first and place last in nested question options array using options length value.
                // console.log($scope.my_trivia[uids[i]].result.title);
                $scope.my_questions[i]['result'] = $scope.my_trivia[uids[i]].result.title;
                // console.log('Question result ' + $scope.my_questions[i]['result']);

                //Now push the options to the nested question options array Q[#]R/O[#]
                while (opts--) {
                    $scope.my_questions[i]['option' + opts] = $scope.my_trivia[uids[i]].options[opts].title;
                    // console.log('Question option ' + opts + ': ' + $scope.my_questions[i]['option'+opts]);
                }

            }

            //Just to see the nested array data in JSON format
            // console.log(JSON.stringify($scope.my_questions));


            //This section will deal with only selecting and displaying one question in the model and in the view
            //Also will set the colors classes when selecting correct and wrong answers
            $scope.question_index = 0;
            $scope.my_correct = 0;
            $scope.my_wrong = 0;
            $scope.my_results = [];
            $scope.myclass = ['correct', 'wrong'];
            $scope.f_nextquestion = function(e) {

                // console.log(e.target.value);
                // console.log(e.target.id);
                // console.log('Compare: ' + e.target.value + ', to question result: ' + $scope.my_questions[$scope.question_index]['result'])
                if (e.target.value == $scope.my_questions[$scope.question_index]['result']) {


                   
                    var myel = angular.element( document.querySelector('#'+e.target.id));
                    // console.log(myel.addClass('correct'));                   
                    myel.addClass('correct');
                    $scope.my_correct++;

                } else {
                   
                    var myel = angular.element( document.querySelector('#'+e.target.id));
                    // console.log(myel.addClass('correct'));                   
                    myel.addClass('wrong');
                    $scope.my_wrong++;
                   
                    myel = angular.element( document.querySelector('button[value="'+$scope.my_questions[$scope.question_index]['result']+'"'))
                    myel.addClass('correct');
                                       
                }
                
                
                $timeout(function() {

                    if ($scope.question_index == $scope.my_questions.length) {                                                
                        myel = angular.element( document.querySelector('#footer'));
                        myel.addClass('yellowfooter');
                        $scope.my_wrong = $scope.my_wrong.toString() + '0';
                        $scope.my_correct = $scope.my_correct.toString() + '0';
                    } else {

                        $scope.question_index++;

                    }
                }, 500);

            };

            $scope.f_playagain = function() {
                
                // $location.path('');
                $scope.$route.reload();
                // $scope.question_index = 0;
                $window.location.reload();
            }
        })

    .error(function(data, status, headers, config) {
        console.log('Data: ' + data + ', Status: ' + status + ', Headers: ' + headers + ', Config: ' + config);
    });
});


function f_randomint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
