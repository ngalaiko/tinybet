# tinybet

excercise auction website powered by [sveltekit](https://kit.svelte.dev)

## running

### development

once you've created a project and installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev
```

### docker

```bash
docker build . --tag tinybet
docker run --rm --interactive --tty tinybet 
open http://127.0.0.1:3000
```

