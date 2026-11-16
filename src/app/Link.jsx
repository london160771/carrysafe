import { navigate } from './navigation.js';

const PRIMARY_BUTTON = 0;

export default function Link({ to, children, ...rest }) {
  function follow(event) {
    if (event.button !== PRIMARY_BUTTON || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  }

  return (
    <a href={to} onClick={follow} {...rest}>
      {children}
    </a>
  );
}
