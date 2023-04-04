 // Start Button
 function getStarted() {
    document.getElementById('bg').style.display = 'none'
    document.getElementById('btn').style.display = 'none'
    document.getElementById('preview').style.display = 'block'
    document.getElementById('bg2').style.display = 'block'
    document.getElementById('btn2').style.display = 'block'
    document.getElementById('qr').style.display = 'block'
    console.log('here');
}

// QR Scanner Code
const socket = io();
let scanner = new Instascan.Scanner(
    {
        video: document.getElementById('preview')
    }
);
var a = [];
scanner.addListener('scan', function(content) {
   console.log(content)
   var a = content;
    socket.emit('getUser',(content));   
});

Instascan.Camera.getCameras().then(cameras => 
{
    if(cameras.length > 0){
        scanner.start(cameras[0]);
    } else {
        console.error("camera not started");
    }
});
      
// Manual QR Enter
let plzField = document.getElementById("qr");
plzField.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        socket.emit('getUser',(event.target.value));
    }
});  

// User Details From DB
socket.on('userDetails', (e) => {
    // alert(e.name)
    document.getElementById('myForm').style.display = 'block'
    document.getElementById('print').style.display = 'block'
    document.getElementById('preview').style.display = 'none'
    document.getElementById('qr').style.display = 'none'
    document.getElementById('btn2').style.display = 'none'
    console.log(e);
    document.getElementById('name').innerText = e.name;
    document.getElementById('company').innerText = e.company;
})

// Download IMG of user details
function downloadReceipt() {
const data = document.getElementById('myForm');
html2canvas(data,{allowTaint:true}).then(async(canvas) => {
const image64 = canvas.toDataURL();
console.log(image64);
socket.emit('getUrl', image64)
// const data = { image64 };
// const options1 = {
//     method: 'POST',
//     headers: {
//     'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
// };
// const response = await fetch('http://localhost:3000/upload', options1).then( () => {

//     console.log('here');
// })
})
}

// Home For Refresh
socket.on('navigate', (e) => {
    location.reload()
})

function printForm() {
    var formContent = document.getElementById("myForm").innerHTML;
    var printWindow = window.open('', '', 'height=500,width=400');
    printWindow.document.write('<html><head><title>Form Content</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(formContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}