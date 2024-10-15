import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headerValue = request.get('Authorization');

    if (!headerValue) {
      console.log('wrong token ' + headerValue);
      return false;
    }
    const [,token] = headerValue.split(' ');
    const user = await this.userModel.findOne({ token });
    if (!user) {
      console.log('token ' + token);
      console.log('user dont exist ' + user);
      return false;
      
    }

    request.user = user;
    return true;
  }
}