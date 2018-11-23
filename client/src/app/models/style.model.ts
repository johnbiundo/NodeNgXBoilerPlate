import { Link } from './api-response.model';
import { Metadata } from './metadata.model';

export class Style {
    _id: string;
    name: string;
    user: string;
    html: string;
    sass: string;
    javascript: string;
    logo: string;
    $resource: string;
    $links: [Link];
    $actions: [Link];
    metadata: Metadata;
}
