var config = {
    apiKey: "AIzaSyA9uJ9o2Bz6-hZQvw63Sjr38uaOcT2RmFQ",
    authDomain: "train-scheduler-2e225.firebaseapp.com",
    databaseURL: "https://train-scheduler-2e225.firebaseio.com",
    projectId: "train-scheduler-2e225",
    storageBucket: "train-scheduler-2e225.appspot.com",
    messagingSenderId: "858134906805"
};
firebase.initializeApp(config);

console.log("I tried to do the RPS game but didn't have time, so here I am, being a quitter.")

var database = firebase.database();

$("#new-train").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var name = $("#train-name").val().trim();
    var dest = $("#destination").val().trim();
    var start = moment($("#first-train").val().trim(), "HH:mm").format("X");
    var freq = $("#frequency").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: name,
        dest: dest,
        start: start,
        freq: freq
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");
});

// Adding to firebase
database.ref().on("child_added", function (childSnapshot) {

    // Store everything into a variable.
    var name = childSnapshot.val().name;
    var dest = childSnapshot.val().dest;
    var start = childSnapshot.val().start;
    var freq = parseInt(childSnapshot.val().freq);

    // Prettify the start
    var start = moment.unix(start).format("HH:mm");

    // Calculating next train here
    // Get current time and subtract start time, get result in minutes
    var diff = moment().diff(moment(start,"X"),"minutes");
    // Modulus time difference by frequency to get remaining time (time since last train)
    var rem = diff%freq;
    // Next train
    var next = freq-rem;

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(dest),
        $("<td>").text(start),
        $("<td>").text(next + " min")
    );

    // Append the new row to the table
    $("#train-table > tbody").prepend(newRow);
});
