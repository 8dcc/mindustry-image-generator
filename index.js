// For comments check the original repo
let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
// let codeoutput0 = document.getElementById('codeoutput0');
// let codeoutput1 = document.getElementById('codeoutput1');
// let codeoutput2 = document.getElementById('codeoutput2');
// let codeoutput3 = document.getElementById('codeoutput3');
let schematicTextArea = document.getElementById('schematicTextArea');
inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

schematicTextArea.value = "bXNjaAF4nJ2Pu07DMBSGTy5qpXJb080TLCQZurFWYuAiMfQFXNtNLBqf6NhRyYYYWJAYEGPfgNdgKw/AzMwbMBQnwAsgL/Z/fvn7DkQQhxAbXilILrDQgklt6yVv2QKJ6YoXysKOVFaQrp1GA9NTP2isYivtSlY6V9uTPLeNxLnixmaFj5t5pjGvtJGNddSm/T9poYwi7pDyGPaWHSz9hcGwUtb6DhxUWhCmNaHwCRIMrOeIEgBigKA7gb9HcQAv/2OPRjPs/V2p7bFfsUZy/qGYQKnYgrBiLTbExFLXc+QkmTYO+8ZlJ8eu/uQyNiuV6Yriup//uDLflsRXfdTjsyj05tG+Nz+6WQt5C4eDx+e3j7v169l0cL/dJu8Pm8n502R3nIwTaD+HX0EEIUQjCL8BOt6J8A==";

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

imgElement.onload = function() {
    let newSize = new cv.Size(44, 44);

    let uploadedImage = cv.imread(imgElement);
    let resizedImage = new cv.Mat();

    cv.resize(uploadedImage, resizedImage, newSize, cv.INTER_NEAREST);
    cv.imshow('resizedImageCanvas', resizedImage);

    for (let i = 0; i <= 3; i++) {
        document.getElementById('codeoutput' + i).value = imageToCode(resizedImage, i, 176);
    }

    uploadedImage.delete();
    resizedImage.delete();
};

// Selects and copies the code in the code box
function copyCodeOutput(i) {
  document.getElementById('codeoutput' + i).select();
  document.getElementById('codeoutput' + i).setSelectionRange(0, 999999);
  document.execCommand("copy")
}

// Selects and copies the code in the code box
function copySchematic() {
  schematicTextArea.select();
  schematicTextArea.setSelectionRange(0, 999999);
  schematicTextArea.execCommand("copy")
}

function imageToCode(image, number, displaySize) {
    let imageAsCode = "";
    let pixel = 0;
    let pixelSize = displaySize / image.rows;

    if (number === 0) {
        imageAsCode += "sensor draw switch1 @enabled\n" +
            "jump 3 equal draw true\n" +
            "end\n" +
            "draw clear 0 0 0 0 0 0 \n" +
            "write 1 cell1 0\n"
    } else {
        imageAsCode += "sensor draw switch1 @enabled\n" +
            "read p cell1 0\n" +
            "jump 4 equal draw true\n" +
            "end\n" +
            "jump 6 equal p 1\n" +
            "end\n"
    }

    for (let x = number*11; x < number*11+11; x++) {
        for (let y = 0; y < image.rows; y++) {
            pixel = image.ucharPtr(y, x);
            imageAsCode += `draw color ${pixel[0]} ${pixel[1]} ${pixel[2]} ${pixel[3]} 0 0\n`;
            imageAsCode += `draw rect ${x * pixelSize} ${displaySize - ((y + 1) * pixelSize)} ${pixelSize} ${pixelSize} 0 0\n`;
        }
        imageAsCode += "drawflush display1\n"
    }

    if (number === 0) {
        imageAsCode += "control enabled switch1 false 0 0 0\n"+
                        "write 0 cell1 0"
    }

    return imageAsCode;
}
