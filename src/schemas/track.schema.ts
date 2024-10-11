import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from 'mongoose';
import { Album } from "./album.schema";

export type TrackDocument = Track & Document;

@Schema()
export class Track{
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    duration: string;

    @Prop({required: true})
    trackNumber: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
    })
    album: Album;

    @Prop({required: true})
    isPublished: boolean;
}

export const ArtistSchema = SchemaFactory.createForClass(Track);