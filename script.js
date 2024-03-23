
function getList() {
    return axios.get("https://crudcrud.com/api/db3c4c653a8d4d0c881db7734bc539bb/bookings");
}


function displayList(bookings) {
    const enteredData = document.querySelector('.enteredData');
    enteredData.innerHTML = ''; 

    if (bookings.length === 0) {
        enteredData.innerHTML = '<h1><b>Nothing Present</b><h1>';
        return;
    }

    const list = document.createElement('ul');
    bookings.forEach(booking => {
        const listItem = document.createElement('li');
        listItem.textContent = `${booking.name}, ${booking.seatNo}`;

    
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => edit(booking._id));

        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteBooking(booking._id));

       
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

       
        list.appendChild(listItem);
    });
    enteredData.appendChild(list);
}


function updateTotalCount(bookings) {
    const totalElement = document.querySelector('.total h4');
    totalElement.textContent = `Total Booked: ${bookings.length}`;
}


function isSeatAlreadyBooked(seatNumber, bookings) {
    return bookings.some(booking => booking.seatNo === seatNumber);
}

function booking() {
    const name = document.getElementById("username").value;
    const seatNum = document.getElementById("seatnumber").value;

  
    getList()
        .then(response => {
            const existingBookings = response.data;

            if (isSeatAlreadyBooked(seatNum, existingBookings)) {
                alert('This seat is already booked. Please choose another seat.');
                return;
            }

    
            return axios.post("https://crudcrud.com/api/db3c4c653a8d4d0c881db7734bc539bb/bookings", {
                "name": name,
                "seatNo": seatNum
            });
        })
        .then(() => {
            return getList();
        })
        .then(response => {
            const updatedBookings = response.data;
            displayList(updatedBookings);
            updateTotalCount(updatedBookings);
        })
        .catch(error => console.log(error));
}


function edit(booking) {
   
    const newName = prompt("Enter new name:", booking.name);
    const newSeatNo = prompt("Enter new seat number:", booking.seatNo);
    axios.put(`https://crudcrud.com/api/db3c4c653a8d4d0c881db7734bc539bb/bookings/${booking}`, {
        "name": newName,
        "seatNo": newSeatNo
    })
    .then(() => {
        return getList();
    })
    .then(response => {
        const updatedBookings = response.data;
        displayList(updatedBookings);
        updateTotalCount(updatedBookings);
    })
    .catch(error => console.log(error));
}


function deleteBooking(bookingId) {
    axios.delete(`https://crudcrud.com/api/db3c4c653a8d4d0c881db7734bc539bb/bookings/${bookingId}`)
    .then(() => {
        
        return getList();
    })
    .then(response => {
        const updatedBookings = response.data;
        displayList(updatedBookings);
        updateTotalCount(updatedBookings);
    })
    .catch(error => console.log(error));
}


const postBtn = document.getElementById("btncls");
postBtn.addEventListener("click", booking);

getList()
    .then(response => {
        const initialBookings = response.data;
        displayList(initialBookings);
        updateTotalCount(initialBookings);
    })
    .catch(error => console.log(error));


function filterBookings(bookings, query) {
    return bookings.filter(booking => {
        return booking.name.toLowerCase().includes(query.toLowerCase());
    });
}

function updateDisplayedList(bookings) {
    const enteredData = document.querySelector('.enteredData');
    enteredData.innerHTML = ''; 

    if (bookings.length === 0) {
        enteredData.innerHTML = '<b>No matching results found</b>';
        return;
    }

    const list = document.createElement('ul');
    bookings.forEach(booking => {
        const listItem = document.createElement('li');
        listItem.textContent = `${booking.name}, ${booking.seatNo}`;
        list.appendChild(listItem);
    });
    enteredData.appendChild(list);
}


const searchInput = document.getElementById('text');
searchInput.addEventListener('input', function() {
    const searchQuery = this.value.trim(); 
    getList()
        .then(response => {
            const bookings = response.data;
            const filteredBookings = filterBookings(bookings, searchQuery);
            updateDisplayedList(filteredBookings);
        })
        .catch(error => console.log(error));
});
