# webrtc-client

## Modifying @livekit/react-components and @livekit/react-core

We foresee needing to make some number of changes to the @livekit packages. For now we'd like to avoid forking those packages repo because of the hassle associated with keeping something like that up to date.

Unfortunately, because we consume actually built code from the @livekit packages, it's much more difficult to make modifications to the @livekit packages than it might otherwise.

There are 2 slightly different scenarios that we need to address during this process:

1. We'd like to be able to do local development and be able to see the changes we make in our page.
2. We need to then eventually be able to commit those changes to version control and deploy them.

### Local development

Normally there's a straightforward way to tell your package manager (npm or yarn) to use a relative local path for a package:

- [instructions for npm which use a `file:` directive](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#local-paths)
- [instructions for yarn which use a `link:` directive](https://github.com/yarnpkg/rfcs/blob/master/implemented/0000-link-dependency-type.md)

However, there are a handful of reasons why that won't work for us that largely seem to have to do with peer dependency conflicts.

Therefore, it seems like the path of least resistance is going to be to use a tool called [yalc](https://github.com/wclr/yalc)

Starting from cloning both repos:

```sh
[work-dir]$ git clone git@github.com:Invisv-Privacy/webrtc-client.git
[work-dir]$ git clone git@github.com:livekit/livekit-react.git
```

Checkout the livekit-react repo into the correct tag:

```sh
[work-dir]$ cd livekit-react
[work-dir/livekit-react]$ git checkout @livekit/react-components@1.1.0
```

Now make sure that you have the correct package management tools:

- Install nodejs (I recommend [nvm](https://github.com/nvm-sh/nvm) for managing nodejs versions)
- Install yarn: `$ npm install --global yarn`
- Install yalc: `$ yarn global add yalc`

Now configure yalc in both this package and in the @livekit/react-components package:

```sh
[work-dir]$ cd livekit-react
[work-dir/livekit-react]$ yarn install
[work-dir/livekit-react]$ yarn build
[work-dir/livekit-react]$ cd packages/components
[work-dir/livekit-react/packages/components]$ patch -p4 -i ../../../webrtc-client/patches/@livekit+react-components+1.1.0.patch
[work-dir/livekit-react/packages/components]$ yalc publish
[work-dir/livekit-react/packages/components]$ cd ../../../webrtc-client
[work-dir/webrtc-client]$ yarn install
[work-dir/webrtc-client]$ yalc link @livekit/react-components
```

Now you can start the webrtc-client:

```sh
[work-dir/webrtc-client]$ yarn start
```

Now you can make changes to the components you want in the `src` directory.
When you want those changes to be reflected in the webrtc-client, use yalc to "publish" the changes:

```sh
[work-dir]$ cd livekit-react/packages/components
[work-dir/livekit-react/packages/components]$ yalc publish --push
```

The webrtc-client _should_ automatically reload and your changes should then be reflected in the browser.

NOTES:

- It seems like sometimes the `yarn start` command won't pick up new changes to dependencies. In that case, stop the server and remove the cache folder:

```sh
[work-dir/webrct-client]$ rm -rf node_modules/.cache
```

### Committing changes

We're going to use [patch-package](https://www.npmjs.com/package/patch-package) to commit the changes we want to livekit-react.

Once you've made the changes you want to the dependencies, create the patch file and commit:

```sh
[work-dir/webrtc-client]$ yarn run patch-package @livekit/react-components
[work-dir/webrtc-client]$ git add patches
[work-dir/webrtc-client]$ git commit -m "Change something in livekit react-components"
```
