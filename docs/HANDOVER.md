# Adding photos to the PT SUGEE website

1. Go to https://ptsugee.com/studio and sign in.
2. Open **Project Gallery** and click **Create new**.
3. Upload the photo, choose the service it belongs to, and fill in the alt text (a short description).
4. Press **Publish**. The photo appears on the website within a minute.

To remove a photo, open it and choose **Delete**.

Tips: use JPG or WebP, at least 1600 px wide, under 2 MB.

---

Agency notes: site is on Netlify (`ptsugee`), CMS is Sanity project `4wqvzcqy` (dataset `production`). A Sanity webhook calls `/api/revalidate` on publish; its secret is `SANITY_REVALIDATE_SECRET` on Netlify. Invite the client to the Sanity project as **Editor**.
