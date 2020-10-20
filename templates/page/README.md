<div align="center">
    <h1>{{ package-name }}</h1>
    <p>{{ description }}</p>
    <a href="https://github.com/TobitSoftware/chayns-toolkit">
        <img 
            alt="Managed with chayns-toolkit" 
            src="https://img.shields.io/badge/managed%20with-chayns--toolkit-%23000?style=for-the-badge"
        />
    </a>
</div>

---

## Get Started

To get started with working on the project first you have to install its
dependencies:

```bash
{{ install-command }}
```

Then you will have the following commands available:

### `{{ run-command }} dev`

This starts the project with a local server for development. Typically this will
be on [`http://localhost:1234/`](http://localhost:1234/), but this
[can be adjusted](https://github.com/TobitSoftware/chayns-toolkit#development-options).

### `{{ run-command }} build`

This builds your project for production.

> If you want to analyze your bundle size you can do so by passing the `-a` flag
> to this command.

### `{{ run-command }} lint`

Checks your project for errors and code quality.

### `{{ run-command }} format`

Automatically formats all of the source code in your project.

---

This project is based on
[`chayns-toolkit`](https://github.com/TobitSoftware/chayns-toolkit). If you
encounter any issues with the toolchain and the commands, please
[open an issue](https://github.com/TobitSoftware/chayns-toolkit/issues/new).
