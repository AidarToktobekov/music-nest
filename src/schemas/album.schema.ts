import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from 'mongoose';
import { Artist } from "./artist.schema";

export type AlbumDocument = Album & Document;

@Schema()
export class Album{
    @Prop({required: true})
    name: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
    })
    album: Artist;

    @Prop()
    image: string;

    @Prop({required: true})
    isPublished: boolean;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);