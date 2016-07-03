// CONTROLLER
angular.module('7minWorkout')
    .controller('WorkoutController', ['$scope', '$interval', '$location', '$timeout', 'workoutHistoryTracker',
    function ($scope, $interval, $location, $timeout, workoutHistoryTracker) {

    // MODELS
    function WorkoutPlan(args) {
        this.exercises = [];
        this.name = args.name;
        this.title = args.title;
        this.restBetweenExercise = args.restBetweenExercise;

        // Ukupno vreme vezbi, sabira sve
        this.totalWorkoutDuration = function () {
            if (this.exercises.length == 0) return 0;
            var total = 0;
            angular.forEach(this.exercises, function (exercise) {
                total += exercise.duration;
            });
            return this.restBetweenExercise * (this.exercises.length - 1) + total;
        };
    }

    function Exercise(args) {
        this.name = args.name;
        this.title = args.title;
        this.image = args.image;
        this.description = args.description;
        this.related = {};
        this.related.videos = args.videos;
        this.nameSound = args.nameSound;
        this.procedure = args.procedure;
    }

    // Vars
    var restExercise;
    var exerciseIntervalPromise;


    // METHODS

    // Ucitava vezbe (createWorkout()), i pokrece prvu vezbu
    var startWorkout = function () {
        $scope.workoutPlan = createWorkout();

        // Total value
        $scope.workoutTimeRemaining = $scope.workoutPlan.totalWorkoutDuration();

        // restExercize je samo odmor, samo zbog lakse implementacije
        restExercise = {
            details: new Exercise({ name: 'rest',
                title: 'Relax!',
                description: 'Relax a bit!',
                image: 'img/rest.png',
            }),
            duration: $scope.workoutPlan.restBetweenExercise
        };

        // Za audio
        $scope.currentExerciseIndex = -1;

        // Service za pracenje/history vezbi
        workoutHistoryTracker.startTracking();

        // ovo je uzrok "buga" kad audio ne pusta odgovarajuci wav za next exercize,
        // tacnije shift se ne prati preko $watch.('currentExercise')
        // startExercise($scope.workoutPlan.exercises.shift()); // pokreni prvu vezbu
        startExercise($scope.workoutPlan.exercises[0]); // pokreni prvu vezbu
    };

    // Lista vezbi
    var createWorkout = function () {
        var workout = new WorkoutPlan({
            name: '7minWorkout',
            title: '7 Minute Workout',
            restBetweenExercise: 10
        });

        workout.exercises.push({
            details: new Exercise({
                name: "jumpingJacks",
                title: "Jumping Jacks",
                description: "A jumping jack or star jump, also called side-straddle hop is a physical jumping exercise.",
                image: "img/JumpingJacks.png",
                nameSound: "content/jumpingjacks.wav",
                videos: ["dmYwZH_BNd0", "BABOdJ-2Z6o", "c4DAnQ6DtF8"],
                procedure: "Assume an erect position, with feet together and arms at your side.\
                          <br/>Slightly bend your knees, and propel yourself a few inches into the air.\
                          <br/>While in air, bring your legs out to the side about shoulder width or slightly wider.\
                          <br/>As you are moving your legs outward, you should raise your arms up over your head; arms should be slightly bent throughout the entire in-air movement.\
                          <br/>Your feet should land shoulder width or wider as your hands meet above your head with arms slightly bent"
            }),
            duration: 30
        });
        workout.exercises.push({
            details: new Exercise({
                name: "wallSit",
                title: "Wall Sit",
                description: "A wall sit, also known as a Roman Chair, is an exercise done to strengthen the quadriceps muscles.",
                image: "img/wallsit.png",
                nameSound: "content/wallsit.wav",
                videos: ["y-wV4Venusw", "MMV3v4ap4ro"],
                procedure: "Place your back against a wall with your feet shoulder width apart and a little ways out from the wall.\
                            <br/>Then, keeping your back against the wall, lower your hips until your knees form right angles. "
            }),
            duration: 30
        });
        workout.exercises.push({
            details: new Exercise({
                name: "pushUp",
                title: "Push Up",
                description: "A push-up is a common exercise performed in a prone position by raising and lowering the body using the arms",
                image: "img/Pushup.png",
                nameSound: "content/pushups.wav",
                videos: ["Eh00_rniF8E", "ZWdBqFLNljc", "UwRLWMcOdwI", "ynPwl6qyUNM", "OicNTT2xzMI"],
                procedure: "Lie prone on the ground with hands placed as wide or slightly wider than shoulder width. \
                            Keeping the body straight, lower body to the ground by bending arms at the elbows. \
                            Raise body up off the ground by extending the arms."
            }),
            duration: 30
        });


        return workout;
    };

    // Ovo pokrece vezbe i prikazuje progres $interval
    var startExercise = function (exercisePlan) {
        $scope.currentExercise = exercisePlan;
        $scope.currentExerciseDuration = 0;

        // Za audio
        if (exercisePlan.details.name !== 'rest') {
            $scope.currentExerciseIndex++;

            // Event emit
            // $scope.$emit('event:workout:exerciseStarted', exercisePlan.details);
            $scope.$emit(appEvents.workout.exerciseStarted, exercisePlan.details); // refaktorisano da koristi value()
            // posto je value() deo naseg custom service a on je vec injectovan, auto je dostupan i u ovom ctrl
        }

        // Refaktored zbog pauze
        // Target za pause/resume
        exerciseIntervalPromise = startExerciseTimeTracking();
    };

    // Keypress
    // $event iz view, sadrze ga sve directives koje reaguju na evente
    var onKeyPressed = function(event) {
        // KeyboardEvent.which vraca numericki kod
        if (event.which === 80 || event.which ===112) { // p ili P
            $scope.pauseResumeToggle();
        }
    };

    // Start/Pause/Resume logic
    var startExerciseTimeTracking = function() {
        // Dvostruko pracenje
        // $interval(fn(), delay, count)
        // count je bitan zbog promise
        var promise = $interval(function() {
            $scope.currentExerciseDuration++;
            $scope.workoutTimeRemaining--;
            // rezultat count se stalno updateuje tako da kad se nastavi uz pomoc resumeWOrkout on nastavlja countdown odakle treba
        }, 1000, $scope.currentExercise.duration - $scope.currentExerciseDuration);

        // na kraju $interval se izvrsava promise ?
        promise.then(function() {
            var next = getNextExercise($scope.currentExercise);
            if (next) {
                startExercise(next);
            } else {
                // refaktored method, ujedno i history tracker
                workoutComplete();
            }
        });

        return promise;
    };

    // Method za history tracker service
    var workoutComplete = function() {
        workoutHistoryTracker.endTracking(true); // true znaci da je vezba zavrsena
        $location.path('/finish'); // redirect
    };

    // PAUSE START ...
    $scope.pauseWorkout = function () {
        $interval.cancel(exerciseIntervalPromise);
        $scope.workoutPaused = true;
    };

    $scope.resumeWorkout = function () {
        exerciseIntervalPromise = startExerciseTimeTracking();
        $scope.workoutPaused = false;
    };

    $scope.pauseResumeToggle = function () {
        if ($scope.workoutPaused) {
            $scope.resumeWorkout();
        }
        else {
            $scope.pauseWorkout();
        }
    };

    // Ucitava jednu za drugom vezbe i izmedju njih restExecercise (pauzu)
    var getNextExercise = function (currentExercisePlan) {
        var nextExercise = null;
        if (currentExercisePlan === restExercise) {
            // nextExercise = $scope.workoutPlan.exercises.shift(); // old
            nextExercise = $scope.workoutPlan.exercises[$scope.currentExerciseIndex + 1];
        }
        else {
            // if ($scope.workoutPlan.exercises.length !== 0) { // old
            if ($scope.currentExerciseIndex < $scope.workoutPlan.exercises.length - 1) {
                nextExercise = restExercise;
            }
        }
        return nextExercise;
    };


    // START LOOP
    var init = function () {
        startWorkout();
    };
    init();

}]);

// CONTROLLER
angular.module('7minWorkout')
    .controller('WorkoutAudioController', ['$scope', '$timeout', function($scope, $timeout) {
        $scope.exercisesAudio = [];

        // Popuni exerciseAudio[] kada se ucita workoutPlan
        var workoutPlanwatch = $scope.$watch('workoutPlan', function(newValue, oldValue) {
            if (newValue) { // newValue === workoutPlan
                angular.forEach( $scope.workoutPlan.exercises,
                    function(exercise) {
                        $scope.exercisesAudio.push({
                            src: exercise.details.nameSound,
                            type: "audio/wav"
                        });
                    });
                workoutPlanwatch(); // unbind $watch, zato je $watch ubacen u var pise u doc za return
            }
        });

        // AUDIO
        // Rest period >> nextUpAudio
        $scope.$watch('currentExercise', function(newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                if ($scope.currentExercise.details.name === 'rest') {
                    $timeout(function() {
                        $scope.nextUpAudio.play();
                    }, 2000);
                    $timeout(function() {
                        $scope.nextUpExerciseAudio.play( // playlist exerciseAudio[]
                            $scope.currentExerciseIndex + 1, true
                        );
                    }, 3000);
                }
            }
        });

        // Svake sekunde >> Halfway, aboutToComplete
        $scope.$watch('currentExerciseDuration', function(newValue, oldValue) {
            if (newValue) {
                if (newValue == Math.floor($scope.currentExercise.duration / 2)
                    && $scope.currentExercise.details.name !== 'rest') {
                        $scope.halfWayAudio.play();
                    }
                else if (newValue == $scope.currentExercise.duration - 3) {
                    $scope.aboutToCompleteAudio.play();
                }
            }
        });

        // Pauziraj audio
        $scope.$watch('workoutPaused', function (newValue, oldValue) {
            if (newValue) {
                $scope.ticksAudio.pause();
                $scope.nextUpAudio.pause();
                $scope.nextUpExerciseAudio.pause();
                $scope.halfWayAudio.pause();
                $scope.aboutToCompleteAudio.pause();
            }
            else {
                // Resume
                $scope.ticksAudio.play();
                // currentTime isto sto i position, vreme na kojem je pauzirano, s obzirom da su ranije pauzirani plugin ih automatski resumuje
                if ($scope.halfWayAudio.currentTime > 0 && $scope.halfWayAudio.currentTime < $scope.halfWayAudio.duration) $scope.halfWayAudio.play();
                if ($scope.aboutToCompleteAudio.currentTime > 0 && $scope.aboutToCompleteAudio.currentTime < $scope.aboutToCompleteAudio.duration) $scope.aboutToCompleteAudio.play();
            }
        });

        var init = function() {

        };
        init();
}]);
