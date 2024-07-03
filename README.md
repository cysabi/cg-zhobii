# `cg-party-wheel`
> randomizer for party wheel

A web-based wheel element that you can configure and spin! 
- Using a beta version of [bento](https://github.com/cysabi/bento)!

## usage
Download `cg-party-wheel.zip` from the most recent release, unzip, and run!
- Update the `config.yaml` file with your own modifier names, `desc`riptions, and `weight`s.

## local setup
- Inside `bento.box.ts`, set `DEV_ENV` to `true`
- `bun --watch bento.box.ts`

### building for production
- There are 2 parts: the server binary, and the static dist folder
- `bun run build` to build `dist/`
- `bun run compile` to compile the bento server for windows, make sure to set `DEV_ENV=false`!
- `bun run zip` to zip up `dist/`, `config.yaml`, and `cg-party-wheel.exe`!

---

*empathy included • [**@cysabi**](https://github.com/cysabi) • [cysabi.github.io](https://cysabi.github.io)*