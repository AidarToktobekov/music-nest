import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { TokenAuthGuard } from 'src/auth/token-auth.guard';

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

    @UseGuards(AuthGuard('local'))
    @Post('sessions')
    async login(@Req() req: Request) {
        console.log(req.body);
        
        return req.user;  
    }

    @UseGuards(TokenAuthGuard)
    @Get('secret')
    async secret(@Req() req: Request) {
      return req.user;
    }
}
  
