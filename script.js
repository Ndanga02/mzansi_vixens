document.getElementById("enterBtn").addEventListener("click", function() {
    document.getElementById("ageBanner").style.display = "none";
    document.getElementById("homePage").style.display = "block";
});


//Search
// Sample data for testing
const escorts = [
    { name: 'Samantha', city: 'Polokwane', services: 'Massage', image: 'img/OIP.jpg' },
    { name: 'Thandi', city: 'Thohoyandou', services: 'Private sessions', image: 'img/OIP.jpg' },
    { name: 'Linda', city: 'Tzaneen', services: 'Companion', image: 'img/OIP.jpg' },
    { name: 'Patricia', city: 'Phalaborwa', services: 'Escort services', image: 'img/OIP.jpg' }
];

// Search Function
function searchEscorts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.innerHTML = ''; // Clear previous results

    const filteredEscorts = escorts.filter(escort => 
        escort.name.toLowerCase().includes(query) || 
        escort.city.toLowerCase().includes(query) || 
        escort.services.toLowerCase().includes(query)
    );

    if (filteredEscorts.length > 0) {
        filteredEscorts.forEach(escort => {
            resultsDiv.innerHTML += `
                <div class="result-item">
                    <img src="${escort.image}" alt="${escort.name}">
                    <h3>${escort.name}</h3>
                    <p>City: ${escort.city}</p>
                    <p>Services: ${escort.services}</p>
                </div>
            `;
        });
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
}

//Forum
// Mockup Data for Forum Topics
const topics = [
    { title: 'How to find the best services in Thohoyandou', category: 'Escort Discussions', replies: 10, author: 'Samantha' },
    { title: 'Review of top escorts in Polokwane', category: 'Reviews', replies: 20, author: 'John' }
];

// Filter Forum Topics by Category
function filterCategory(category) {
    const forumTopics = document.querySelector('.forum-topics');
    forumTopics.innerHTML = '';

    const filteredTopics = topics.filter(topic => topic.category === category);

    if (filteredTopics.length === 0) {
        forumTopics.innerHTML = '<p>No topics found in this category.</p>';
    } else {
        filteredTopics.forEach(topic => {
            forumTopics.innerHTML += `
                <div class="topic-item">
                    <h3 class="topic-title"><a href="#">${topic.title}</a></h3>
                    <p class="topic-meta">Posted by: ${topic.author} | ${topic.replies} Replies</p>
                    <button class="upvote-btn">&#9650;</button> <button class="downvote-btn">&#9660;</button>
                </div>
            `;
        });
    }
}

// Handle Posting a New Thread
document.querySelector('.new-thread-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.querySelector('.thread-input').value;
    const category = document.querySelector('.category-select').value;
    const content = document.querySelector('.thread-textarea').value;

    if (title && content) {
        topics.push({ title, category, replies: 0, author: 'You' });
        alert('New thread posted successfully!');
        filterCategory(category);
    } else {
        alert('Please fill in all fields.');
    }
});

//REGISTER PAGE
document.querySelector('.register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cellphone = document.getElementById('cellphone').value;
    const securityKey = document.getElementById('securityKey').value;
    const tcsChecked = document.getElementById('tcs').checked;

    if (!email || !password || !cellphone || !securityKey || !tcsChecked) {
        alert('Please fill out all fields and agree to the terms and conditions.');
        return;
    }

    // Submit form logic goes here
    alert('Registration successful!');
});

document.querySelector('.login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    // Perform login logic here
    alert('Login successful!');
});

// Route to list all escorts
app.get('/escorts', async (req, res) => {
    try {
        const escorts = await db.collection('escorts').find().toArray();
        res.render('all_escorts', { escorts });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching escorts', error: err });
    }
});
