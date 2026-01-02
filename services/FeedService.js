import DevagramApiService from './DevagramApiService';

export default class FeedService extends DevagramApiService {
    async carregarPostagens(idUsuario) {
        let url = '/feed';
        if (idUsuario) {
            url += `?id=${idUsuario}`;
        }

        return this.get(url);
    }

    async adicionarComentario(idPostagem, comentario) {
        return this.put(`/comentario?id=${idPostagem}`, {
            comentario
        });
    }

    async alterarCurtida(idPostagem) {
        return this.put(`/like?id=${idPostagem}`);
    }

    async listarCurtidas(idPostagem) {
        try {
            return await this.get(`/like?id=${idPostagem}`);
        } catch (e1) {
            try {
                return await this.get(`/curtidas?id=${idPostagem}`);
            } catch (e2) {
                return this.get(`/publicacao/curtidas?id=${idPostagem}`);
            }
        }
    }

    async fazerPublicacao(dadosPublicacao) {
        return this.post('/publicacao', dadosPublicacao);
    }

    async excluirPublicacao(postId) {
        return this.delete(`/publicacao?postId=${postId}`);
    }
}