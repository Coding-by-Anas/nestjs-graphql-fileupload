import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { join } from 'path';


@Resolver()
export class AppResolver {
    @Query(() => String)
    async getName(): Promise<string> {
        return 'Coding by Anas';
    }

    @Mutation(() => Boolean, { name: 'uploadImage' })
    async uploadImage(
        @Args({ name: 'image', type: () => GraphQLUpload })
        image: Upload,
        @Args({ name: 'createFileInDirectory', type: () => Boolean })
        createFileInDirectory: boolean,
    ) {
        const file = await image;

        console.log('UPLOAD_IMAGE_CALLED', {
            file,
            createFileInDirectory,
        });

        return new Promise((resolve, reject) => {
            if (createFileInDirectory) {
                const dirPath = join(__dirname, '/uploads');

                if (!existsSync(dirPath)) {
                    mkdirSync(dirPath, { recursive: true });
                }

                file
                    .createReadStream()
                    .pipe(createWriteStream(`${dirPath}/${file.filename}`))
                    .on('finish', () => {
                        console.log('IMAGE_CREATED_IN_DIRECTORY');
                        resolve(true);
                    })
                    .on('error', error => {
                        console.log('IMAGE_UPLOAD_ERROR', error);
                        reject(false);
                    });
            } else {
                file
                    .createReadStream()
                    .on('data', data => {
                        console.log('DATE_FROM_STREAM', data);
                    })
                    .on('end', () => {
                        console.log('END_OF_STREAM');
                        resolve(true);
                    })
                    .on('error', error => {
                        console.log('IMAGE_UPLOAD_ERROR', error);
                        reject(false);
                    });
            }
        });
    }
}
