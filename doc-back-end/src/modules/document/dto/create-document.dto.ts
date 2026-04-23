import { IsNumber, IsString, Min } from "class-validator";


export class CreateDocumentDto {
    @IsString()
    title: string;

    @IsString()
    mimeType: string;

    @IsString()
    url: string;

    @IsNumber()
    @Min(0)
    size: number;

    @IsString()
    hash: string;

}
