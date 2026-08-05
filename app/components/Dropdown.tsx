import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import { CSSTransition } from 'react-transition-group';
import type { LucideIcon } from 'lucide-react';
import { RemoveScroll } from 'react-remove-scroll';

export type DropdownProps<T> = {
	title?: string;
	value: T;
	valueDisplay?: (value: T) => ReactNode;
	setValue: React.Dispatch<React.SetStateAction<T>>;
	items: { label: string; value: T; key?: string; icon?: LucideIcon }[];
};

export default function Dropdown<T>({
	title,
	value,
	setValue,
	items,
	valueDisplay
}: DropdownProps<T>) {
	const [dropdown, setDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	useOutsideAlerter(dropdownRef, () => setDropdown(false));
	const ValueIcon = useMemo(() => items.find(item => item.value === value)?.icon, [value]);

	const defaultDisplay = useCallback(
		(value: T) => items.find(x => x.value === value)?.label,
		[items]
	);
	const display = valueDisplay ?? defaultDisplay;

	return (
		<div className="relative">
			<button onClick={() => setDropdown(true)} className="primary-button">
				<span className="text-neutral-400 hidden md:inline">{title}</span>{' '}
				<span className="hidden md:inline">{display(value)}</span>
				<span className="md:hidden">{ValueIcon && <ValueIcon size={20} />}</span>
			</button>
			<CSSTransition
				in={dropdown}
				unmountOnExit
				timeout={200}
				nodeRef={dropdownRef}
				classNames={'scale'}
			>
				<RemoveScroll>
					<div
						ref={dropdownRef}
						className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] z-5 backdrop-blur-xs hover:bg-neutral-800/60 shadow-xl min-w-[150px] bg-neutral-800/50 border border-neutral-700 p-2 rounded-xl"
					>
						{items.map(item => (
							<div
								key={item.key ?? item.label}
								className="hover:bg-neutral-700/50 active:bg-neutral-500/50 rounded-lg p-2 cursor-default select-none"
								onClick={() => {
									setValue(item.value);
									setDropdown(false);
								}}
							>
								{item.label}
							</div>
						))}
					</div>
				</RemoveScroll>
			</CSSTransition>
		</div>
	);
}
