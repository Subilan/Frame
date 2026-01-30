import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [layout('./layouts/NavLayout.tsx', [
    index('./routes/home.tsx'),
    route('/collection/*', './routes/collection.tsx')
])] satisfies RouteConfig;
