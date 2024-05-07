import axios, { Method, AxiosResponse, ResponseType } from 'axios';
import apiLinks from '../Commons/ApiEndpoints';
import { TOKEN } from '../Commons/Global';
import { message } from 'antd';


interface Options {
    url: ((al: typeof apiLinks) => string) | string;
    data?: object | string;
    params?: object;
    signal?: AbortSignal;
    contentType?: string;
    responseType?: ResponseType;
    // onUploadProgress: () => void;
    authorization?: string;
    routing?: string;
}

interface FullOptions extends Options {
    method: Method;
}

const request = (arg: FullOptions): Promise<AxiosResponse> => {
    //   const { token, documentToken ,cookieValue } = store.getState().auth;\
    const token = localStorage.getItem(TOKEN)
    //   const cookie=getCookie(CookiesName.NAME)
    const {
        method,
        contentType = 'application/json',
        url,
        data,
        params,
        signal,
        responseType = 'json',
        authorization = `bearer ${token ?? ''}`,
        routing,
    } = arg;

    const source = axios.CancelToken.source();
    if (signal) {
        signal.addEventListener('abort', () => {
            source.cancel();
        });
    }

    return axios.request({
        method,
        headers: {
            'content-type': contentType,
               Authorization: authorization
            //     routing === 'document'
            //       ? documentToken?.access_token ?? ''
            //       : token?.access_token 
            // cookie
            //   ? cookie
            //   : routing === 'document'
            //   ? documentToken?.access_token ?? ''
            //   : token?.access_token ?? ''
            //   }`,
        },
        url: typeof url === 'string' ? url : url(apiLinks),
        data,
        params,
        responseType,
        cancelToken: source.token,
    }).catch((e)=>{
        throw new Error(e)
    });
};

const httpClient = {
    request,
    get: (arg: Options): Promise<AxiosResponse> => {
        return request({ ...arg, method: 'GET' });
    },
    post: (arg: Options): Promise<AxiosResponse> => {
        return request({ ...arg, method: 'POST' });
    },
    put: (arg: Options): Promise<AxiosResponse> => {
        return request({ ...arg, method: 'PUT' });
    },
    delete: (arg: Options): Promise<AxiosResponse> => {
        return request({ ...arg, method: 'DELETE' });
    },
    option: (arg: Options): Promise<AxiosResponse> => {
        return request({ ...arg, method: 'OPTIONS' });
    },
    patch: (arg: Options): Promise<AxiosResponse> => {
        return request({ ...arg, method: 'PATCH' });
    },
    
};

export default httpClient;

