import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from 'src/schemas/artist.schema';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenAuthGuard } from 'src/auth/token-auth.guard';
import { Request } from 'express';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('artists')
export class ArtistsController {
    constructor(
        @InjectModel(Artist.name)
        private artistModel: Model<ArtistDocument>,
    ){}

    @Get()
    getAll(){
        return this.artistModel.find();
    }

    @Get(':id')
    getOne(@Param('id') id: string){
        return this.artistModel.findById({_id: id});
    }

    @UseGuards(TokenAuthGuard)
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {dest: './public/artists'}),
    )
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() artistDto: CreateArtistDto
    ){
        const artist = new this.artistModel({
            name: artistDto.name,
            description: artistDto.description? artistDto.description : null,
            image: file? `/artists/${file.filename}` : null,
            isPublished: false,
        });      
        
        return artist.save();
    }

    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string , @Req() req: Request){
        return this.artistModel.findByIdAndDelete({_id: id});
    }
}
