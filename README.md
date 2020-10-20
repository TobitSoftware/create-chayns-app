<div align="center">
    <h1>
        <img src="https://raw.githubusercontent.com/TobitSoftware/create-chayns-app/HEAD/assets/logo.png" width="500px" alt="create-chayns-app" />
    </h1>
    <p>Create a new chayns® development project in one command.</p>
    <div>
        <img src="https://img.shields.io/github/license/TobitSoftware/create-chayns-app?style=for-the-badge" alt="" />
        <img src="https://img.shields.io/npm/v/create-chayns-app?style=for-the-badge" alt="" />
        <img src="https://img.shields.io/github/last-commit/TobitSoftware/create-chayns-app?style=for-the-badge" alt="" />
        <img src="https://img.shields.io/github/issues-raw/TobitSoftware/create-chayns-app?style=for-the-badge" alt="" />
    </div>
</div>

---

This project is the easiest and fastest way to start developing projects your
chayns-Site.

## Overview

-   [Get Started](#get-started)
    -   [Developing a Custom Page](#developing-a-custom-page)
    -   [Developing a Pagemaker Iframe](#developing-a-pagemaker-iframe)
-   [FAQ](#faq)
    -   [What is the difference between an Pagemaker plugin and a complete page?](#what-is-the-difference-between-an-pagemaker-plugin-and-a-complete-page)
    -   [How can I deploy my finished app so it will be permanently available to all users on my Site?](#how-can-i-deploy-my-finished-app-so-it-will-be-permanently-available-to-all-users-on-my-site)

## Get Started

To bootstrap a new chayns® project, simply run

```bash
npx create-chayns-app
```

or

```bash
yarn create chayns-app
```

This will start an interactive wizard to guide you through the creation of your
project.

Depending on wether you choose to develop a complete page or a pagemaker plugin,
continue with the ["Developing a Custom Page"](#developing-a-custom-page) or the
["Developing a Pagemaker Plugin"](#developing-a-pagemaker-plugin) guides
respectively.

> Don't know what to choose? Check out the
> [FAQ](#what-is-the-difference-between-an-pagemaker-plugin-and-a-complete-page).

### Developing a Custom Page

Since you chose the `A complete page` option, you will be creating a custom
page. Like the output of the initial command said, you can start a local
development server by running

```bash
npm run dev
```

or

```bash
yarn dev
```

To develop your project in the chayns-environment, you have to create a Page on
your chayns-Site. If you do not have one yet, create one
[here](https://chayns.net/).

After finishing the setup of your site go to Administration > Content > Pages
and click the "Add Page" button at the top.

There you want to choose the "Include website" option. Enter a name you like
(e.g. "Local Development") and set the source to `http://localhost:1234/`, which
is the address your local development server will listen to.

Now you can open your newly created page by selecting it in the menu and see
changes to your project in real time!

### Developing a Pagemaker Plugin

If you chose the `A pagemaker plugin` option, you will be creating a plugin for
the Pagemaker, a powerful website editing tool. First you should start a local
development server by running

```bash
npm run dev
```

or

```bash
yarn dev
```

To develop your project in the chayns-environment, you have to create a Page on
your chayns-Site. If you do not have one yet, create one
[here](https://chayns.net/).

After finishing the setup of your site go to Administration > Content > Pages
and click the "Add Page" button at the top.

There you want to choose the "Create a page" option. Enter a name you like (e.g.
"Local Development") and click the button to add the page.

Now you can open your newly created page by selecting it in the menu. Here we
want to go into "admin-mode" by toggling the switch in the main menu, next to
the name of your site.

A floating button with a big plus sign should appear in the bottom right corner.
Click that and choose Interactive > Iframe to add an Iframe to your Page.

Hover over your newly created Iframe and activate the chayns-API by clicking on
the code-symbol and confirming your choice in the dialog.

Now we only have to set the source of the Iframe to the address of your local
development server by tapping on the gear-icon and entering
`http://localhost:1234/` in the second input field.

You are now ready to start developing and see changes to your project in real
time!

## FAQ

### What is the difference between an Pagemaker plugin and a complete page?

A Pagemaker plugin only takes up a small spot on your Page and you can add
regular Pagemaker elements like text, videos, graphics or other interactive
elements before and after your Plugin, that can be easily edited by anyone,
including non-developers.

When developing a complete page, your application will take up all the space on
one page. This means that when you want to add simple content around your
interactive elements you will have to do so in your application code, which will
not be easily editable by other people, especially non-developers.

### How can I deploy my finished app so it will be permanently available to all users on my Site?

The easiest way to deploy your app is to use a modern deployment platform like
[Vercel](https://vercel.com/home) or [Netlify](https://www.netlify.com/). They
make it very easy to deploy your application from a GitHub-repository.

If these platforms ask you for a build command, choose `chayns-toolkit build`
and as a publish directory choose `build`.
