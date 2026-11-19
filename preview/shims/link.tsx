import { forwardRef } from "react";
import { toHash } from "../routes";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean };
const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ href, prefetch: _p, ...rest }, ref) {
  void _p;
  const h = href.startsWith("/") ? toHash(href) : href;
  return <a ref={ref} href={h} {...rest} />;
});
export default Link;
