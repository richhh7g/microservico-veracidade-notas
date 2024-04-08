import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyMiddleware } from 'src/api/middleware';
import { CNPJHTTPDataSourceImpl } from 'src/datasource/cnpj';
import { DocumentValidationController } from 'src/api/controller';
import { CNPJWebServiceClientImpl } from 'src/datasource/client';
import { DocumentValidateUseCaseImpl } from 'src/usecase/document';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [DocumentValidationController],
  providers: [
    {
      provide: 'DocumentValidateUseCase',
      useClass: DocumentValidateUseCaseImpl,
    },
    {
      provide: 'CNPJHTTPDataSource',
      useClass: CNPJHTTPDataSourceImpl,
    },
    {
      provide: 'CNPJWebServiceClient',
      useClass: CNPJWebServiceClientImpl,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes({
      path: '/valida',
      method: RequestMethod.POST,
    });
  }
}
