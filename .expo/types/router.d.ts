/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/Providers`; params?: Router.UnknownInputParams; } | { pathname: `/address`; params?: Router.UnknownInputParams; } | { pathname: `/auth`; params?: Router.UnknownInputParams; } | { pathname: `/cart`; params?: Router.UnknownInputParams; } | { pathname: `/categories`; params?: Router.UnknownInputParams; } | { pathname: `/checkout`; params?: Router.UnknownInputParams; } | { pathname: `/help`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/notifications`; params?: Router.UnknownInputParams; } | { pathname: `/offers`; params?: Router.UnknownInputParams; } | { pathname: `/order-confirmation`; params?: Router.UnknownInputParams; } | { pathname: `/order-tracking`; params?: Router.UnknownInputParams; } | { pathname: `/payment-methods`; params?: Router.UnknownInputParams; } | { pathname: `/popular`; params?: Router.UnknownInputParams; } | { pathname: `/privacy-security`; params?: Router.UnknownInputParams; } | { pathname: `/products`; params?: Router.UnknownInputParams; } | { pathname: `/seasonal`; params?: Router.UnknownInputParams; } | { pathname: `/settings`; params?: Router.UnknownInputParams; } | { pathname: `/verify-email`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/orders` | `/orders`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/profile` | `/profile`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/search` | `/search`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/wishlist` | `/wishlist`; params?: Router.UnknownInputParams; } | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } } | { pathname: `/product/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/Providers`; params?: Router.UnknownOutputParams; } | { pathname: `/address`; params?: Router.UnknownOutputParams; } | { pathname: `/auth`; params?: Router.UnknownOutputParams; } | { pathname: `/cart`; params?: Router.UnknownOutputParams; } | { pathname: `/categories`; params?: Router.UnknownOutputParams; } | { pathname: `/checkout`; params?: Router.UnknownOutputParams; } | { pathname: `/help`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/notifications`; params?: Router.UnknownOutputParams; } | { pathname: `/offers`; params?: Router.UnknownOutputParams; } | { pathname: `/order-confirmation`; params?: Router.UnknownOutputParams; } | { pathname: `/order-tracking`; params?: Router.UnknownOutputParams; } | { pathname: `/payment-methods`; params?: Router.UnknownOutputParams; } | { pathname: `/popular`; params?: Router.UnknownOutputParams; } | { pathname: `/privacy-security`; params?: Router.UnknownOutputParams; } | { pathname: `/products`; params?: Router.UnknownOutputParams; } | { pathname: `/seasonal`; params?: Router.UnknownOutputParams; } | { pathname: `/settings`; params?: Router.UnknownOutputParams; } | { pathname: `/verify-email`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/orders` | `/orders`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/profile` | `/profile`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/search` | `/search`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/wishlist` | `/wishlist`; params?: Router.UnknownOutputParams; } | { pathname: `/+not-found`, params: Router.UnknownOutputParams & {  } } | { pathname: `/product/[id]`, params: Router.UnknownOutputParams & { id: string; } };
      href: Router.RelativePathString | Router.ExternalPathString | `/Providers${`?${string}` | `#${string}` | ''}` | `/address${`?${string}` | `#${string}` | ''}` | `/auth${`?${string}` | `#${string}` | ''}` | `/cart${`?${string}` | `#${string}` | ''}` | `/categories${`?${string}` | `#${string}` | ''}` | `/checkout${`?${string}` | `#${string}` | ''}` | `/help${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/notifications${`?${string}` | `#${string}` | ''}` | `/offers${`?${string}` | `#${string}` | ''}` | `/order-confirmation${`?${string}` | `#${string}` | ''}` | `/order-tracking${`?${string}` | `#${string}` | ''}` | `/payment-methods${`?${string}` | `#${string}` | ''}` | `/popular${`?${string}` | `#${string}` | ''}` | `/privacy-security${`?${string}` | `#${string}` | ''}` | `/products${`?${string}` | `#${string}` | ''}` | `/seasonal${`?${string}` | `#${string}` | ''}` | `/settings${`?${string}` | `#${string}` | ''}` | `/verify-email${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/orders${`?${string}` | `#${string}` | ''}` | `/orders${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/profile${`?${string}` | `#${string}` | ''}` | `/profile${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/search${`?${string}` | `#${string}` | ''}` | `/search${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/wishlist${`?${string}` | `#${string}` | ''}` | `/wishlist${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/Providers`; params?: Router.UnknownInputParams; } | { pathname: `/address`; params?: Router.UnknownInputParams; } | { pathname: `/auth`; params?: Router.UnknownInputParams; } | { pathname: `/cart`; params?: Router.UnknownInputParams; } | { pathname: `/categories`; params?: Router.UnknownInputParams; } | { pathname: `/checkout`; params?: Router.UnknownInputParams; } | { pathname: `/help`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/notifications`; params?: Router.UnknownInputParams; } | { pathname: `/offers`; params?: Router.UnknownInputParams; } | { pathname: `/order-confirmation`; params?: Router.UnknownInputParams; } | { pathname: `/order-tracking`; params?: Router.UnknownInputParams; } | { pathname: `/payment-methods`; params?: Router.UnknownInputParams; } | { pathname: `/popular`; params?: Router.UnknownInputParams; } | { pathname: `/privacy-security`; params?: Router.UnknownInputParams; } | { pathname: `/products`; params?: Router.UnknownInputParams; } | { pathname: `/seasonal`; params?: Router.UnknownInputParams; } | { pathname: `/settings`; params?: Router.UnknownInputParams; } | { pathname: `/verify-email`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/orders` | `/orders`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/profile` | `/profile`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/search` | `/search`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/wishlist` | `/wishlist`; params?: Router.UnknownInputParams; } | `/+not-found` | `/product/${Router.SingleRoutePart<T>}` | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } } | { pathname: `/product/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
    }
  }
}
