
// QR Scanner Code
// create a new scanner instance
let scanner = new Instascan.Scanner({
    video: document.getElementById('preview'),
    mirror: false,
    scanPeriod: 5,
    continuous: true,
    backgroundScan: false,
    refractoryPeriod: 5000,
    // specify the camera source (0 for back camera, 1 for front camera)
    facingMode: { exact: "environment" }
  });
  
  // add a listener for when a code is scanned
  scanner.addListener('scan', function (content) {
    console.log(content);
  });
  
  // start scanning
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[1]);
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });
  
// const socket = io();
// let scanner = new Instascan.Scanner(
//     {
//         video: document.getElementById('preview')
//     }
// );
// var a = [];
// scanner.addListener('scan', function(content) {
//    console.log(content)
//    var a = content;
//     socket.emit('getUserOne',(content));   
// });

// Instascan.Camera.getCameras().then(cameras => 
// {
//     if(cameras.length > 0){
//         scanner.start(cameras[1]);
//     } else {
//         console.error("camera not started");
//     }
// });
   
 // Start Button
 function getStarted() {
    document.getElementById('bg').style.display = 'none'
    document.getElementById('btn').style.display = 'none'
    document.getElementById('preview').style.display = 'block'
    document.getElementById('bg2').style.display = 'block'
    document.getElementById('btn2').style.display = 'block'
    document.getElementById('qr').style.display = 'block'
}
// Manual QR Enter
let plzField = document.getElementById("btn2");
plzField.addEventListener("click", function() {
    let e = document.getElementById("qr").value
    socket.emit('getUserOne',e);
});  
// User Details From DB
socket.on('userDetailsOne', (e) => {
    document.getElementById('myForm').style.display = 'block'
    document.getElementById('home').style.display = 'block'
    document.getElementById('preview').style.display = 'none'
    document.getElementById('qr').style.display = 'none'
    document.getElementById('btn2').style.display = 'none'
    document.getElementById('name').innerText = e.name;
    document.getElementById('company').innerText = e.company;
})

// Home For Refresh
socket.on('navigate', (e) => {
    location.reload()
})