const mode = 0;

const host_local = "http://localhost:8080";
const host_remote = "https://test3-latest-p9am.onrender.com";

function getHost() {
    return (mode == 0) ? host_local : host_remote;
}

function isLoggedIn() {
    if(localStorage.getItem("token")) {
        return true;
    } else {
        return false;
    }
}

function getTheToken() {
    return localStorage.getItem("token");
} 

function saveTheToken(token) {
     localStorage.setItem("token", token);
     updateTheNavigationBar();
} 

function removeTheToken() {
    localStorage.removeItem("token");
    updateTheNavigationBar();
} 

let configuration = {
    isLoggedIn: () => isLoggedIn(), 
    host: () => getHost(), 
    token: () => getTheToken()    
};

updateTheNavigationBar();

async function updateTheNavigationBar() {
    const navigation = document.getElementsByClassName("topnav")[0];
    let loginTag = navigation.children[navigation.children.length - 1];
    if(configuration.isLoggedIn()) {
        loginTag.innerHTML = 
        `<li class="right"><a  href="#" onclick="logout()">Logout</a></li>`;
    } else {
        loginTag.innerHTML = `<li class="right"><a  href="login.html">Login</a></li>`;
    }
}



async function signup() {
    let email = document.getElementById("email-signup").value;
    let username = document.getElementById("username-signup").value;
    let password = document.getElementById("password-signup").value;
    let customer = { username: username, password: password, email: email };
    fetch(getHost() + '/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    })
    .then(response => {
        if (response.ok) {
            alert('Signup successful');
        } else {
            console.log(`response status:${response.status}`);            
            alert("Something went wrong!");
            location.href = "index.html";
        }
    })
    .catch(error => {
        console.log(error);
        alert('Something went wrong!');
    });
}




async function login() {    
    let username = document.getElementById("username-login").value;
    let password = document.getElementById("password-login").value;
    let customer = {username: username, password: password}
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
      };
      try {
        let response = await fetch(getHost() + "/signin", request);
        if(response.ok) {  
            alert("The login was successful!");
            const token = await response.text();
            saveTheToken(token);
            localStorage.setItem("username", username);
            alert("The login was successful!");            
            location.href = "index.html";
        } else {
            console.error(error); 
            removeTheToken();         
            alert("Something went wrong!");
        }
      }
      catch(error) {
        console.log(error); 
        removeTheToken();       
        alert("Something went wrong!");
      }    
}

async function logout() {   
    removeTheToken();  
}