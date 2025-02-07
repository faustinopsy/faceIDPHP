
export default class Api {
    constructor(apiUrl) {
      this.apiUrl = apiUrl;
    }
  
    async fetchUsers() {
      const response = await fetch(`${this.apiUrl}UserRouter.php`);
      const data = await response.json();
      return data.usuarios;
    }
  
    async registrar(usuario) {
        try {
            const response = await fetch(`${this.apiUrl}UserRouter.php`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...usuario, acao: 'registrar' }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return { status: false, message: error };
        }
    }
    async buscarFaces() {
        try {
            const response = await fetch(`${this.apiUrl}UserRouter.php?relatorio`);
            const data = await response.json();
            console.log('Usuários recuperados:', data.usuarios);
            return data.usuarios;
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return { status: false, message: error };
        }
    };
    async logar(face){
        try {
            const response = await fetch(`${this.apiUrl}UserRouter.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...face }),
            });
            const data = await response.json();
            return data
        } catch (error) {
            console.error('Erro ao registrar logar:', error);
            return { status: false, message: error };
        }
    };
    async buscarUsuariosRelatorio(){
        try {
            const response = await fetch(`${this.apiUrl}UserRouter.php?relatorio=1`);
            const data = await response.json();
            console.log('Usuários recuperados:', data.usuarios);
            return data.usuarios;
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return { status: false, message: error };
        }
    };
    async excluirUsuario(id){
        try {
            const response = await fetch(`${this.apiUrl}UserRouter.php?id=${id}`, {
                method: 'DELETE',
            });
    
            const data = await response.json();
            console.log('Usuário excluído:', data);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            return { status: false, message: error };
        }
    };

  }