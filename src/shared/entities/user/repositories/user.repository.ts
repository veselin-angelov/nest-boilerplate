import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '@app/shared/entities/user/entities';

export class UserRepository extends EntityRepository<User> {}
