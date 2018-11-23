export class Content {
  type: Type;
  title: string;
  body: string;
  published: Date;
}

type Type = 'FAQ' | 'ARTICLE' | 'HELP';
