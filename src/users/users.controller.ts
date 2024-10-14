import { Controller, Post, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  
    @Post()
    registerUser(@Req() req: Request) {
        const user = new this.userModel({
            username: req.body.username,
            password: req.body.password,
            displayName: req.body.displayName,
        });
        user.generateToken();
        return user.save();
    }  
}
  
