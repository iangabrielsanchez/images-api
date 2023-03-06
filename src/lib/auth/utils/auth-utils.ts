import * as crypto from 'crypto';
import { promisify } from 'util';

type SaltHashPair = { salt: string; hash: string };
export class AuthUtils {
  private static generateHash = promisify(crypto.pbkdf2).bind(crypto);

  static async generateSaltAndHash(password: string): Promise<SaltHashPair> {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = (
      await this.generateHash(password, salt, 10000, 64, 'sha512')
    ).toString('hex');
    return {
      salt,
      hash,
    };
  }

  static async validatePassword(
    password: string,
    hash: string,
    salt: string,
  ): Promise<boolean> {
    const generatedHash = (
      await this.generateHash(password, salt, 10000, 64, 'sha512')
    ).toString('hex');

    return hash === generatedHash;
  }
}
