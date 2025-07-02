import axios from 'axios';

const client = axios.create({
    baseURL: 'https://movie.pequla.com/api',
    headers: {
        'Accept': 'application/json',
        'X-Client-Name': 'CinemaTicketShop'
    },
    validateStatus: (status: number) => {
        return status === 200;
    }
});

export class MovieService {
    static async getMovies(page: number = 0, size: number = 10) {
        return client.request({
            url: '/movie',
            method: 'GET',
            params: {
                'page': page,
                'size': size,
                'sort': 'scheduledAt, asc'
            }
        });
    }

    static async getMovieById(movieId: number) {
        return client.request({
            url: `/movie/${movieId}`,
            method: 'GET'
        });
    }
}