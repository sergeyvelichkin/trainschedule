// Initialize Firebase
var config = {
    apiKey: "AIzaSyALiBa8NOYiepdjwe8cDWniyrFOS1CmZJk",
    authDomain: "trainschedule-a1579.firebaseapp.com",
    databaseURL: "https://trainschedule-a1579.firebaseio.com",
    projectId: "trainschedule-a1579",
    storageBucket: "trainschedule-a1579.appspot.com",
    messagingSenderId: "641845384485"
  };
  firebase.initializeApp(config);


  var database = firebase.database();


  var name = "";
  var destination = "";
  var firstTrainTime = "";
  var freq = "";

  // Capture Button Click
  $("#add-train").on("click", function(event) {
    event.preventDefault();

    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrainTime = $("#time-input").val().trim();
    freq = $("#freq-input").val().trim();

    // Code for the push
    database.ref().push({

      name: name,
      destination: destination,
      firstTrainTime: firstTrainTime,
      freq: freq,

    });
  });


 database.ref().on("child_added", function(childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrainTime);
    console.log(childSnapshot.val().freq);


    var firstTimeConverted = moment(childSnapshot.val().firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % childSnapshot.val().freq;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = childSnapshot.val().freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    // full list of items to the well
    $("tbody").append(`
             <tr>
                <th scope="row">${childSnapshot.val().name}</th>
                <td>${childSnapshot.val().destination}</td>
                <td>${childSnapshot.val().freq}</td>
                <td>${moment(nextTrain).format("hh:mm")}</td>
                <td>${tMinutesTillTrain}</td>
            </tr>
    
    `);

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
