import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { genSalt, compare, hash } from 'bcrypt';

    export interface UserMethods{ 
        generateToken: ()=> void;
        checkPassword: (password: string) => Promise<boolean>;
    }

    export type UserDocument = User & Document & UserMethods;

    const SALT_WORK_FACTOR = 10;

    @Schema()
    export class User {
        @Prop({
            required: true,
            unique: true,
        })
        username: string;

        @Prop({ required: true })
        password: string;

        @Prop({ required: true })
        token: string;

        @Prop({
            required: true,
            default: 'user',
            enum: ['user', 'admin']
        })
        role: string;

        @Prop()
        displayName: string;
    }

    export const UserSchema = SchemaFactory.createForClass(User);

    UserSchema.methods.generateToken = function () {
        this.token = crypto.randomUUID();
    };
    
    UserSchema.methods.checkPassword = function (password) {
        return compare(password, this.password);
    };
  
    UserSchema.pre<UserDocument>('save', async function () {
        if (!this.isModified('password')) return;
        const salt = await genSalt(SALT_WORK_FACTOR);
        this.password = await hash(this.password, salt); 
    });
        
    UserSchema.set('toJSON', {
        transform: (_doc, ret) => {
        delete ret.password;
        return ret;
        },  
    });