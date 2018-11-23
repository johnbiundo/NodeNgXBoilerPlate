export class ApiResponse {
  message: string;
  payload?: any;
  links?: Array<Link>;
  action?: Link;
  $collectionSize?: number;
  $records?: number;
  $next?: string;
}

export class Link {
  rel: string;
  href?: string;
  data?: any;
  params?: any;
  param?: any;
  css?: string;
  icon: string;
  method?: HttpMethod;
}

export enum HttpMethod {
  get,
  post,
  put,
  patch,
  delete
}
