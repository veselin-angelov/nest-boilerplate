import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { Api } from '@app/shared/decorators';
import { User } from '@app/shared/entities/user/entities';

export const ApiCurrentUser = () =>
  applyDecorators(
    Api(),
    // ApiProtected((ability) => ability.can(Actions.READ, Subjects.ME)),
    ApiOperation({
      summary: 'Returns the current logged user',
    }),
    ApiExtraModels(User),
    ApiOkResponse({
      schema: {
        $ref: getSchemaPath(User),
      },
    }),
  );
