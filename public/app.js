function uploadImage() {
    const input = document.getElementById('imageInput');
    const imageContainer = document.getElementById('imageContainer');
    const puzzleImage = document.getElementById('puzzleImage');

    input.onchange = function (event) {
        const file = event.target.files[0];
        const imageURL = URL.createObjectURL(file);
        puzzleImage.src = imageURL;
        imageContainer.style.display = 'block';
        document.getElementById('puzzleLink').style.display = 'none';  // Hide the puzzle link when uploading a new image
    };

    input.click();
}

function generatePuzzle() {
    const formData = new FormData();
    const fileInput = document.getElementById('imageInput');
    formData.append('image', fileInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        const puzzleLink = window.location.origin + data.link;
        document.getElementById('puzzleLink').href = puzzleLink;
        document.getElementById('puzzleLink').style.display = 'inline-block';
        window.open(puzzleLink, '_blank');  // Open the puzzle link in a new tab
    })
    .catch(error => console.error('Error:', error));
}

