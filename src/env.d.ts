// /// <reference types="vite/client" />

// declare module "*.vue" {
//   import { DefineComponent } from "vue"
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
//   const component: DefineComponent<{}, {}, any>
  
//   export default component
// }

/// <reference types="@dcloudio/types" />
/// <reference types="vite/client" />

import "vue";

declare module "@vue/runtime-core" {
  type Hooks = App.AppInstance & Page.PageInstance;

  interface ComponentCustomOptions extends Hooks {

  }
}

declare module "*.vue" {
  import { DefineComponent } from "vue"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  
  export default component
}

// export {}

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;

  interface ComponentCustomOptions extends Hooks {}
}
