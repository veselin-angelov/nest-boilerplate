import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { Api } from '@app/shared/decorators';
import { MessageResponseDto } from '@app/shared/dtos';

export const ApiDeleteUser = () =>
  applyDecorators(
    Api(),
    // ApiProtected((ability) => ability.can(Actions.DELETE, Subjects.USERS)),
    ApiOperation({
      summary: 'Delete a user',
    }),
    ApiExtraModels(MessageResponseDto),
    ApiOkResponse({
      schema: {
        $ref: getSchemaPath(MessageResponseDto),
      },
    }),
  );
