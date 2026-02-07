import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [layout('./layouts/NavLayout.tsx', [
    index('./routes/index.tsx'),
    route('/collection/*', './routes/collection.tsx'),
    route('/categories', './routes/categories.tsx'),
    route('/highlights', './routes/highlights.tsx')
])] satisfies RouteConfig;
