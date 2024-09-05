import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { Api } from '@app/shared/decorators';
import { User } from '@app/users/entities';

export const ApiUpdateCurrentUser = () =>
  applyDecorators(
    Api(),
    // ApiProtected((ability) => ability.can(Actions.UPDATE, Subjects.ME)),
    ApiOperation({
      summary: 'Updates the current logged user profile',
    }),
    ApiExtraModels(User),
    ApiOkResponse({
      schema: {
        $ref: getSchemaPath(User),
      },
    }),
  );
