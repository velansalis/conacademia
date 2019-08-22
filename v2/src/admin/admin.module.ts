import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './admin.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Admin',
                schema: AdminSchema,
            },
        ]),
    ],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule {}
