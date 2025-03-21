import fetch, { RequestInit, Response } from 'node-fetch';
import { ErrorCodes, TypeErrors } from '@common/constants/errors';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
  console.log("WENASSSS :::: 1 ");

    const errorBody = await response.text();

    /* throw new Error(`[ :: HTTP Error :: ] ${response.status}:> ${errorBody}`); */
    console.log(`[ :: HTTP Error :: ] ${response.status}:> ${errorBody}`);

    throw {
      code      : ErrorCodes.RESPONSE_ERROR,
      tipoError : TypeErrors.BAD_REQUEST,
      message   : response.statusText || 'GENERAL ERROR IN THE REQUEST',
      status    : response.status,
    };
  }
  console.log("WENASSSS :::: ");
  
  const jsonResponse = (await response.json()) as T;

  const res = jsonResponse || {
    url        : response.url,
    status     : response.status,
    statusText : response.statusText,
  };
  console.log(`[ :: HTTP Response :: ] -> ${JSON.stringify(res)}`);
  return res as T;
};

export const get = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(url, { method: 'get', ...options });
  return handleResponse<T>(response);
};

export const post = async <T>(
  url: string,
  body: Record<string, unknown>,
  headers?: any,
  options?: RequestInit,
): Promise<T> => {
  console.log(`Request POST.. ${url}  ${JSON.stringify(body)}`);
  const response = await fetch(url, {
    method  : 'post',
    body    : JSON.stringify(body) as BodyInit,
    headers : { 'Content-Type': 'application/json', ...headers },
    ...options,
  } as RequestInit);

  return handleResponse<T>(response);
};

export const put = async <T>(
  url: string,
  data: Record<string, unknown>,
  headers?: Record<string, string>,
): Promise<T> => {
  console.log(`Request PUT.. ${url}  ${JSON.stringify(data)}`);
  const response = await fetch(url, {
    method  : 'put',
    body    : JSON.stringify(data),
    headers : { 'Content-Type': 'application/json', ...headers },
  });
  return handleResponse<T>(response);
};

export const remove = async <T>(
  url: string,
  headers?: Record<string, string>,
): Promise<T> => {
  const response = await fetch(url, {
    method: 'delete',
    headers,
  });
  return handleResponse<T>(response);
};
