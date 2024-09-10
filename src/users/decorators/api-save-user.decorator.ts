import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { Api } from '@app/shared/decorators';
import { InjectIdToBodyInterceptor } from '@app/shared/interceptors';
import { User } from '@app/shared/entities/user/entities';

export const ApiSaveUser = (edit = false) =>
  applyDecorators(
    Api(),
    // ApiProtected((ability) =>
    //   ability.can(edit ? Actions.UPDATE : Actions.CREATE, Subjects.USERS),
    // ),
    ApiOperation({
      summary: 'Save a user',
    }),
    ApiExtraModels(User),
    ApiOkResponse({
      schema: {
        $ref: getSchemaPath(User),
      },
    }),
    UseInterceptors(InjectIdToBodyInterceptor),
  );
