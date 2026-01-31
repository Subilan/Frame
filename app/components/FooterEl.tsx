export default function FooterEl() {
	return (
		<div className="p-5">
			<div className="flex lg:flex-row flex-col gap-1 lg:gap-0 lg:items-center text-neutral-500">
				<p>the frame</p>
				<div className="flex-1 h-px mx-3 bg-neutral-800" />
				<p>
					&copy; 2025-2026, all photos are under{' '}
					<a className="text-neutral-400 hover:underline" href="https://creativecommons.org/licenses/by-sa/4.0/">
						CC BY-SA 4.0
					</a>
				</p>
			</div>
		</div>
	);
}
