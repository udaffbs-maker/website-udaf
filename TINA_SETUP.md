# TinaCMS Deployment Guide for UDAF

To use TinaCMS on your live site with the free plan, follow these final steps:

## 1. Create a Tina Cloud Account

- Go to [tina.io](https://tina.io/) and sign up for a free account.
- Create a new project and link it to your GitHub repository (you'll need to push the current code to GitHub first).

## 2. Get your Credentials

Once the project is created in Tina Cloud:

- Copy the **Client ID**.
- Generate a **Content Token** and copy it.

## 3. Set Environment Variables

In your hosting provider (Vercel, Netlify, etc.):

- Add `NEXT_PUBLIC_TINA_CLIENT_ID` with your Client ID.
- Add `TINA_TOKEN` with your Content Token.

## 4. Local Development

To run TinaCMS locally:

- Create a `.env` file in the root directory (do not commit this file).
- Add your credentials:
  ```env
  NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id
  TINA_TOKEN=your_content_token
  ```
- Run `npm run dev`. You can access the CMS at `http://localhost:4321/admin`.

## 5. Deployment Script

The `package.json` has been updated so that `npm run build` will automatically run `tinacms build` before `astro build`. This ensures your CMS search index and assets are ready for production.
