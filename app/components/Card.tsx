import { Link } from 'react-router';

export type CardProps = {
	bg: string;
	featured?: boolean;
	title?: string;
	count?: number | string;
	to: string;
};

export function Large(props: CardProps) {
	return (
		<Link
			to={props.to}
			className="card h-[300px] lg:h-[350px] xl:h-[400px]"
			style={{ backgroundImage: `url(${props.bg})` }}
		>
			{props.featured && (
				<div className="font-mono absolute top-5 right-7 text-shadow-lg">FEATURED</div>
			)}
			<div className="px-7 py-5 bg-linear-to-t from-black/60 via-black/20  to-transparent leading-loose text-shadow-lg">
				<h2 className="text-2xl">{props.title}</h2>
				<div className="flex gap-2">
					<span>{props.count} 张照片</span>
				</div>
			</div>
		</Link>
	);
}

export function Medium(props: CardProps) {
	return (
		<div className="flex flex-col gap-4">
			<Link
				to={props.to}
				className="card h-[200px]"
				style={{ backgroundImage: `url(${props.bg})` }}
			/>
			{props.title && props.count && (
				<div className="flex flex-col gap-3 leading-loose">
					<h2 className="text-xl">{props.title}</h2>
					<div className="text-sm flex gap-2">
						<span>{props.count} 张照片</span>
					</div>
				</div>
			)}
		</div>
	);
}

const Card = {
	Large,
	Medium
};

export default Card;
