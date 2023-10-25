// write your code here
document.addEventListener('DOMContentLoaded', () => {
    const ramenMenu = document.getElementById('ramen-menu');
    const ramenDetail = document.getElementById('ramen-detail');
    const newRamenForm = document.getElementById('new-ramen-form');
    const editRamenForm = document.getElementById('edit-ramen-form');
  
    // Function to fetch and display all ramen images
    function fetchAndDisplayRamen() {
      fetch('http://localhost:3000/ramens')
        .then((response) => response.json())
        .then((ramenData) => {
          ramenMenu.innerHTML = ''; // Clear the ramen menu
  
          ramenData.forEach((ramen) => {
            const ramenImage = document.createElement('img');
            ramenImage.src = ramen.image;
            ramenImage.addEventListener('click', () => displayRamenDetail(ramen));
            ramenMenu.appendChild(ramenImage);
          });
  
          // Display details for the first ramen as soon as the page loads
          if (ramenData.length > 0) {
            displayRamenDetail(ramenData[0]);
          }
        });
    }
  
    // Function to display ramen details
    function displayRamenDetail(ramen) {
      ramenDetail.innerHTML = ''; // Clear the ramen detail
  
      const ramenInfo = document.createElement('div');
      ramenInfo.innerHTML = `
        <img src="${ramen.image}" />
        <h2>${ramen.name}</h2>
        <h3>${ramen.restaurant}</h3>
        <p>Rating: ${ramen.rating}</p>
        <p>Comment: ${ramen.comment}</p>
        <button id="edit-ramen-button">Edit</button>
        <button id="delete-ramen-button">Delete</button>
      `;
      ramenDetail.appendChild(ramenInfo);
  
      const editRamenButton = document.getElementById('edit-ramen-button');
      const deleteRamenButton = document.getElementById('delete-ramen-button');
  
      // Event listener for the "Edit" button
      editRamenButton.addEventListener('click', () => {
        editRamenForm.style.display = 'block';
        document.getElementById('new-rating').value = ramen.rating;
        document.getElementById('new-comment').value = ramen.comment;
      });
  
      // Event listener for the "Delete" button
      deleteRamenButton.addEventListener('click', () => deleteRamen(ramen));
    }
  
    // Event listener for the new ramen form submission
    newRamenForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const image = document.getElementById('new-ramen-image').value;
      const name = document.getElementById('new-ramen-name').value;
      const restaurant = document.getElementById('new-ramen-restaurant').value;
      const rating = document.getElementById('new-ramen-rating').value;
      const comment = document.getElementById('new-ramen-comment').value;
  
      if (image && name && restaurant && rating && comment) {
        createRamen(image, name, restaurant, rating, comment);
      } else {
        alert('All fields are required.');
      }
    });
  
    // Event listener for the edit ramen form submission
    editRamenForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const newRating = document.getElementById('new-rating').value;
      const newComment = document.getElementById('new-comment').value;
  
      if (newRating && newComment) {
        const currentRamen = getCurrentRamen();
        updateRamen(currentRamen, newRating, newComment);
      } else {
        alert('Rating and comment are required.');
      }
    });
  
    // Function to create a new ramen
    function createRamen(image, name, restaurant, rating, comment) {
      fetch('http://localhost:3000/ramens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image, name, restaurant, rating, comment }),
      })
        .then(() => {
          // Clear form fields
          document.getElementById('new-ramen-image').value = '';
          document.getElementById('new-ramen-name').value = '';
          document.getElementById('new-ramen-restaurant').value = '';
          document.getElementById('new-ramen-rating').value = '';
          document.getElementById('new-ramen-comment').value = '';
  
          // Fetch and refresh the ramen menu
          fetchAndDisplayRamen();
        });
    }
  
    // Function to update the rating and comment for the current ramen
    function updateRamen(ramen, newRating, newComment) {
      fetch(`http://localhost:3000/ramens/${ramen.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: newRating, comment: newComment }),
      })
        .then(() => {
          // Clear the edit form
          editRamenForm.style.display = 'none';
          document.getElementById('new-rating').value = '';
          document.getElementById('new-comment').value = '';
  
          // Refresh the ramen detail
          displayRamenDetail(ramen);
        });
    }
  
    // Function to delete a ramen
    function deleteRamen(ramen) {
      fetch(`http://localhost:3000/ramens/${ramen.id}`, {
        method: 'DELETE',
      })
        .then(() => {
          // Clear the ramen detail
          ramenDetail.innerHTML = '';
  
          // Fetch and refresh the ramen menu
          fetchAndDisplayRamen();
        });
    }
  
    // Function to get the current displayed ramen details
    function getCurrentRamen() {
      const currentRamenId = document.querySelector('#ramen-detail img').src;
      return JSON.parse(localStorage.getItem('ramenData')).find((ramen) => ramen.image === currentRamenId);
    }
  
    // Initial fetch when the page loads
    fetchAndDisplayRamen();
  });
  