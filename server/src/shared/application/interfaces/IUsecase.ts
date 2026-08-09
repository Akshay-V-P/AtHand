export interface IUsecase<TRequest, TResponse>{
    execute(data: TRequest): Promise<TResponse>;
}