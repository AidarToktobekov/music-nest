import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async validateUser(username: string, pass: string) {
  
    const user = await this.userModel.findOne({ username });
    
    if (user && (await user.checkPassword(pass))) {
        user.generateToken();
        await user.save();
        return user;
    }
        return null;
    }  
}
