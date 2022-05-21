
const functions = require('firebase-functions');
exports.helloWorld = functions.https.onRequest((req, res) => {
    res.send("Hello from Firebase!");
});

// exports.userDriver = functions.https.onCall(async (req, res) => {
//     try {
//         const response = await fetch(`https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app/drives.json?print=pretty`)
  
//         if (!response.ok) {
//           throw new Error('Something went wrong!');
//         }
//         const resData = await response.json();
//         console.log(resData);
//         const loadedDrives = [];
  
//         for (const key in resData) {
//             if(req.query.email === resData[key].driver || (resData[key].passangers).includes(req.query.email)){
//             loadedDrives.push(new Drive(
//             key,
//             resData[key].starting_point,
//             resData[key].destination,
//             resData[key].date,
//             resData[key].time,
//             resData[key].amount_of_people,
//             resData[key].deviation_time,
//             resData[key].driver,
//             resData[key].passangers
//           ));
//             }
//         }
        
//         return loadedDrives;
//       } catch (err) {
//         // send to custom analytics server
//         throw err;
//       }
      
// });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
