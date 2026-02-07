import { XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { CSSTransition } from 'react-transition-group';

export type ModalProps = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	children: ReactNode;
	overlayChildren?: ReactNode;
	width?: string;
};

export type ModalControl = Pick<ModalProps, 'open' | 'setOpen'>;

export default function Modal(props: ModalProps) {
	const handleKeydown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				props.setOpen(false);
			}
		},
		[props.setOpen]
	);

	useEffect(() => {
		document.addEventListener('keydown', handleKeydown);

		return () => document.removeEventListener('keydown', handleKeydown);
	}, []);

	const targetRef = useRef(null);

	return (
		<CSSTransition
			unmountOnExit
			in={props.open}
			nodeRef={targetRef}
			timeout={200}
			classNames={'fade'}
		>
			<RemoveScroll>
				<div
					ref={targetRef}
					className="fixed top-0 left-0 z-100001 bg-black/60 h-dvh w-dvw flex items-center justify-center"
					onClick={e => {
						props.setOpen(false);
					}}
				>
					<div
						className="rounded-3xl relative shadow-2xl p-8 bg-neutral-800 mx-5 xl:mx-0 w-full md:w-auto"
						style={{ width: props.width || '400px' }}
						onClick={e => e.stopPropagation()}
					>
						<div
							onClick={() => props.setOpen(false)}
							className="rounded-full cursor-pointer hover:opacity-60 active:opacity-30 absolute top-8 right-8"
						>
							<XIcon />
						</div>
						{props.children}
					</div>
					{props.overlayChildren}
				</div>
			</RemoveScroll>
		</CSSTransition>
	);
}
