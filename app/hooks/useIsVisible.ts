import { useState, useEffect, useRef } from 'react';

export function useIsVisible<T extends HTMLElement>() {
	const [isIntersecting, setIntersecting] = useState(false);
	const ref = useRef<T>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			setIntersecting(entry.isIntersecting);
		});

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, []);

	return [ref, isIntersecting] as const;
}
