export default class User {
    constructor(apiUrl, apiStrategy) {
        this.apiUrl = apiUrl;
        this.apiStrategy = apiStrategy;
    }

    async fetchUsers() {
        return await this.apiStrategy.fetchUsers();
    }

    async buscarUsuariosRelatorio(){
        return await this.apiStrategy.buscarUsuariosRelatorio();
    };
    async excluirUsuario (registro){
        return await this.apiStrategy.excluirUsuario(registro);
    };

    async render() {
        const userData = await this.buscarUsuariosRelatorio();
        const container = document.createElement('div');
        container.className = 'container';
    
        const title = document.createElement('h1');
        title.textContent = 'Usuário Logado';
        container.appendChild(title);
    
        const userList = document.createElement('ul');
        if (userData.status) {
            const usuario = userData.usuario;
            const userItem = document.createElement('li');
            userItem.textContent = `${usuario.id} (E-mail: ${usuario.email}) `;
    
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => this.confirmarExclusao(usuario);
            userItem.appendChild(deleteButton);
    
            userList.appendChild(userItem);
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Erro ao carregar usuário.';
            container.appendChild(errorMessage);
        }
        container.appendChild(userList);
    
        return container;
    }

    async confirmarExclusao(usuario) {
        if (confirm(`Tem certeza que deseja excluir o usuário ${usuario.email}?`)) {
            await this.excluirUsuario(usuario.id);
            document.getElementById('main-container').innerHTML = '';
            document.getElementById('main-container').appendChild(await this.render());
        }
    }
}
