/* eslint-disable */

// @ts-nocheck

import { Route as rootRouteImport } from './routes/__root';
import { Route as IndexRouteImport } from './routes/index';
import { Route as ProductsIndexRouteImport } from './routes/products.index';
import { Route as ProductsCategoryRouteImport } from './routes/products.$category';
import { Route as ProductsCategoryProductRouteImport } from './routes/products.$category.$product';

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any);

const ProductsIndexRoute = ProductsIndexRouteImport.update({
  id: '/products/',
  path: '/products/',
  getParentRoute: () => rootRouteImport,
} as any);

const ProductsCategoryRoute = ProductsCategoryRouteImport.update({
  id: '/products/$category',
  path: '/products/$category',
  getParentRoute: () => rootRouteImport,
} as any);

const ProductsCategoryProductRoute = ProductsCategoryProductRouteImport.update({
  id: '/$product',
  path: '/$product',
  getParentRoute: () => ProductsCategoryRoute,
} as any);

interface ProductsCategoryRouteChildren {
  ProductsCategoryProductRoute: typeof ProductsCategoryProductRoute;
}

const ProductsCategoryRouteChildren: ProductsCategoryRouteChildren = {
  ProductsCategoryProductRoute,
};

const ProductsCategoryRouteWithChildren = ProductsCategoryRoute._addFileChildren(
  ProductsCategoryRouteChildren,
);

interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  ProductsCategoryRoute: typeof ProductsCategoryRouteWithChildren;
  ProductsIndexRoute: typeof ProductsIndexRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute,
  ProductsCategoryRoute: ProductsCategoryRouteWithChildren,
  ProductsIndexRoute,
};

export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes();
