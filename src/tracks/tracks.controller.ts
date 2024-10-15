import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from 'src/schemas/track.schema';
import { CreateTracktDto, QueryParamDto } from './create-track.dto';
import { TokenAuthGuard } from 'src/auth/token-auth.guard';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('tracks')
export class TracksController {
    constructor(
        @InjectModel(Track.name)
        private trackModel: Model<TrackDocument>,
    ){}

    @Get()
    getAll(@Query() reqParam: QueryParamDto){
        if (reqParam.filter) {
            return this.trackModel.find({album: reqParam.filter});
        }
        
        return this.trackModel.find();
    }

    @UseGuards(TokenAuthGuard)
    @Post()
    async create(
        @Body() trackDto: CreateTracktDto,
    ){
        const album = await this.trackModel.find({album: trackDto.album});
        
        const track = new this.trackModel({
            name: trackDto.name,
            album: trackDto.album,
            duration: trackDto.duration,
            isPublished: false,
            trackNumber: album.length,
        })

        return track.save();
    }

    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string){
        return this.trackModel.findByIdAndDelete({_id: id});
    }
}
