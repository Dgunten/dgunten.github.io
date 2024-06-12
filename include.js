function includeHTML() {
    let elements = document.querySelectorAll('[data-include]');
    elements.forEach(element => {
        let file = element.getAttribute('data-include');
        fetch(file)
            .then(response => {
                if (response.ok) return response.text();
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                element.innerHTML = data;
            })
            .catch(error => {
                console.log('Error:', error);
                element.innerHTML = 'Page not found.';
            });
    });
}

document.addEventListener('DOMContentLoaded', includeHTML);
