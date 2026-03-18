import { useEffect, type Ref, type RefObject } from 'react';

export default function useOutsideAlerter(
	ref: RefObject<any>,
	action: () => void,
	exceptions?: RefObject<any>[]
) {
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside(event: Event) {
			if (
				ref.current &&
				!ref.current.contains(event.target) &&
				(!exceptions || !exceptions.some(e => e.current.contains(event.target)))
			) {
				action();
			}
		}
		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref]);
}
