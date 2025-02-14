import { Role } from './Role';
import { SessionEntity } from './Session.entity';
import { TwitchUserEntity } from './TwitchUser.entity';
import { User } from './User';

const entities = [User, Role, TwitchUserEntity];

export { User, Role, SessionEntity, TwitchUserEntity };
export default entities;
