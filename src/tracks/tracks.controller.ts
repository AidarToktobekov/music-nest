import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from 'src/schemas/track.schema';
import { CreateTracktDto, QueryParamDto } from './create-track.dto';

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

    @Post()
    create(
        @Body() trackDto: CreateTracktDto 
    ){

        const allTracks = this.trackModel.find({album: trackDto.album});
        
        const track = new this.trackModel({
            name: trackDto.name,
            album: trackDto.album,
            duration: trackDto.duration,
            isPublished: false,
            trackNumber: 1,
        })

        return track.save();
    }
}
