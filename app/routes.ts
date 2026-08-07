import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [layout('./layouts/NavLayout.tsx', [
    index('./routes/index.tsx'),
    route('/collection/*', './routes/collection.tsx'),
    route('/categories', './routes/categories.tsx'),
    route('/chronicles', './routes/chronicles.tsx'),
    route('/chronicles/:slug', './routes/chronicle.tsx')
])] satisfies RouteConfig;
