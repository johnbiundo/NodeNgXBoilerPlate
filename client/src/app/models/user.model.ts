import { Link } from './api-response.model';
import { Metadata } from './metadata.model';

export class User {
  _id?: string;
  profile?: Profile;
  status?: Status;
  defaults?: [string];
  role?: string;
  password?: string;
  providers?: Providers;
  isAdmin: boolean;
  $resource?: string;
  $adminLinks?: [Link];
  $adminActions?: Array<Link>;
  metadata?: UserMetadata;

  constructor(
    _id?: string,
    profile?: Profile,
    status?: Status,
    defaults?: Array<string>,
    role?: string,
    password?: string,
    providers?: Providers,
    isAdmin?: boolean,
    $resource?: string,
    $adminLinks?: [Link],
    $adminActions?: [Link],
    metadata?: UserMetadata
  ) {
    this._id = _id;
    this.profile = profile;
    this.status = status;
    this.role = role;
    this.password = password;
    this.providers = providers;
    this.isAdmin = isAdmin;
    this.$resource = $resource;
    this.$adminLinks = $adminLinks;
    this.$adminActions = $adminActions;
    this.metadata = metadata;
  }
}

export class Profile {
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  jobRole?: string;
  fullName?: string;
  initials?: string;
  avatar?: string;
}

export class Status {
  confirmed?: boolean;
  optInEmail?: boolean;
  eula?: boolean;
}

export class Providers {
  sso?: Provider;
  facebook?: Provider;
  github?: Provider;
  linkedin?: Provider;
  google?: Provider;
}

export class Provider {
  id?: string;
  token?: string;
  type?: string;
}

class UserMetadata extends Metadata {
  lastLogin?: string;
  logins?: number;
}


