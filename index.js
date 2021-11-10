// Adds some elements as variables: file upload button, source image, and code output box
let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
let codeoutput = document.getElementById('codeoutput');
let schematicTextArea = document.getElementById('schematicTextArea');
inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

schematicTextArea.value="bXNjaAF4nJ2Pu07DMBSGTy5qpXJb080TLCQZurFWYuAiMfQFXNtNLBqf6NhRyYYYWJAYEGPfgNdgKw/AzMwbMBQnwAsgL/Z/fvn7DkQQhxAbXilILrDQgklt6yVv2QKJ6YoXysKOVFaQrp1GA9NTP2isYivtSlY6V9uTPLeNxLnixmaFj5t5pjGvtJGNddSm/T9poYwi7pDyGPaWHSz9hcGwUtb6DhxUWhCmNaHwCRIMrOeIEgBigKA7gb9HcQAv/2OPRjPs/V2p7bFfsUZy/qGYQKnYgrBiLTbExFLXc+QkmTYO+8ZlJ8eu/uQyNiuV6Yriup//uDLflsRXfdTjsyj05tG+Nz+6WQt5C4eDx+e3j7v169l0cL/dJu8Pm8n502R3nIwTaD+HX0EEIUQjCL8BOt6J8A==";

// This code adds functionality to the collapsible menus. 
// Stolen from https://www.w3schools.com/howto/howto_js_collapsible.asp
var collapsibleMenus = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < collapsibleMenus.length; i++) {
  collapsibleMenus[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
} 

// Generates and displays the code when an image is uploaded
imgElement.onload = function() {
  let newSize = new cv.Size(40, 40); // The resolution of the image for the display

  let uploadedImage = cv.imread(imgElement); // Loads the uploaded image as an OpenCV mat
  let resizedImage = new cv.Mat();

  cv.resize(uploadedImage, resizedImage, newSize, cv.INTER_NEAREST); // Resizes the image
  cv.imshow('resizedImageCanvas', resizedImage);

  codeoutput.value = imageToCode(resizedImage, 160);

  uploadedImage.delete();
  resizedImage.delete();
};

// Selects and copies the code in the code box
function copySchematic() {
  schematicTextArea.select();
  schematicTextArea.setSelectionRange(0, 999999);
  schematicTextArea.execCommand("copy")
}

// Converts an image to code
function imageToCode(image, displaySize) {
  let imageAsCode = "";
  let pixel = 0;
  let pixelSize = displaySize / image.rows;

  imageAsCode += "sensor draw switch1 @enabled\n" +
                  "jump 3 equal draw true\n" +
                  "end\n"+
                  "draw clear 0 0 0 0 0 0 \n"

  for(let x = 0; x < image.cols; x++) {
    for(let y = 0; y < image.rows; y++) {
      pixel = image.ucharPtr(y, x);
      imageAsCode += `draw color ${pixel[0]} ${pixel[1]} ${pixel[2]} ${pixel[3]} 0 0\n`;
                                                      /* the displaySize - (y + 1) * pixelSize is necessary because 
                                                      the top corner in OpenCV is (0, 0) 
                                                      but in Mindustry it is (80, 0)  */
      imageAsCode += `draw rect ${x * pixelSize} ${displaySize - ((y + 1) * pixelSize)} ${pixelSize} ${pixelSize} 0 0\n`;
    }
    imageAsCode += "drawflush display1\n"
  }

  imageAsCode += "control enabled switch1 false 0 0 0\n";

  return imageAsCode;
}
