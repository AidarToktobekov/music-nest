import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from 'src/schemas/album.schema';
import { CreateAlbumDto } from './create-album.dto';
import { QueryParamDto } from 'src/tracks/create-track.dto';

@Controller('albums')
export class AlbumsController {
    constructor(
        @InjectModel(Album.name)
        private albumModel: Model<AlbumDocument>,
    ){}

    @Get()
    getAll(@Query() reqParam: QueryParamDto){
        if (reqParam.filter) {
            return this.albumModel.find({artist: reqParam.filter}); 
        }
        return this.albumModel.find();
    }

    @Get(':id')
    getOne(@Param('id') id: string){
        return this.albumModel.findById({_id: id});
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {dest: './public/albums'}),
    )
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() albumDto: CreateAlbumDto,
    ){
        const album = new this.albumModel({
            name: albumDto.name,
            artist: albumDto.artist,
            image: file? `/albums/${file.filename}` : null,
            date: new Date(),
            isPublished: false,
        });
        
        return album.save();
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return this.albumModel.findByIdAndDelete({_id: id});
    }
}
