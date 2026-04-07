export type RequestWithParams<T> = Request<{ params: T }>;

export type RequestWithQuery<T> = Request<{ query: T }>;

export type RequestWithBody<T> = Request<{ body: T }>;
