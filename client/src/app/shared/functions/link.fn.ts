import { Link } from "../../models/api-response.model";

export function goToLink(link: Link | Array<Link>, rel: string) {
  let href: string;

  if (Array.isArray(link)) {
    href = filterLink(<[Link]>link, rel).rel;
  } else {
    href = (<Link>link).rel;
  }
  window.location.href = href;
}

export function filterLink(links: Array<Link>, rel: string): Link {
  return links.filter(link => link.rel === rel)[0];

}
