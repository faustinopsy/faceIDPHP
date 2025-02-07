export default class Navbar {
    constructor(navigateCallback, isUserLoggedIn) {
        this.navigateCallback = navigateCallback;
        this.isUserLoggedIn = isUserLoggedIn;
    }

    render() {
        const navbarElement = document.createElement('header');
        navbarElement.className = 'navbar';

        const menuItems = this.isUserLoggedIn
            ? ['','register', 'backend', 'logout']
            : ['login','register'];

        menuItems.forEach(item => {
            const linkElement = document.createElement('a');
            linkElement.href = '#';
            linkElement.textContent = item.charAt(0).toUpperCase() + item.slice(1); 
            linkElement.dataset.link = item;
            linkElement.addEventListener('click', (event) => this.onNavigate(event, item));
            navbarElement.appendChild(linkElement);
        });

        const hamburgerIcon = document.createElement('span');
        hamburgerIcon.className = 'hamburger-icon';
        hamburgerIcon.innerHTML = '&#9776;';
        hamburgerIcon.addEventListener('click', this.toggleHamburgerMenu);
        navbarElement.appendChild(hamburgerIcon);

        return navbarElement;
    }

    onNavigate(event, link) {
        event.preventDefault();
        this.navigateCallback(link);
    }

    toggleHamburgerMenu() {
        const navbarElement = document.querySelector('.navbar');
        navbarElement.classList.toggle('responsive');
    }
    update(isUserLoggedIn) {
        this.isUserLoggedIn = isUserLoggedIn;
        const navbarElement = this.render();
        document.body.replaceChild(navbarElement, document.querySelector('header'));
    }
}
