//Event listener for Logout Button
document.getElementById('logOutBtn').addEventListener('click', () =>{
    localStorage.removeItem('loginData');
    window.location.href = 'index.html';
    history.replaceState(null, '', 'index.html');
});