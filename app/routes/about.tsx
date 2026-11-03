import type { Route } from './+types/about';

export function meta({}: Route.MetaArgs) {
	return [{ title: '关于 - the frame' }, { name: 'description', content: '关于 the frame' }];
}

export default function About({}: Route.ComponentProps) {
	return (
		<div className="max-w-[1200px] mx-5 xl:mx-auto my-16">
			<section className="mb-10 flex flex-col gap-3 align-center text-center">
				<h1 className="font-bold text-5xl">About</h1>
			</section>
			<section className="mx-auto prose prose-lg prose-invert">
				<p>
					此网站承载了部分我过去所拍的照片，大部分为旅游风景照，使用iPhone拍摄。此网站上的照片经过了挑选，是我所拍的所有照片的一个子集。
				</p>
				<p>
					为了节省流量并提高访问速度，此网站上呈现的照片均经过了压缩处理。同时，网站通过调用高德地图提供的逆地理位置编码接口，对照片EXIF中的
					GPS信息进行了加工，获取了相关位置、景点信息，以此来丰富网站上呈现的信息并增强检索功能。
				</p>
				<p>
					如果你恰好对本站或本站上的照片感兴趣，或有疑问，欢迎通过邮件与我联系，我的邮箱是<a href='mailto:1843917482@qq.com'>1843917482@qq.com</a>。
				</p>
				<p>
					照片以
					<a
						target="_blank"
						href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans"
					>
						CC BY-SA 4.0
					</a>
					协议开放，你无需与我联系即可免费使用这些照片，前提是按照协议要求操作，这包括但不仅限于正确署名——即包含本站的地址（<a href='https://album.hskl.me'>https://album.hskl.me</a>）。
				</p>
				<p>我不是专业的摄影师，但对以纯粹的视角记录事物抱有兴趣。</p>
			</section>
		</div>
	);
}
