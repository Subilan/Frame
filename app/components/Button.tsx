import type { ComponentProps } from 'react';
import { Link, type LinkProps } from 'react-router';

function buttonClass(className?: string) {
	return ['primary-button', className].filter(Boolean).join(' ');
}

export function Button({ className, ...props }: ComponentProps<'button'>) {
	return <button className={buttonClass(className)} {...props} />;
}

export function ButtonLink({ className, ...props }: LinkProps) {
	return <Link className={buttonClass(className)} {...props} />;
}

export default Button;
