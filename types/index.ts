interface RespOK<T = any> {
    code: 'ok',
    data: T
}

interface RespNG {
    code: 'ng',
    data: 'invalid parameter' | 'nothing'
}

export type Resp<T = any> = RespOK<T> | RespNG;