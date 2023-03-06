import { HttpException } from '@nestjs/common';

export class GenericDBType {
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export class APIError {
  name: string;
  message: string;
  details?: string[];
  traceId?: string;
}

export class APIException extends HttpException {}

export class APIResponse {
  ok: boolean;
  data?: unknown;
  error?: APIError;

  constructor(ok: boolean, response?: unknown) {
    this.ok = ok;
    if (ok) {
      this.data = response;
    } else {
      this.error = response as APIError;
    }
  }
}
