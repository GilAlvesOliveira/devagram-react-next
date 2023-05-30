import HttpService from './httpService';

export default class FeedService extends HttpService {
    async carregarPostagens(idUsuario) {
        let url = '/feed';
        if (idUsuario) {
            url += `?id=${idUsuario}`;
        }

        return this.get(url);
    }
}